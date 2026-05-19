# HoverAI Development Roadmap

# 🚀 Main Goal

Build an AI-powered on-screen assistant that visually guides users through websites, desktop applications, settings, and software interfaces using animated overlays and intelligent screen understanding.

The assistant should behave like a real-time AI tutor that helps users navigate software visually instead of controlling the computer automatically.

---

# 🧠 Core Philosophy

HoverAI should:

✅ Help users learn software  
✅ Visually guide users step-by-step  
✅ Keep humans in control  
✅ Improve accessibility  
✅ Reduce confusion in complex interfaces

HoverAI should NOT:

- Autonomously control the computer
- Perform dangerous automation
- Replace user interaction
- Become a hidden background automation system

The user always remains in control.

---

# 🛠️ Recommended Learning Approach

The project should be built in small layers.

Do NOT attempt to build the full AI system immediately.

Correct workflow:

Build → Test → Break → Fix → Learn → Improve

Each phase should teach one important concept.

---

# 🔥 Development Philosophy

The goal is not just finishing the project.

The goal is also learning:

- Electron architecture
- JavaScript ES Modules
- IPC systems
- Overlay rendering
- Desktop applications
- OCR
- AI integration
- Real-time UI systems
- Multimodal reasoning

This project should act as a long-term learning system.

---

# 🚀 Recommended Stack

## Core Technologies

- Electron.js
- Node.js
- Modern JavaScript (ES Modules)
- HTML/CSS
- Gemini AI
- OCR Systems
- IPC Architecture

---

# 📦 JavaScript Architecture

The project should use:

```json
{
  "type": "module"
}
```

inside `package.json`.

This enables:

```js
import { app } from "electron";
```

instead of CommonJS:

```js
const { app } = require("electron");
```

---

# 🗂️ Recommended Structure

```plaintext
hoverai/
│
├── node_modules/
│
├── src/
│   ├── main.js
│   ├── preload.js
│   │
│   └── renderer/
│       ├── index.html
│       ├── app.js
│       └── overlay.html
│
├── .env
├── package.json
└── README.md
```

---

# 🚀 PHASE 1 — Transparent Overlay System

## Goal

Create a transparent fullscreen overlay window with a glowing animated pointer.

No AI yet.

No screenshots yet.

Only:
- Overlay window
- Click-through support
- Smooth animations

---

## Learnings

This phase teaches:

- Electron basics
- BrowserWindow
- Transparent windows
- Always-on-top rendering
- Click-through overlays
- CSS animations
- Desktop UI rendering

---

## Success Condition

When the app launches:

✅ Transparent fullscreen overlay appears  
✅ User can still click through applications  
✅ Animated glowing pointer is visible  
✅ Overlay feels smooth and lightweight

---

# 🚀 PHASE 2 — Dynamic Pointer Movement

## Goal

Move the overlay pointer dynamically using coordinates from JavaScript.

---

## Learnings

This phase teaches:

- IPC communication
- Coordinate systems
- Screen dimensions
- Real-time rendering updates
- Multi-monitor awareness
- Animation handling

---

## Success Condition

The pointer can move dynamically to any location on screen.

Example:

```plaintext
Move pointer to X:500 Y:300
```

---

# 🚀 PHASE 3 — Screenshot Capture System

## Goal

Capture the user's screen directly into memory.

No disk storage.

---

## Learnings

This phase teaches:

- Electron desktopCapturer
- NativeImage
- Buffers
- Base64 conversion
- Memory pipelines
- Performance optimization

---

## Success Condition

The application can capture and preview screenshots fully in memory.

---

# 🚀 PHASE 4 — AI Vision Integration

## Goal

Send screenshots + prompts to Gemini AI.

Receive structured guidance responses.

---

## Learnings

This phase teaches:

- Multimodal AI
- Prompt engineering
- API integration
- Structured JSON outputs
- AI reasoning pipelines

---

## Example Flow

User asks:

```plaintext
"Where is the settings button?"
```

AI returns:

