import { createWorker } from "tesseract.js";
let worker = null // Global Worker

export async function initializeOCR() {

    console.log("Initializing OCR...");

    worker = await createWorker("eng");

    console.log("OCR Ready");

}
export async function extractText(imageBuffer) {
    console.log("OCR working")

    const result = await worker.recognize(
        imageBuffer,
        {},
        {
            tsv: true,
            // hocr: true,
            // blocks: true
        }
    );

    console.log("OCR Completed")
    // console.log(result.data.text);

    // console.log("TSV:", result.data.tsv);

    // console.log("HOCR:", result.data.hocr);

    // console.log("Blocks:", result.data.blocks);

    return parseTSV(result.data.tsv)
}

function parseTSV(tsv) {

    const rows = tsv.split("\n");

    const words = [];
    const validWord = /^[A-Za-z0-9._-]+$/;

    for (const row of rows) {

        const columns = row.split("\t");

        const text = columns[11];
        const confidence = Number(columns[10]);


        if (columns[0] !== "5") continue;
        if (!text) continue;
        if (confidence < 55) continue;
        if (text.length < 2) continue;
        if (!validWord.test(text)) continue;

       words.push({
            text,
            x: Number(columns[6]),
            y: Number(columns[7]),
            width: Number(columns[8]),
            height: Number(columns[9]),
            confidence,
            line: Number(columns[4])
        });
    }
    return (words)
}

function groupWordsByLine(words) {

}
