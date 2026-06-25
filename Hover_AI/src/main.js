import { app, BrowserWindow, ipcMain, screen } from "electron"
import { desktopCapturer } from "electron"
import path from "path"
import { fileURLToPath } from "url"
import "dotenv/config"
import { analyzeScreen } from "./renderer/ai.js"

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
// ALL IPC HANDLEARS

// here the captureScreen converted to 
// ipcMain.handle("capture-screen", async () => {

//     // capture scrren section
//     const primaryDisplay = screen.getPrimaryDisplay()
//     const { width, height } = primaryDisplay.size

//     const sources = await desktopCapturer.getSources({
//         types: ["screen"],
//         thumbnailSize: {
//             width,
//             height
//         }
//     })
//     const screenshot = sources[0].thumbnail;
//     const buffer = screenshot.toPNG()
//     const base64 = buffer.toString("base64")
//     return base64
// })

ipcMain.handle("capture-screen", async () => {

    // capture scrren section
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.size

    const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: {
            width,
            height
        }
    })
    const screenshot = sources[0].thumbnail;

    // Maintain aspect ratio
    const targetHeight = 720;
    const aspect =
        screenshot.getSize().width / screenshot.getSize().height;
    
    const targetWidth =
        Math.round(
            targetHeight * aspect
        );

    // Resize
    const resized =
        screenshot.resize({

            width: targetWidth,
            height: targetHeight
        });

    // JPEG Q90
    const buffer = resized.toJPEG(90);
    console.log(
        "JPEG Size :",
        (buffer.length / 1024).toFixed(2),
        "KB"
    );
    const base64 = buffer.toString("base64");
    return base64;
})


// get the base64 image and the prompt and call analyzeScreen() and return gemini response
ipcMain.handle("analyze-screen",

    async (_, image, prompt) => {
        const result = await analyzeScreen(image, prompt) // calling the gemini
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


app.whenReady().then(async () => {

    createMainWindow();

    createOverlayWindow();

    overlayWindow.webContents.once("did-finish-load", () => {

        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.bounds;

        // coordinates generation Random send to overlay.js
        // setInterval(() => {

        //     // Now main.js creates coordinates
        //     const randomX = Math.random() * width;

        //     const randomY = Math.random() * height;

        //     overlayWindow.webContents.send(
        //         "move-pointer",
        //         {
        //             x: randomX,
        //             y: randomY
        //         }
        //     );

        // }, 1000);

    });

});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
