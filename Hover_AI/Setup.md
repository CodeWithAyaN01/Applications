# HoverAI - Project Setup Guide

This guide explains how to set up and run the HoverAI project on a new Windows machine.

---

# 1. Install Prerequisites

## Node.js

Download and install the latest **LTS** version:

https://nodejs.org/

Verify the installation:

```bash
node -v
npm -v
```

---

## Git

Download and install Git:

https://git-scm.com/downloads

Verify:

```bash
git --version
```

---

## Visual Studio Code

Download:

https://code.visualstudio.com/

Recommended Extensions:

- ESLint
- Prettier
- Error Lens
- JavaScript (ES6)

---

# 2. Clone the Repository

Clone the project:

```bash
git clone <repository-url>
```

or copy the project folder manually.

Open the project in VS Code.

---

# 3. Install Project Dependencies

Open the terminal in the project directory and run:

```bash
npm install
```

This installs all dependencies listed in `package.json`.

---

# 4. Create Environment File

Create a file named:

```text
.env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=YOUR_API_KEY
```

---

# 5. Required NPM Packages

If they are not already listed in `package.json`, install them.

## Electron

```bash
npm install electron
```

---

## Google Gemini SDK

```bash
npm install @google/genai
```

---

## Tesseract OCR

```bash
npm install tesseract.js
```

---

## Dotenv

```bash
npm install dotenv
```

---

## Edge TTS (Optional)

```bash
npm install msedge-tts
```

> **Note:** The current stable implementation uses the browser's SpeechSynthesis API. `msedge-tts` is optional and intended for future backend integration.

---

# 6. Verify package.json

Ensure the project is configured to use ES Modules.

```json
{
    "type": "module"
}
```

---

# 7. Start the Project

Run:

```bash
npm start
```

or

```bash
npm run start
```

depending on your `package.json`.

---

# 8. Common Issues

## Dependencies Missing

Run:

```bash
npm install
```

---

## Invalid Gemini API Key

Verify your `.env` file contains:

```env
GEMINI_API_KEY=YOUR_API_KEY
```

---

## OCR Not Working

Reinstall dependencies:

```bash
rm -rf node_modules
```

Windows:

```cmd
rmdir /s /q node_modules
```

Then:

```bash
npm install
```

---

## Electron Fails to Launch

Ensure Electron is installed:

```bash
npm install electron
```

Then run:

```bash
npm start
```

---

## Speech Not Working

Check:

- Browser audio is not muted.
- Windows volume is enabled.
- Mute button inside HoverAI is not enabled.

---

# 9. Useful Commands

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

Reinstall all dependencies:

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
```

Update dependencies:

```bash
npm update
```

---

# 10. Minimum Requirements

- Windows 10 or Windows 11
- Node.js (Latest LTS)
- npm
- Git
- Visual Studio Code
- Internet connection (for Gemini API)