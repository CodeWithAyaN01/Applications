const pointer = document.getElementById("pointer");
const tooltip = document.getElementById("tooltip");

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