```json
{
  "explanation": "Click the settings icon in the top-right corner.",
  "targetPercentX": 82.3,
  "targetPercentY": 9.1
}
```

---

## Success Condition

AI can understand screenshots and return approximate guidance locations.

---

# 🚀 PHASE 5 — OCR Integration

## Goal

Add OCR to improve accuracy of UI detection.

---

## Why OCR Is Important

AI vision alone is not reliable enough for production.

OCR provides:
- Exact text positions
- Better coordinate accuracy
- Faster UI targeting

---

## Learnings

This phase teaches:

- OCR systems
- Text detection
- Coordinate extraction
- UI parsing
- Hybrid AI + OCR pipelines

---

## Success Condition

The system can detect visible text and locate buttons/settings precisely.

---

# 🚀 PHASE 6 — Guidance Loop System

## Goal

Create a continuous AI guidance workflow.

---

## Complete Flow

```plaintext
Capture Screen
→ Analyze UI
→ Find Target
→ Display Overlay Guidance
→ Wait for User Action
→ Capture Updated Screen
→ Continue Guidance
```

---

## Learnings

This phase teaches:

- State management
- Real-time systems
- Interactive AI workflows
- UI progression tracking
- Context awareness

---

## Success Condition

HoverAI can continuously guide users step-by-step through software workflows.

---

# 🚀 PHASE 7 — Voice Assistant Integration

## Goal

Allow users to interact naturally using voice.

---

## Example

User says:

```plaintext
"Show me how to enable dark mode in Discord."
```

HoverAI:
- Understands request
- Analyzes screen
- Visually guides user

---

## Learnings

This phase teaches:

- Web Speech API
- Voice recognition
- Natural language interaction
- Conversational UX

---

# 🚀 PHASE 8 — Smart Context Understanding

## Goal

Improve software-specific understanding.

---

## Example Specialized Modes

### Windows Mode
Understands:
- Windows settings
- Control Panel
- Task Manager

---

### Gaming Mode
Understands:
- NVIDIA Control Panel
- Steam
- OBS
- Game launchers

---

### Browser Mode
Understands:
- Discord
- YouTube
- Chrome settings
- Gmail

---

## Learnings

This phase teaches:

- Context systems
- Specialized prompting
- UI knowledge layers
- Application-aware reasoning

---

# 🚀 PHASE 9 — Advanced Overlay UX

## Goal

Make the assistant feel polished and futuristic.

---

## Features

- Smooth pointer transitions
- Glow animations
- Arrows
- Highlight circles
- Floating explanation boxes
- Step indicators
- UI focus effects

---

## Learnings

This phase teaches:

- Advanced animations
- UX systems
- Visual communication
- Overlay optimization

---

# 🚀 PHASE 10 — Production-Level Improvements

## Goal

Optimize reliability, security, and scalability.

---

## Possible Improvements

- Accessibility API integration
- Better OCR pipelines
- Faster screenshot processing
- Multi-monitor support
- Low-latency AI pipelines
- Smart caching
- Security hardening

---

# 🔐 Electron Security Model

The application should follow modern Electron security practices.

## Required Security Settings

```js
webPreferences: {

    preload: path.join(
        __dirname,
        "preload.js"
    ),

    contextIsolation: true,

    nodeIntegration: false
}
```

---

## Why These Matter

### `contextIsolation: true`

Separates Electron internals from renderer code.

---

### `nodeIntegration: false`

Prevents frontend pages from accessing Node.js directly.

---

### `preload.js`

Acts as a secure bridge between:
- renderer
- Electron backend APIs

---

# 🧠 Most Important Rule

Never try building everything at once.

Correct mindset:

```plaintext
Today:
Only overlays.

Tomorrow:
Only pointer movement.

Next:
Only screenshots.
```

Small wins compound into large systems.

---

# 🔥 Final Vision

HoverAI should eventually feel like:

> A smart AI companion living on the user's screen that visually teaches them how to use software naturally and interactively.

Instead of searching tutorials online, users should simply ask:

```plaintext
"Show me where it is."
```

And HoverAI guides them visually in real time.