// this is Electron Problem the we need to use CommonJS style to work 
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    "electronAPI",
    {
        onMovePointer: (callback) => {

            ipcRenderer.on(
                "move-pointer",
                (_, data) => callback(data)
            );
        },
        
        captureScreen: () => { // this invoked to the main.js
            return ipcRenderer.invoke("capture-screen")
        },

        analyzeImage: (image, prompt, words) => {
            return ipcRenderer.invoke("analyze-screen", image , prompt, words)
        },

        movePointer: (x, y) => {
            return ipcRenderer.invoke("move-pointer", x, y)
        },

        getScreenSize: () => {
            return ipcRenderer.invoke("screen-size")
        },

        showExplanation:(x,y,text)=> {
        return ipcRenderer.invoke("show-explanation",x,y,text);
        },

        onShowExplanation: (callback) => {
            
        ipcRenderer.on("show-explanation",
            (_, data) => callback(data));
        },

        setOverlayMouseEvents: (ignore) => {
            return ipcRenderer.invoke("set-overlay-mouse-events",ignore);
        },
        // overlay to the main process the GOAL String
        startGuidance: (goal) => {
            return ipcRenderer.invoke("overlay:start-guidance", goal);
        },
        
        onGuidanceUpdate: (callback) => {
            ipcRenderer.on(
                "guidance-update",
                (_, data) => callback(data)
            );

        },
    }
);

