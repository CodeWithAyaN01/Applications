const pointer = document.getElementById("pointer");
const tooltip = document.getElementById("tooltip");
const controlBar = document.getElementById("controlBar");
const goalInput = document.getElementById("goalInput");
const actionButton = document.getElementById("actionButton");
const goalError = document.getElementById("goalError");
const muteButton = document.getElementById("muteButton");
import SpeechService from "../services/speechService.js";

let guidanceRunning = false;

const OverlayState = {
    IDLE: "idle",
    ANALYZING: "analyzing",
    GUIDING: "guiding",
    COMPLETED: "completed",
    ERROR: "error"
};
let currentState = OverlayState.IDLE;

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
            buttonLabel.textContent = "Start";
            goalError.textContent = "";
            break;

        case OverlayState.ANALYZING:
            goalInput.disabled = true;
            actionButton.disabled = true;
            buttonLabel.textContent = "Analyzing...";

            break;

        case OverlayState.GUIDING:
            goalInput.disabled = true;
            actionButton.disabled = false;
            buttonLabel.textContent = "Next Step";
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

    if (!goal && currentState === OverlayState.IDLE) {

        goalError.textContent = "Please enter a goal.";

        goalInput.focus();

        return;
    }

    goalError.textContent = "";

    try {

        switch (currentState) {

            case OverlayState.IDLE:
                setOverlayState(OverlayState.ANALYZING);
                await window.electronAPI.startGuidance(goal);
                setOverlayState(OverlayState.GUIDING);
                break;

            case OverlayState.GUIDING:
                setOverlayState(OverlayState.ANALYZING);
                await window.electronAPI.nextGuidance();
                setOverlayState(OverlayState.GUIDING);
                break;

            case OverlayState.COMPLETED:
                goalInput.value = "";
                setOverlayState(OverlayState.IDLE);
                break;

            case OverlayState.ERROR:
                setOverlayState(OverlayState.ANALYZING);
                await window.electronAPI.nextGuidance();
                setOverlayState(OverlayState.GUIDING);
                break;
        }
    }catch(error) {
        console.log(error)
        goalError.textContent = error.message;
        setOverlayState(OverlayState.ERROR)
    }
}

goalInput.addEventListener("input", () => {

    if (currentState !== OverlayState.IDLE) {
        setOverlayState(OverlayState.IDLE);
    }
});