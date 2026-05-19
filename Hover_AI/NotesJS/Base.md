# SYSTEM CONTEXT: ELECTRON MULTIMODAL AI VISION ASSISTANT

# 🚀 Tech Stack & Core Architecture

- **Framework & Runtime:** Electron.js + Node.js (ES Modules)
- **JavaScript Mode:** Modern JavaScript using `"type": "module"` in `package.json`
- **Pattern:** Layered multi-process backend architecture with isolated execution contexts
- **Security Model:** `contextIsolation: true` + `nodeIntegration: false`
- **AI Integration:** `@google/genai` SDK using the `gemini-2.5-flash` model
- **Data Pipeline Goal:** High-performance, zero-disk screenshot pipeline

Screenshots should:

- Be captured directly from memory
- Never touch the filesystem
- Convert directly into Base64
- Be securely transmitted over TLS
- Avoid SSD wear and temporary file storage

---

# 🗂️ Production Directory Structure

```plaintext
electron-ai-vision/
├── node_modules/         # Third-party npm libraries
├── src/                  # Main source code
│   ├── main.js           # Main backend controller
│   ├── preload.js        # Secure IPC bridge
│   └── renderer/         # Frontend layer
│       ├── index.html    # Main control panel UI
│       ├── app.js        # Frontend controller logic
│       └── overlay.html  # Transparent fullscreen overlay
├── .env                  # Environment variables
└── package.json          # Project configuration
```

---

# 🧠 Project Vision

The goal is to build an AI-powered on-screen assistant that visually guides users through:

- Websites
- Desktop applications
- System settings
- Menus
- Complex software interfaces

The assistant should behave like an intelligent visual tutor that helps users interact with software naturally.

Instead of controlling the computer automatically, the assistant visually guides the user step-by-step using animated overlays and contextual explanations.

---

# 🎯 Main Purpose

Modern software interfaces are complicated.

Many users struggle with:

- Hidden settings
- Complex menus
- Unfamiliar interfaces
- Gaming optimizations
- Productivity tools
- Advanced software configuration

This assistant solves the problem by helping users visually locate and understand UI elements directly on their own screen.

---

# 💡 Example Use Cases

## 🎮 Gaming

User asks:

```plaintext
"Enable NVIDIA Reflex"
```

Assistant:
- Detects NVIDIA Control Panel
- Locates the setting
- Highlights the exact option visually
- Explains what to click

---

## 🌐 Websites

User asks:

```plaintext
"Where is Discord two-factor authentication?"
```

Assistant:
- Understands Discord settings UI
- Guides user visually through the correct menus
- Displays animated pointers

---

## 🖥️ Windows

User asks:

```plaintext
"How do I disable startup apps?"
```

Assistant:
- Opens guidance flow
- Highlights Task Manager sections
- Shows visual instructions

---

# 🧠 Core Philosophy

The assistant should:

✅ Guide users visually  
✅ Improve software accessibility  
✅ Help users learn interfaces  
✅ Keep humans in control  
✅ Reduce confusion

The assistant should NOT:

❌ Secretly control the computer  
❌ Perform dangerous automation  
❌ Replace the user completely

The user always remains in control.

---

# 🔄 Inter-Process Communication (IPC) Flow

## Step 1 — User Interaction

User interacts through:

- Text input
- Voice input
- Control panel UI

inside:

```plaintext
renderer/index.html
```

---

## Step 2 — Frontend Request

```plaintext
renderer/app.js
```

sends secure IPC requests through:

```plaintext
preload.js
```

---

## Step 3 — Backend Processing

```plaintext
main.js
```

receives the request and:

- Captures screen
- Reads environment variables
- Sends screenshot + prompt to Gemini

---

## Step 4 — AI Reasoning

Gemini analyzes the screen and MUST return:

```json
{
  "explanation": "Text description of next action",
  "targetPercentX": 45.2,
  "targetPercentY": 12.8
}
```

---

## Step 5 — Coordinate Conversion

```plaintext
app.js
```

converts percentage coordinates into real monitor pixels.

Example:

```plaintext
pixelX = screenWidth * (targetPercentX / 100)
pixelY = screenHeight * (targetPercentY / 100)
```

---

## Step 6 — Overlay Guidance

```plaintext
main.js
```

forwards the coordinates to:

```plaintext
overlay.html
```

The overlay then:

- Displays glowing pointers
- Animates neon indicators
- Guides the user visually

---

# 🪟 Overlay System

The overlay window is one of the most important parts of the project.

It should be:

- Transparent
- Fullscreen
- Borderless
- Click-through
- Always-on-top
- Lightweight

The overlay behaves like a visual navigation layer above the desktop.

---

# 🔐 Security Architecture

The project follows modern Electron security practices.

## Enabled Security Features

### `contextIsolation: true`

Separates Electron internals from frontend renderer code.

---

### `nodeIntegration: false`

Prevents frontend pages from accessing Node.js directly.

---

### `preload.js`

Acts as a secure bridge between:
- renderer
- Electron backend APIs

---

## Why This Matters

Without proper Electron security:

- malicious scripts can execute system commands
- renderer code can access files
- APIs become exposed

The architecture intentionally avoids these risks.

---

# 📸 Screenshot Pipeline

The screenshot system should avoid disk storage entirely.

Correct pipeline:

```plaintext
desktopCapturer
→ NativeImage
→ Buffer
→ Base64
→ Gemini API
```

This improves:

- Performance
- Privacy
- SSD lifespan
- Security

---

# 🚀 Long-Term Vision

Future versions may support:

- Voice conversations
- Advanced OCR
- Accessibility APIs
- Multi-monitor support
- Game assistance
- AI onboarding systems
- Interactive tutorials
- Real-time workflow guidance

---

# 🏆 Final Goal

The final experience should feel like:

> A smart AI companion living on the user's screen that visually teaches users how to use software naturally and interactively.

Users should simply be able to ask:

```plaintext
"Show me where it is."
```

And the assistant visually guides them in real time.