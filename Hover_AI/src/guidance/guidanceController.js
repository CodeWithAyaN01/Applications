import { analyzeScreen } from "../renderer/ai.js";
import { extractText } from "../renderer/ocr.js";
import { findWord, findPhrase, findAllWords } from "../renderer/ocrSearch.js";
import { captureCurrentScreen } from "../services/captureService.js";
import { screen } from "electron";

let guidanceSession = null;
export async function startGuidance(goal) {

    console.log(goal);
    const capture = await captureCurrentScreen();

    console.log("Calling Gemini...");
    const prompt = 
    `
    You are HoverAI, a precise on-screen guidance assistant. You receive a screenshot and a user request, and must locate the exact UI element needed.

        Return ONLY this JSON (no markdown, no code fences, no extra text):

        {
            "explanation": "Action verb + target + visible landmark. E.g. 'Click the gear icon at the bottom-left of the Activity Bar.'",
            "targetPercentX": 0.0,
            "targetPercentY": 0.0,
            "confidence": 0.0,
            "requiresNavigation": false,
            "nextStep": if applicable else null
        }

        REQUEST: "${goal}"

        COORDINATES:
        - Percentages, origin (0,0) top-left, (100,100) bottom-right.
        - Point to the CENTER of the target's bounding box (icon graphic, not its label; clickable area for buttons).
        - Decimals allowed (e.g. 82.3, 9.1). Never pixels.

        CONFIDENCE:
        - 1.0 = certain and visible. 0.5 = partial/estimated. 0.0 = not visible.
        - If confidence < 0.4, set targetPercentX/Y to null.

        NAVIGATION:
        - requiresNavigation: true if target isn't visible yet; nextStep describes what to do first.
        - requiresNavigation: false → nextStep is null.
        - Never guess coordinates for elements not in the screenshot.

        RULES:
        - explanation starts with a verb (Click, Open, Toggle, Select, Hover) and names a nearby landmark.
        - No markdown/code fences in output.

        OCR DATA:
        Each entry: Text (x, y, width, height) — top-left pixel coords.
        - Use the screenshot for layout/icon context; use OCR coordinates for anything with visible text (more accurate than visual estimation).
        - Prefer OCR position over visual estimate when they disagree on text elements.
        - Icons with no text: use screenshot only.
        - Ignore OCR entries unrelated to the request.

        OCR FALLBACK:
        - OCR may miss some visible text or contain recognition errors.
        - If the requested text is not present in the OCR data but is clearly visible in the screenshot, use the screenshot to locate it.
        - Treat OCR as an additional source of evidence, not the only source of truth.
        
        OCR Data format:

        Text="<content>", x=<left>, y=<top>, width=<width>, height=<height>, confidence=<score>

        - x and y are the top-left pixel coordinates.
        - width and height define the OCR bounding box.
        - confidence indicates OCR certainty.

        OCR Data:
    `

    const result = await analyzeScreen(
    capture.image,
    prompt,
    capture.words
);

const data = JSON.parse(result);

const { width, height } =
    screen.getPrimaryDisplay().bounds;

data.x = Math.round(
    width * (data.targetPercentX / 100)
);

data.y = Math.round(
    height * (data.targetPercentY / 100)
);

console.log(data) // testing

return data;

}




