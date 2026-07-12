import "dotenv/config"
import { GoogleGenAI } from "@google/genai"

// model creating
const ai = new GoogleGenAI({
    apiKey : process.env.GEMINI_API_KEY
})

// ScreenImage to Base64URL analyzeing the image
export async function analyzeScreen(imageBase64, prompt, words) {

    const ocrContext = words.map(word =>
    `${word.text} (${word.x}, ${word.y}, ${word.width}, ${word.height})`).join("\n");

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `${prompt} OCR Data:${ocrContext}`
                    },
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: imageBase64
                        }
                    }
                ]
            }
        ],
        config: {
            temperature: 0.3
        }
    })

    return response.text
}

// test function
export async function testGemini() {

    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: "Say Hello"

    });

    return response.text;
}