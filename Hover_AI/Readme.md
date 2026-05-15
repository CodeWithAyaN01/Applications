# SYSTEM CONTEXT: ELECTRON MULTIMODAL AI VISION ASSISTANT

## 🚀 Tech Stack & Core Architecture
- **Framework & Runtime:** Electron.js + Node.js + TypeScript
- **Compilation Target:** CommonJS (`tsconfig.json` compiles `/src` [.ts] into `/dist` [.js])
- **Pattern:** Layered multi-process backend architecture with isolated execution contexts (`contextIsolation: true`, `nodeIntegration: false`).
- **AI Integration:** `@google/genai` SDK using the `gemini-2.5-flash` model.
- **Data Ingestion Constraints:** High-performance, zero-disk pipeline. Screenshots must be captured natively via `desktopCapturer` straight into memory buffers, converted to Base64 strings, and transported over secure TLS channels to prevent SSD write wear.

## 🗂️ Production Directory Structure
electron-ai-vision/
├── node_modules/         # Third-party npm libraries
├── dist/                 # Compiled JavaScript outputs (.js)
├── src/                  # Source Code TypeScript files (.ts)
│   ├── main.ts           # Backend Controller: App lifecycle, screen capture, Gemini SDK integration
│   ├── preload.ts        # Secure Bridge Router: Exposes safe IPC channels to views
│   └── renderer/         # Frontend UI & Presentation Layer
│       ├── index.html    # Control Panel Layout (Text/Voice inputs, output box)
│       ├── app.ts        # Control Panel Brain (Handles Web Speech API & hits IPC bridge)
│       └── overlay.html  # Transparent Window (Full-screen, borderless click-through canvas)
├── .env                  # Environment Variables (`GEMINI_API_KEY`)
├── package.json          # Node project configurations & scripts
└── tsconfig.json         # TypeScript compiler configuration rules

## 🔄 Inter-Process Communication (IPC) & Coordination Flow
1. User activates text or native Web Speech API input in `renderer/index.html`.
2. `renderer/app.ts` fires an asynchronous event payload over the secure `preload.ts` gatekeeper.
3. `main.ts` intercepts via IPC, takes an internal display snapshot, reads the `.env` key, and sends both data layers to Gemini.
4. Gemini must evaluate the screen layout and respond strictly with a structured JSON string matching this schema:
   {
     "explanation": "Text description of the next physical step or fix",
     "targetPercentX": 45.2,
     "targetPercentY": 12.8
   }
5. `app.ts` parses the JSON, updates the control panel text box, calculates the exact pixel mapping against the user's active monitor resolution, and dispatches the coordinates back across the IPC core.
6. `main.ts` forwards the coordinates to the transparent, click-through overlay window (`overlay.html`), which uses hardware-accelerated CSS animations to glide a pulsing, neon indicator to the exact spot on the user's desktop.