const captureButton = document.getElementById("captureBtn");

const preview = document.getElementById("preview");


captureButton.addEventListener("click",async () => {

        const image = await window.electronAPI.captureScreen(); // this function goes to the preload.js -> the main window
        preview.src = `data:image/jpeg;base64,${image}`;
        
        // Prompt for the image render
        const question = "How to open help section in VS code ?"
        const result = await window.electronAPI.analyzeImage(
            image,
            `
            You are HoverAI, a precise on-screen guidance assistant.
            
            You will receive a screenshot of the user's current screen and a request.
            Your job is to locate the exact UI element the user needs and return its position.

            RESPONSE FORMAT:
            Return ONLY a valid JSON object. No markdown. No code fences. No explanation outside the JSON.

            {
                "explanation": "Single clear action sentence starting with a verb. Example: Click the gear icon at the bottom-left of the Activity Bar.",
                "targetPercentX": 0.0,
                "targetPercentY": 0.0,
                "confidence": 0.0,
                "requiresNavigation": false,
                "nextStep": null
            }

            TASK:
            Locate the UI element that satisfies this request:

            "${question}"

            COORDINATE SYSTEM:
            - Use percentage coordinates.
            - Origin (0, 0) is the TOP-LEFT corner of the screenshot.
            - (100, 100) is the BOTTOM-RIGHT corner of the screenshot.
            - targetPercentX is the horizontal position from left to right.
            - targetPercentY is the vertical position from top to bottom.
            - Point to the CENTER of the target element.
            - Return decimal values when needed (for example: 82.3, 9.1).
            - Never return pixel coordinates.

            PRECISION REQUIREMENT:
            - Point to the EXACT CENTER of the target element's bounding box
            - For icons: point to the center of the icon graphic, not its label
            - For buttons: point to the center of the clickable area
            - Double-check your coordinates mentally: does X=4.6 mean the element 
            is 4.6% from the left edge of the screen? Verify this is correct.

            CONFIDENCE:
            - confidence 1.0 = element is clearly visible and you are certain of its position
            - confidence 0.5 = element is partially visible or you are estimating
            - confidence 0.0 = element is not visible on screen at all

            NAVIGATION:
            - If the target element is not yet visible, set requiresNavigation to true
            - In nextStep, describe exactly what the user must do FIRST to reveal the target
            - Only set requiresNavigation to false if the element is directly clickable right now

            

            RULES:
            - explanation must start with an action verb (Click, Open, Toggle, Select, Hover)
            - explanation must reference a visible landmark near the target (Activity Bar, top menu, sidebar)
            - If confidence is below 0.4, set targetPercentX and targetPercentY to null
            - nextStep is null when requiresNavigation is false
            - Never guess coordinates for elements not visible in the screenshot
            - Never return markdown or code fences
            `
        )

        console.log(result) // result printing
        const data = JSON.parse(result)
        console.log(data)

        const {width, height} = await window.electronAPI.getScreenSize();

        // TAKING OUT COORDINATES 
        const x = width * data.targetPercentX / 100
        const y = height * data.targetPercentY / 100

        // MOVE POINTERS
        await window.electronAPI.movePointer(x,y)
        await window.electronAPI.showExplanation(x,y,data.explanation);

        console.log(x,y)
    }

);