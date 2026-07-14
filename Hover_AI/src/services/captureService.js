
import { screen, desktopCapturer } from "electron";
import { extractText } from "../renderer/ocr.js";

export async function captureCurrentScreen() {

    const primaryDisplay = screen.getPrimaryDisplay()
    const scaleFactor = primaryDisplay.scaleFactor;
    const { width, height } = primaryDisplay.size

    const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: {
        width: Math.round(width * scaleFactor),
        height: Math.round(height * scaleFactor)
    }
    });

    // Native image
    const screenshot = sources[0].thumbnail;

    // OCR buffer in PNG Native format
    
    const enlarged = screenshot.resize({
        width: screenshot.getSize().width * 2,
        height: screenshot.getSize().height * 2
    });

    const ocrBuffer = enlarged.toPNG();

    // OCR calling 
    
    const words = await extractText(ocrBuffer)

    console.log("Detected Words:");
    console.log(words.map(word => word.text));

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

    return {
        image: base64,
        words
    }
}