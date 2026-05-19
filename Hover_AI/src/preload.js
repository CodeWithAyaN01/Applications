import { contextBridge } from "electron";

contextBridge.exposeInMainWorld(
    "electronAPI",
    {
        test: () => {
            console.log("Secure preload bridge working");
        }
    }
);