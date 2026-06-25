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

        analyzeImage: (image, prompt) => {
            return ipcRenderer.invoke("analyze-screen", image , prompt)
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


    }
);

