import { app, BrowserWindow, ipcMain, screen } from "electron"
import { desktopCapturer } from "electron"
import path from "path"
import { fileURLToPath } from "url"
import "dotenv/config"
import { extractText, initializeOCR } from "./renderer/ocr.js";
import { captureCurrentScreen } from "./services/captureService.js"
import { analyzeScreen } from "./renderer/ai.js"
import { setOverlayWindow } from "./services/overlayService.js";
import {startGuidance,nextGuidance} from "./guidance/guidanceController.js";


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

    mainWindow.on("closed", () => {
        if (overlayWindow && !overlayWindow.isDestroyed()) {
            overlayWindow.close();
        }
    });

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

        focusable: true,

        skipTaskbar: true,

        hasShadow: false,

        webPreferences: {
            
            preload: path.join(__dirname, "preload.js"), // connet the preload IPC Communication

            contextIsolation: true,

            nodeIntegration: false
        }
    });

    overlayWindow.setIgnoreMouseEvents(true, {
        forward: true
    });

    overlayWindow.loadFile(
        path.join(
            __dirname,
            "renderer",
            "overlay.html"
        )
    );
    // overlayWindow.webContents.openDevTools(); //This is to see the coordinates
}
// ALL IPC HANDLEARS
ipcMain.handle("capture-screen", async () => {
    return await captureCurrentScreen();
})

// get the base64 image and the prompt and call analyzeScreen() and return gemini response
ipcMain.handle("analyze-screen",

    async (_, image, prompt, words) => {
        const result = await analyzeScreen(image, prompt, words) // calling the gemini
        return result
    }
)

ipcMain.handle("move-pointer",
    (_, x, y) => {
        overlayWindow.webContents.send("move-pointer", 
            {
                x,
                y
            }
        )
    }
)
ipcMain.handle("screen-size",

    () => {
        const { width, height } =
            screen.getPrimaryDisplay().bounds;
        return {
            width,
            height
        };
    }
);
ipcMain.handle("show-explanation",
    (_,x,y,text)=>{
        overlayWindow.webContents.send(
            "show-explanation",
            {
                x,
                y,
                text
            }
            );
        }
    );


ipcMain.handle("set-overlay-mouse-events", (_, ignore) => {

    overlayWindow.setIgnoreMouseEvents(ignore, {
        forward: true
    });

});

ipcMain.handle("overlay:start-guidance", async (_, goal) => {

    const guidance = await startGuidance(goal);

    if (!guidance) {
        return;
    }

    overlayWindow.webContents.send(
        "guidance-update",
        guidance
    );

});

ipcMain.handle("overlay:next-guidance", async () => {

    const guidance = await nextGuidance();

    overlayWindow.webContents.send(
        "guidance-update",
        guidance
    );

});

app.whenReady().then(async () => {

    createMainWindow();

    createOverlayWindow();

    // Register the overlay window
    setOverlayWindow(overlayWindow);
    
    // creats worker for the OCR to read and process multiple Images taking less process times
    await initializeOCR();

    overlayWindow.webContents.once("did-finish-load", () => {

        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.bounds;

    });

});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
