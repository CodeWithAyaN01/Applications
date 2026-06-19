const captureButton = document.getElementById("captureBtn");

const preview = document.getElementById("preview");


captureButton.addEventListener("click",async () => {
        const image = await window.electronAPI.captureScreen(); // this function goes to the preload.js -> the main window
        preview.src = image;
    }

);