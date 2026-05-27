import { app, BrowserWindow, screen } from "electron";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


let mainWindow;
let overlayWindow;

function createMainWindow() {
    
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    mainWindow = new BrowserWindow({

        width: Math.floor(width * 0.7),
        height: Math.floor(height * 0.8),

        webPreferences: {

            preload: path.join(__dirname, "preload.js"),

            contextIsolation: true,

            nodeIntegration: false
        }
    });

    mainWindow.loadFile(
        path.join(
            __dirname,
            "renderer",
            "index.html"
        )
    );

    mainWindow.webContents.openDevTools();
}

function createOverlayWindow() {

    const primaryDisplay = screen.getPrimaryDisplay();

    const { width, height } = primaryDisplay.bounds;


    overlayWindow = new BrowserWindow({

        width,
        height,

        x: 0,
        y: 0,

        transparent: true,

        frame: false,

        fullscreenable: false,

        alwaysOnTop: true,

        fullscreen: true,

        resizable: false,

        focusable: false,

        skipTaskbar: true,

        hasShadow: false,

        webPreferences: {
            
            preload: path.join(__dirname, "preload.js"), // connet the preload IPC Communication

            contextIsolation: true,

            nodeIntegration: false
        }
    });

    overlayWindow.setIgnoreMouseEvents(true);

    overlayWindow.loadFile(
        path.join(
            __dirname,
            "renderer",
            "overlay.html"
        )
    );
    // overlayWindow.webContents.openDevTools(); //This is to see the coordinates
}

app.whenReady().then(() => {

    createMainWindow();

    createOverlayWindow();

    overlayWindow.webContents.once("did-finish-load", () => {

        // coordinates generation Random send to overlay.js
        setInterval(() => {

            // Now main.js creates coordinates
            const randomX = Math.random() * 1200;

            const randomY = Math.random() * 700;

            overlayWindow.webContents.send(
                "move-pointer",
                {
                    x: randomX,
                    y: randomY
                }
            );

        }, 1000);

    });

});
