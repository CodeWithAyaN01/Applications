const pointer = document.getElementById("pointer");


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