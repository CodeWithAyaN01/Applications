import { app, BrowserWindow, ipcMain, screen } from "electron"
import { desktopCapturer } from "electron"
import path from "path"
import { fileURLToPath } from "url"
import "dotenv/config"
import { extractText, initializeOCR } from "./renderer/ocr.js";
import { startGuidance } from "./guidance/guidanceController.js";
import { captureCurrentScreen } from "./services/captureService.js"
import { analyzeScreen } from "./renderer/ai.js"
// import { findWord, findPhrase, findAllWords } from "./renderer/ocrSearch.js";


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

    // capture scrren section
    // const primaryDisplay = screen.getPrimaryDisplay()
    // const scaleFactor = primaryDisplay.scaleFactor;
    // const { width, height } = primaryDisplay.size

    // const sources = await desktopCapturer.getSources({
    // types: ["screen"],
    // thumbnailSize: {
    //     width: Math.round(width * scaleFactor),
    //     height: Math.round(height * scaleFactor)
    // }
    // });

    // // Native image
    // const screenshot = sources[0].thumbnail;

    // // OCR buffer in PNG Native format
    
    // const enlarged = screenshot.resize({
    //     width: screenshot.getSize().width * 2,
    //     height: screenshot.getSize().height * 2
    // });

    // const ocrBuffer = enlarged.toPNG();

    // // OCR calling 
    
    // const words = await extractText(ocrBuffer)

    // // Print every detected word
    // console.log("Detected Words:");
    // console.log(words.map(word => word.text));

    // // Maintain aspect ratio
    // const targetHeight = 720;
    // const aspect =
    //     screenshot.getSize().width / screenshot.getSize().height;
    
    // const targetWidth =
    //     Math.round(
    //         targetHeight * aspect
    //     );

    // // Resize
    // const resized =
    //     screenshot.resize({

    //         width: targetWidth,
    //         height: targetHeight
    //     });

    // // JPEG Q90
    // const buffer = resized.toJPEG(90);
    // console.log(
    //     "JPEG Size :",
    //     (buffer.length / 1024).toFixed(2),
    //     "KB"
    // );
    // const base64 = buffer.toString("base64");
    
    // return {
    //     image: base64,
    //     words
    // };

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

    const result = await startGuidance(goal);

    if (!result) {
        return;
    }

    const data = JSON.parse(result);

    const { width, height } = screen.getPrimaryDisplay().bounds;

    const x = Math.round(width * (data.targetPercentX / 100));
    const y = Math.round(height * (data.targetPercentY / 100));

    overlayWindow.webContents.send("move-pointer", {
        x,
        y
    });

    overlayWindow.webContents.send("show-explanation", {
        x,
        y,
        text: data.explanation
    });

});
app.whenReady().then(async () => {

    createMainWindow();

    createOverlayWindow();
    
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
