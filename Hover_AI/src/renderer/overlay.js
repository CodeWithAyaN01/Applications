const pointer = document.getElementById("pointer");
const tooltip = document.getElementById("tooltip");
const controlBar = document.getElementById("controlBar");
const goalInput = document.getElementById("goalInput");
const actionButton = document.getElementById("actionButton");
const goalError = document.getElementById("goalError");


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
window.electronAPI.onMovePointer((data) => {
    console.log(data)
    movePointer(data.x, data.y)
})

function updateTooltip(x,y,text){
    tooltip.innerText = text;
    tooltip.style.left = `${x + 30}px`;
    tooltip.style.top = `${y - 20}px`;
}

window.electronAPI.onShowExplanation((data) => {
    updateTooltip(
        data.x,
        data.y,
        data.text
    );
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

function handleStart() {

    const goal = goalInput.value.trim();

    if (!goal) {
        goalError.textContent = "Please enter a goal.";
        goalInput.focus();
        return;
    }
    goalError.textContent = "";
    
    window.electronAPI.startGuidance(goal);
}