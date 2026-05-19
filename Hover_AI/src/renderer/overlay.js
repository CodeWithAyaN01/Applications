const pointer = document.getElementById("pointer");


// pointer movement
function movePointer(x, y) {

    pointer.style.left = `${x}px`;

    pointer.style.top = `${y}px`;
}

setInterval(() => {

    const randomX = Math.random() * window.innerWidth;

    const randomY = Math.random() * window.innerHeight;

    movePointer(randomX, randomY);

}, 2000);