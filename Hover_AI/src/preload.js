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
        }
    }
);