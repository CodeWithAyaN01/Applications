import { GoogleGenAI } from "@google/genai";
import {
    getApiKey,
    getSelectedModel
} from "../services/configService.js";


// Create Gemini client using the saved API key
async function getGeminiClient() {

    const apiKey = await getApiKey();

    if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
    }

    return new GoogleGenAI({
        apiKey
    });
}


// Screen Image → Gemini Vision Analysis
export async function analyzeScreen(imageBase64, prompt, words) {

    const ai = await getGeminiClient();

    const model = getSelectedModel();

    console.log("Gemini Model Used:", model);

    const ocrContext = words.map(word =>
        `Text="${word.text}", x=${word.x}, y=${word.y}, width=${word.width}, height=${word.height}`
    ).join("\n");

    const response = await ai.models.generateContent({

        model,

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

    });

    return response.text;
}

export async function getAvailableModels() {

    const ai = await getGeminiClient();

    const models = await ai.models.list();

    const availableModels = [];

    for await (const model of models) {

        const modelId = model.name.replace("models/", "");
        const modelName = model.displayName || modelId;

        const supportsGenerateContent =
            Array.isArray(model.supportedActions) &&
            model.supportedActions.includes("generateContent");

        const isGeminiModel =
            modelId.startsWith("gemini-");

        const isNotSpecializedModel =
            !modelId.includes("embedding") &&
            !modelId.includes("tts") &&
            !modelId.includes("image") &&
            !modelId.includes("audio") &&
            !modelId.includes("robotics");

        if (
            supportsGenerateContent &&
            isGeminiModel &&
            isNotSpecializedModel
        ) {

            availableModels.push({
                id: modelId,
                name: modelName
            });
        }
    }

    return availableModels;
}

// // Test Gemini connection
export async function testGemini() {

    const ai = await getGeminiClient();

    const model = getSelectedModel();

    const response = await ai.models.generateContent({

        model,

        contents: "Say Hello"

    });

    return response.text;
}