import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const app = express();
const PORT = 6969;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folder you want to share
const SHARED_FOLDER = path.join(__dirname, "../shared");

// Route to show file list
app.get("/", (req, res) => {
    fs.readdir(SHARED_FOLDER, (err, files) => {
        if (err) {
            return res.status(500).send("Error reading folder");
        }

        const fileLinks = files.map(file => {
            return `<li><a href="/files/${file}" target="_blank">${file}</a></li>`;
        }).join("");

        res.send(`
            <h2>📂 My Shared Files</h2>
            <ul>${fileLinks}</ul>
        `);
    });
});

// Serve files
app.use("/files", express.static(SHARED_FOLDER));

// Listen on ALL network interfaces
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT} WIFI-> http://192.168.x.x:6969/`);
});