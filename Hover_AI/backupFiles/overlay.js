const pointer = document.getElementById("pointer");
const tooltip = document.getElementById("tooltip");
const controlBar = document.getElementById("controlBar");
const goalInput = document.getElementById("goalInput");
const actionButton = document.getElementById("actionButton");
const changeGoalButton = document.getElementById("changeGoalButton"); // change goal
const goalError = document.getElementById("goalError");
const muteButton = document.getElementById("muteButton");
const closeButton = document.getElementById("closeButton");
import SpeechService from "../services/speechService.js";

let guidanceRunning = false;

const OverlayState = {
    IDLE: "idle",
    ANALYZING: "analyzing",
    GUIDING: "guiding",
    EDITING_GOAL: "editing-goal",
    COMPLETED: "completed",
    ERROR: "error"
};
let currentState = OverlayState.IDLE;

let previousGoal = "";

controlBar.addEventListener("mouseenter", () => {

    window.electronAPI.setOverlayMouseEvents(false);

});

document.addEventListener("mousemove", (event) => {

    const rect = controlBar.getBoundingClientRect();

    const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

    if (inside) {
        window.electronAPI.setOverlayMouseEvents(false);
    } else {
        window.electronAPI.setOverlayMouseEvents(true);
    }

});

// pointer movement
console.log("Overlay.js Loaded")
function movePointer(x, y) {

    pointer.style.left = `${x}px`;

    pointer.style.top = `${y}px`;
}

// listning the movements from the main.js insted of the this function

window.electronAPI.onGuidanceUpdate((data) => {

    movePointer(
        data.x,
        data.y
    );

    updateTooltip(
        data.x,
        data.y,
        data.explanation
    );

    SpeechService.speak(data.explanation)

});

function updateTooltip(x,y,text){
    tooltip.innerText = text;
    tooltip.style.left = `${x + 30}px`;
    tooltip.style.top = `${y - 20}px`;
}

function setOverlayState(state) {

    currentState = state;

    const buttonLabel =
        actionButton.querySelector(".btn-label");

    switch (state) {

        case OverlayState.IDLE:
            goalInput.disabled = false;
            actionButton.disabled = false;
             changeGoalButton.hidden = true;
            buttonLabel.textContent = "Start";
            goalError.textContent = "";
            break;

        case OverlayState.ANALYZING:
            goalInput.disabled = true;
            actionButton.disabled = true;
            changeGoalButton.hidden = true;
            buttonLabel.textContent = "Analyzing...";

            break;

        case OverlayState.GUIDING:
            goalInput.disabled = true;
            actionButton.disabled = false;
            changeGoalButton.hidden = false;
            buttonLabel.textContent = "Next Step";
            break;

        case OverlayState.EDITING_GOAL:
            goalInput.disabled = false;
            actionButton.disabled = false;
            changeGoalButton.hidden = false;
            buttonLabel.textContent = "Confirm Goal";
            goalError.textContent = "";
            goalInput.focus();
            break;
            
        case OverlayState.COMPLETED:
            goalInput.disabled = false;
            actionButton.disabled = false;
            buttonLabel.textContent = "New Goal";
            break;

        case OverlayState.ERROR:
            goalInput.disabled = false;
            actionButton.disabled = false;
            buttonLabel.textContent = "Retry";
            break;
    }
}

// mute button 
muteButton.addEventListener("click", () => {

    const enabled = SpeechService.toggleMute();

    muteButton.textContent = enabled ? "🔊" : "🔇";

});

closeButton.addEventListener("click", () => {

    window.electronAPI.closeApplication();

});


// ===========================
// Change goal Button
// ===========================

changeGoalButton.addEventListener("click", () => {

    if (currentState === OverlayState.GUIDING) {

        // Save the current goal so Cancel can restore it.
        previousGoal = goalInput.value;

        setOverlayState(OverlayState.EDITING_GOAL);

        // Change the secondary button into Cancel.
        changeGoalButton.textContent = "Cancel";

        return;
    }

    if (currentState === OverlayState.EDITING_GOAL) {

        // Cancel editing.
        goalInput.value = previousGoal;

        goalError.textContent = "";

        setOverlayState(OverlayState.GUIDING);

        // Change the secondary button back.
        changeGoalButton.textContent = "Change Goal";
    }

});

// ===========================
// Draggable Control Bar
// ===========================

let isDragging = false;

let offsetX = 0;
let offsetY = 0;

controlBar.addEventListener("mousedown", (event) => {

    // Ignore clicks on input and button
    if (
        event.target.id === "goalInput" ||
        event.target.id === "actionButton"
    ) {
        return;
    }

    isDragging = true;

    const rect = controlBar.getBoundingClientRect();

    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

});

document.addEventListener("mousemove", (event) => {

    if (!isDragging) return;

    controlBar.style.left = `${event.clientX - offsetX}px`;
    controlBar.style.top = `${event.clientY - offsetY}px`;

    controlBar.style.transform = "none";

});

document.addEventListener("mouseup", () => {

    isDragging = false;

});

//  click event of the goal imput
actionButton.addEventListener("click", handleStart);


async function handleStart() {

    const goal = goalInput.value.trim();

    if (currentState === OverlayState.IDLE) {

        if (!goal) {
            goalError.textContent = "Please enter a goal.";
            goalInput.focus();
            return;
        }

        goalError.textContent = "";

        try {

            setOverlayState(OverlayState.ANALYZING);

            await window.electronAPI.startGuidance(goal);

            setOverlayState(OverlayState.GUIDING);

        } catch (error) {

            console.log(error);

            goalError.textContent = error.message;

            setOverlayState(OverlayState.ERROR);
        }

        return;
    }

    if (currentState === OverlayState.GUIDING) {

        try {

            setOverlayState(OverlayState.ANALYZING);

            await window.electronAPI.nextGuidance();

            setOverlayState(OverlayState.GUIDING);

        } catch (error) {

            console.log(error);

            goalError.textContent = error.message;

            setOverlayState(OverlayState.ERROR);
        }

        return;
    }

    if (currentState === OverlayState.EDITING_GOAL) {

        if (!goal) {

            goalError.textContent = "Please enter a goal.";

            goalInput.focus();

            return;
        }

        goalError.textContent = "";

        try {

            setOverlayState(OverlayState.ANALYZING);

            // Confirm the new goal.
            // This creates a fresh guidance session.
            await window.electronAPI.startGuidance(goal);

            setOverlayState(OverlayState.GUIDING);

        } catch (error) {

            console.log(error);

            goalError.textContent = error.message;

            setOverlayState(OverlayState.ERROR);
        }

        return;
    }

    if (currentState === OverlayState.COMPLETED) {

        goalInput.value = "";

        setOverlayState(OverlayState.IDLE);

        return;
    }

    if (currentState === OverlayState.ERROR) {

        try {

            setOverlayState(OverlayState.ANALYZING);

            await window.electronAPI.nextGuidance();

            setOverlayState(OverlayState.GUIDING);

        } catch (error) {

            console.log(error);

            goalError.textContent = error.message;

            setOverlayState(OverlayState.ERROR);
        }
    }
}

goalInput.addEventListener("input", () => {

    if (currentState === OverlayState.EDITING_GOAL) {
        goalError.textContent = "";
    }

});