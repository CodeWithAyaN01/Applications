# HoverAI — AI API Key, Dynamic Model Selection & Persistent Configuration

## Purpose

This document defines the next major functionality to be implemented in the HoverAI project.

The goal is to allow every user to configure HoverAI using **their own Gemini API key**, select a Gemini model available to that key, and have those settings **persist across application restarts**.

The user should configure HoverAI once and then continue using it normally every time they open the application.

The API key and selected model must be changeable at any time through Settings.

---

# 1. Current Project Context

HoverAI is an Electron-based AI visual desktop assistant.

Current architecture:

```text
HoverAI
│
├── Electron.js
├── Node.js
├── JavaScript ES Modules
├── HTML/CSS
├── Gemini API
├── OCR
├── Screenshot Capture
├── Guidance Controller
├── Session / History
├── Transparent Overlay
└── Secure IPC
```

The existing Electron architecture uses:

```text
contextIsolation: true
nodeIntegration: false
preload.js
```

The renderer communicates with the main process through the preload/IPC bridge.

The existing HoverAI guidance pipeline is approximately:

```text
User Goal
    ↓
Screen Capture
    ↓
OCR
    ↓
Gemini Vision Analysis
    ↓
Guidance Controller
    ↓
Explanation + Coordinates
    ↓
Overlay Pointer
    ↓
User Action
    ↓
Next Step
```

The goal-editing problem has already been fixed.

The user can now change the goal during an active session without restarting the application.

---

# 2. New Requirement

The next functionality is the **AI Configuration System**.

The system must allow the user to:

1. Enter their own Gemini API key.
2. Connect/test the API key.
3. Determine which Gemini models can be used with that key.
4. Select a model.
5. Test the selected model.
6. Save the API key securely.
7. Save the selected model.
8. Restore the saved configuration when HoverAI starts again.
9. Avoid asking the user to enter the API key every time.
10. Avoid asking the user to select the model every time.
11. Change the API key later.
12. Change the model later.
13. Do all of this without restarting the application unnecessarily.

---

# 3. Most Important Persistence Requirement

The user's API key and selected model are **persistent configuration**.

After the user successfully configures HoverAI for the first time:

```text
API Key
   +
Selected Model
   ↓
Securely Saved
```

When HoverAI is closed and opened again:

```text
Launch HoverAI
      ↓
Load saved configuration
      ↓
Configuration exists and is valid?
      │
      ├── YES
      │     ↓
      │  Skip setup
      │     ↓
      │  Open main HoverAI
      │
      └── NO
            ↓
        Show setup
```

The user should **NOT have to enter the API key every time they open HoverAI**.

The user should also **NOT have to select the model every time they open HoverAI**.

---

# 4. Desired First-Launch Experience

The first time HoverAI runs on a computer:

```text
Launch HoverAI
      ↓
No saved configuration
      ↓
Welcome to Hover AI
      ↓
Enter Gemini API Key
      ↓
Connect
      ↓
Discover available models
      ↓
Select model
      ↓
Test selected model
      ↓
Save configuration securely
      ↓
Open Main HoverAI
```

After that:

```text
Close HoverAI
      ↓
Open HoverAI
      ↓
Load saved API key
      ↓
Load saved model
      ↓
Open Main HoverAI
```

No setup screen should appear unless configuration is missing, invalid, or the user explicitly chooses to change it.

---

# 5. Product Philosophy

HoverAI should NOT be limited to a developer-selected list of Gemini models.

The intended concept is:

> **HoverAI should allow users to use the Gemini models available to their own API key/account.**

For example:

```text
User A
API Key A
    ↓
Available Models
    ├── Flash
    ├── Flash Lite
    └── Pro
```

Another user may have:

```text
User B
API Key B
    ↓
Available Models
    ├── Flash
    └── Flash Lite
```

The application should adapt to the user's available models rather than assuming every user has identical model access.

---

# 6. Model Selection Philosophy

The user should NOT have to manually type a model ID.

The UI should show human-readable model names.

Example:

```text
Gemini 2.5 Flash
Gemini 3.6 Flash
Gemini 3.6 Flash Lite
Gemini Pro
```

Internally, each display name can map to the actual Gemini API model identifier.

Conceptually:

```text
User-facing name
        ↓
Internal model ID
        ↓
Gemini API
```

The exact model IDs should remain inside the application configuration/service layer rather than being exposed to normal users.

---

# 7. First-Launch UI

When HoverAI is launched for the first time and no valid configuration exists, the user should see a dedicated setup screen.

Suggested interface:

```text
                    HOVER AI

              Welcome to Hover AI

       Connect your Gemini API to
             start using HoverAI.

       Gemini API Key

       [ ••••••••••••••••••••••• ]

              [ Connect ]

       Your API key allows HoverAI
       to access Gemini using your
       own account.
```

The model selector should appear after the API key has successfully connected.

---

# 8. First-Launch Flow

Complete first-launch flow:

```text
Launch HoverAI
      ↓
Check for saved configuration
      ↓
Configuration exists?
      │
      ├── YES
      │     ↓
      │  Load saved API key
      │     ↓
      │  Load saved model
      │     ↓
      │  Validate configuration if required
      │     ↓
      │  Open Main HoverAI
      │
      └── NO
            ↓
      Show Welcome Screen
            ↓
      User enters API key
            ↓
      Validate API key
            │
       ┌────┴────┐
       │         │
      FAIL     SUCCESS
       │         │
       ↓         ↓
    Show Error  Discover/Load
       │        Available Models
       │             ↓
       │       Show Model Selector
       │             ↓
       │       User selects model
       │             ↓
       │       Test Selected Model
       │             │
       │        ┌────┴────┐
       │        │         │
       │       FAIL     SUCCESS
       │        │         │
       │        ↓         ↓
       │      Error    Secure Save
       │                  │
       └──────────────────┘
                          ↓
                    Main HoverAI
```

---

# 9. API Key Input

The API key input should be designed for normal users, not developers.

Suggested interface:

```text
Gemini API Key

[ ••••••••••••••••••••••••••••• ]

[ Show / Hide ]

Don't have a Gemini API key?
Get one from Google →
```

Requirements:

* Mask the API key by default.
* Provide a show/hide control.
* Provide a way to obtain a Gemini API key.
* Never display the complete saved key in normal settings.
* Never hardcode the developer's API key into the production application.

---

# 10. API Key Validation

When the user clicks:

```text
[ Connect ]
```

the application should validate the key.

Flow:

```text
User enters API key
        ↓
Send validation request
        ↓
Gemini responds
        ↓
 ┌──────┴──────┐
 │             │
FAIL          SUCCESS
 │             │
 ↓             ↓
Show error   Continue
```

Example failure:

```text
Unable to connect to Gemini.

Please check your API key and try again.
```

The user should remain on the same setup screen.

Do not force the user to restart HoverAI.

---

# 11. Model Discovery

After the API key is successfully validated, HoverAI should determine the models available/usable for the user.

Conceptual flow:

```text
Valid API Key
      ↓
Gemini Model Availability
      ↓
Models accessible to this key
      ↓
Models usable by HoverAI
      ↓
Model Selector
```

The implementation should avoid blindly assuming that every model is available to every API key.

---

# 12. Model Selector

After successful API connection:

```text
Gemini API Connected ✓

Choose your AI model

┌────────────────────────────────┐
│ Gemini 2.5 Flash            ▼  │
└────────────────────────────────┘

           [ Continue ]
```

When opened:

```text
┌────────────────────────────────┐
│ Gemini 2.5 Flash               │
│ Gemini 3.6 Flash               │
│ Gemini 3.6 Flash Lite          │
│ Gemini Pro                     │
│ ...                            │
└────────────────────────────────┘
```

The actual list should be based on the models available to the current API key where practical.

---

# 13. Selected Model Validation

A valid API key does not automatically mean that every model can be used.

Therefore:

```text
API key validation
        ↓
Model selection
        ↓
Test selected model
        ↓
Success?
   ┌────┴────┐
  NO        YES
   │          │
   ↓          ↓
 Error      Save
```

If the selected model fails:

```text
This model could not be used with
your current API configuration.

Please choose another model.
```

The user should remain on the configuration screen.

---

# 14. Persistent Configuration

The saved configuration should contain at minimum:

```text
HoverAI Configuration
│
├── API Key
│
├── Selected Model
│
└── Configuration Status
```

The API key and selected model must persist between application launches.

Example:

```text
First launch
    ↓
User enters API key
    ↓
User selects model
    ↓
Validation succeeds
    ↓
Save configuration
    ↓
User closes HoverAI
    ↓
User opens HoverAI again
    ↓
Configuration is loaded
    ↓
Main HoverAI opens
```

The setup screen should only appear again if:

* No configuration exists.
* Saved credentials are invalid/unavailable.
* The user explicitly chooses to change the API key.
* The user explicitly chooses to reconfigure HoverAI.

---

# 15. Secure API Key Storage

The API key must NOT be stored casually in:

```javascript
localStorage.setItem("apiKey", key);
```

or hardcoded into:

```text
.env
```

for the production application.

Development may use `.env` temporarily, but the production application must use the user's own key.

The API key should be stored using an appropriate OS-level secure credential mechanism.

Preferred conceptual architecture:

```text
User API Key
      ↓
Secure OS-level credential storage
      ↓
HoverAI Main Process
      ↓
Gemini Service
```

The renderer should not have unrestricted access to the raw API key.

---

# 16. Persistence of the Model

The selected model should also be saved.

Example:

```text
Saved Configuration

API Key:
Secure credential

Selected Model:
Gemini 3.6 Flash
```

When HoverAI starts:

```text
Load API Key
      ↓
Load Selected Model
      ↓
Initialize Gemini
      ↓
Use saved model
```

The user should not be asked to select the model again after every restart.

---

# 17. API Key and Model Must Stay Synchronized

The selected model belongs to the current API-key configuration.

If the user changes the API key:

```text
Old API Key
      ↓
New API Key
      ↓
Discover models available to new key
      ↓
User selects a valid model
      ↓
Save:
    New API Key
    New Selected Model
```

Do not blindly keep the old model if the new API key cannot use it.

---

# 18. Changing the API Key

When the user selects:

```text
[ Change API Key ]
```

do not immediately delete the existing working key.

Instead:

```text
Current Configuration
        ↓
User enters New API Key
        ↓
Validate New API Key
        ↓
Discover Available Models
        ↓
User selects Model
        ↓
Test Model
        ↓
Success
        ↓
Replace old configuration
```

If the new key fails:

```text
New API Key
    ↓
Validation fails
    ↓
Keep existing configuration
```

This prevents a failed key change from breaking HoverAI.

---

# 19. Changing the Model

Changing only the model should be simpler:

```text
Settings
    ↓
Change Model
    ↓
Show models available to current API key
    ↓
User selects model
    ↓
Test selected model
    ↓
Success
    ↓
Save new model
```

The API key remains unchanged.

The newly selected model becomes the persistent model.

---

# 20. No Restart Requirement

The user should not need to restart HoverAI when changing:

* API key
* Model

After successful configuration changes:

```text
New configuration
       ↓
Configuration Manager updated
       ↓
Future Gemini requests
       ↓
Use new API key/model
```

If an active guidance session needs to be restarted because its AI configuration changed, handle that explicitly in the UI rather than silently using mixed configuration.

---

# 21. Electron Security

Maintain the existing security architecture:

```text
Renderer
    ↓
Preload
    ↓
Secure IPC
    ↓
Main Process
    ↓
Credential Storage / Gemini
```

Required principles:

```javascript
contextIsolation: true
nodeIntegration: false
```

The API key should not be directly exposed to the renderer.

---

# 22. Centralized Configuration Architecture

Do NOT scatter the API key and selected model across different files.

Create one logical configuration layer.

Conceptually:

```text
Configuration Manager
│
├── getApiKey()
├── saveApiKey()
├── getSelectedModel()
├── saveSelectedModel()
├── getConfiguration()
├── validateConfiguration()
└── clear/replace configuration
```

The exact function names are implementation decisions.

The important requirement is centralization.

---

# 23. Gemini Service Architecture

The existing Gemini service should not contain a permanently hardcoded API key or model.

Instead:

```text
Guidance Controller
        ↓
Gemini Service
        ↓
Configuration Manager
        ├── API Key
        └── Selected Model
        ↓
Gemini Client
        ↓
Gemini API
```

Normal HoverAI requests become:

```text
User Goal
    ↓
Guidance Controller
    ↓
Gemini Service
    ↓
Read Current Configuration
    ├── API Key
    └── Selected Model
    ↓
Gemini Request
    ↓
AI Response
```

---

# 24. Startup Configuration Flow

Every time HoverAI launches:

```text
Application starts
        ↓
Configuration Manager initializes
        ↓
Load saved API key
        ↓
Load saved selected model
        ↓
Is configuration available?
        │
        ├── NO
        │    ↓
        │  Show Welcome Setup
        │
        └── YES
             ↓
        Initialize Gemini
             ↓
        Use saved model
             ↓
        Open Main HoverAI
```

The user should normally see the main HoverAI interface immediately after the first successful setup.

---

# 25. Existing Main HoverAI Flow

Once configuration is complete, the user should not care about the underlying configuration system.

Normal usage:

```text
Main HoverAI
     ↓
User enters goal
     ↓
Start
     ↓
Capture Screen
     ↓
OCR
     ↓
Gemini
     ↓
Selected Model
     ↓
Guidance Result
     ↓
Overlay
     ↓
User Action
     ↓
Next Step
```

The only change from the current system is that Gemini now obtains:

```text
API Key = user's saved key
Model   = user's saved model
```

---

# 26. Settings Interface

The user must be able to change configuration later.

Settings should contain an AI Configuration section.

Example:

```text
AI CONFIGURATION

Gemini API Key

AIza••••••••••••••••••

[ Change API Key ]


AI Model

Gemini 3.6 Flash

[ Change Model ]


Connection

✓ Connected

[ Test Connection ]
```

The full API key should never be displayed after saving.

---

# 27. Settings Persistence

The Settings screen should display the current saved configuration.

For example:

```text
AI Configuration

API Key
AIza••••••••••••

Model
Gemini 3.6 Flash

Status
✓ Connected
```

After the user closes Settings:

```text
Settings
   ↓
Saved Configuration remains
   ↓
Close HoverAI
   ↓
Open HoverAI
   ↓
Same API key
Same model
```

The user should not have to configure HoverAI again.

---

# 28. Change API Key Flow

When the user chooses to replace the key:

```text
Current Saved Configuration
        ↓
Change API Key
        ↓
Enter New API Key
        ↓
Validate New API Key
        ↓
Discover New Available Models
        ↓
Select Model
        ↓
Validate Model
        ↓
Save New Configuration
        ↓
Replace Old Configuration
```

If anything fails:

```text
New configuration fails
        ↓
Discard temporary changes
        ↓
Keep existing saved configuration
```

---

# 29. Change Model Flow

```text
Current Saved Configuration
        ↓
Change Model
        ↓
Show models available to current key
        ↓
User selects model
        ↓
Test model
        ↓
Save selected model
        ↓
Future Gemini requests use new model
```

The API key does not need to be re-entered.

---

# 30. Relationship With Change Goal

The Change Goal functionality has already been implemented.

Do not break it.

Current functionality:

```text
Active Guidance Session
        ↓
Change Goal
        ↓
Reset relevant session state
        ↓
Fresh goal
        ↓
Fresh guidance
```

The new AI Configuration system is separate:

```text
AI Configuration
        ↓
API Key
        +
Selected Model
```

Both systems should coexist.

---

# 31. Complete Application Architecture

```text
                         HOVER AI
                            │
             ┌──────────────┴──────────────┐
             │                             │
       AI Configuration              Guidance System
             │                             │
       ┌─────┴─────┐                  User Goal
       │           │                      │
    API Key      Model                    ↓
       │           │                Guidance Session
       │           │                      │
       └─────┬─────┘                      ↓
             │                       Screenshot
             ↓                            │
      Persistent Storage                  ↓
             │                           OCR
             ↓                            │
      Gemini Service                      │
             │                            │
             └────────────┬───────────────┘
                          ↓
                       Gemini
                          ↓
                 Guidance Response
                          ↓
                       Overlay
                          ↓
                     User Action
                          ↓
                      Next Step
```

---

# 32. First-Launch UI Flow

Recommended final flow:

```text
                    HOVER AI

              Welcome to Hover AI

      Connect your Gemini API to begin.

      Gemini API Key

      [ ••••••••••••••••••••••• ]

              [ Connect ]

                   ↓

             API Connected ✓

             Choose your model

      [ Gemini 2.5 Flash          ▼ ]

             [ Test & Continue ]

                   ↓

              Configuration
                Successful

                   ↓

               Main HoverAI
```

---

# 33. Returning User Flow

This is equally important.

When a configured user launches HoverAI again:

```text
                    HOVER AI
                       ↓
                Application Start
                       ↓
              Load Saved Configuration
                       ↓
                API Key Available?
                    /       \
                  NO         YES
                  │           │
                  ↓           ↓
             Setup Screen   Load Model
                              │
                              ↓
                       Initialize Gemini
                              │
                              ↓
                         Main HoverAI
```

Expected result:

```text
FIRST TIME:

Launch
 ↓
API Key
 ↓
Model
 ↓
Save
 ↓
Main UI


EVERY LATER TIME:

Launch
 ↓
Load saved configuration
 ↓
Main UI
```

---

# 34. Persistence Requirements

The implementation must satisfy all of these:

* [ ] API key persists across application restarts.
* [ ] Selected model persists across application restarts.
* [ ] User is not asked for the API key every time.
* [ ] User is not asked to select a model every time.
* [ ] Saved API key is securely stored.
* [ ] Saved model is stored as application configuration.
* [ ] Configuration is loaded during application startup.
* [ ] Existing configuration is used automatically.
* [ ] Setup screen appears only when configuration is missing or unusable.
* [ ] User can manually change the API key.
* [ ] User can manually change the model.
* [ ] Failed changes do not destroy the existing working configuration.

---

# 35. Temporary vs Saved Configuration

When the user is changing configuration:

```text
Current Saved Configuration
        │
        │
        ▼
Temporary New Configuration
        │
        ▼
Validation
        │
   ┌────┴────┐
 FAIL       SUCCESS
   │           │
   ↓           ↓
Discard      Save
   │           │
   ↓           ↓
Keep old     Replace old
```

Never overwrite a known-good configuration before the replacement has been validated.

---

# 36. Error Handling

## Invalid API Key

```text
Unable to connect to Gemini.

Please check your API key and try again.
```

## Model Unavailable

```text
This model is not available with
your current API configuration.

Please choose another model.
```

## Internet Failure

```text
Unable to connect to Gemini.

Please check your internet connection.
```

## Gemini Service Failure

```text
Gemini is temporarily unavailable.

Please try again.
```

## No Compatible Models

```text
No compatible Gemini models were found
for this API configuration.
```

The application should not crash.

---

# 37. Important Implementation Rule

Do NOT start by rewriting the entire Gemini integration.

The existing Gemini functionality is already working.

The goal is to introduce configuration around it.

Current conceptual system:

```text
Gemini
  ↑
Hardcoded/Development configuration
```

Target system:

```text
Gemini
  ↑
Gemini Service
  ↑
Configuration Manager
  ↑
Persistent User Configuration
  ↑
Welcome / Settings UI
```

The existing screenshot/OCR/guidance logic should remain intact unless changes are required to connect it to the new configuration system.

---

# 38. Implementation Order

Implement this functionality in the following order:

```text
STEP 1
Inspect existing Gemini initialization
        ↓
STEP 2
Identify current API key/model usage
        ↓
STEP 3
Create centralized configuration layer
        ↓
STEP 4
Create secure persistent API-key storage
        ↓
STEP 5
Create persistent selected-model storage
        ↓
STEP 6
Connect Gemini service to configuration
        ↓
STEP 7
Implement API-key validation
        ↓
STEP 8
Implement model availability/discovery
        ↓
STEP 9
Implement selected-model validation
        ↓
STEP 10
Implement startup configuration loading
        ↓
STEP 11
Build first-launch Welcome UI
        ↓
STEP 12
Build Model Selector UI
        ↓
STEP 13
Build Settings UI
        ↓
STEP 14
Implement Change API Key
        ↓
STEP 15
Implement Change Model
        ↓
STEP 16
Test application restart persistence
        ↓
STEP 17
Test existing HoverAI guidance
        ↓
STEP 18
Only after stabilization:
Production packaging / .exe
```

---

# 39. Persistence Test

A specific test must be performed before this feature is considered complete.

### Test

```text
1. Start HoverAI for the first time.
2. Enter API key.
3. Select a model.
4. Successfully validate configuration.
5. Enter the main HoverAI interface.
6. Close HoverAI completely.
7. Open HoverAI again.
```

### Expected result

```text
HoverAI opens
      ↓
Saved API key is loaded securely
      ↓
Saved model is loaded
      ↓
Gemini initializes
      ↓
Main HoverAI opens
```

The user should NOT see:

```text
Enter API key
```

again.

The user should NOT have to:

```text
Select model
```

again.

---

# 40. API Key Change Persistence Test

Test:

```text
1. Existing API key is configured.
2. Open Settings.
3. Change API key.
4. Validate new key.
5. Save.
6. Close HoverAI.
7. Reopen HoverAI.
```

Expected:

```text
New API key is active.
Old API key is no longer used.
New selected model is loaded.
```

If validation fails:

```text
Old API key remains active.
```

---

# 41. Model Change Persistence Test

Test:

```text
1. Existing API key and model are configured.
2. Open Settings.
3. Change model.
4. Validate the new model.
5. Save.
6. Close HoverAI.
7. Reopen HoverAI.
```

Expected:

```text
New model is loaded automatically.
```

The API key should remain unchanged.

---

# 42. Do Not Build the Runtime Yet

The production `.exe` runtime should be implemented after the functionality is stable.

Current priority:

```text
CHANGE GOAL
     ↓
DONE
     ↓
AI CONFIGURATION
     ↓
API KEY
     ↓
MODEL
     ↓
PERSISTENCE
     ↓
SETTINGS
     ↓
TEST
     ↓
PRODUCTION PACKAGING
```

The runtime should package the finished application.

It should not be built first and then repeatedly rebuilt while core functionality is changing.

---

# 43. Final Production Architecture

Eventually:

```text
                    HOVER AI WEBSITE
                          │
                       Download
                          │
                          ▼
                HoverAI-Setup.exe
                          │
                          ▼
                Windows Installation
                          │
                          ▼
                     HoverAI.exe
                          │
                          ▼
                  First Launch Setup
                          │
                    User API Key
                          │
                          ▼
                  Model Selection
                          │
                          ▼
             Secure Persistent Storage
                          │
                          ▼
                   Main HoverAI
                          │
                          ▼
                   Guidance System
                          │
                          ▼
                       Gemini
```

The user should not need:

```text
Node.js
npm
Git
VS Code
Electron
Manual dependencies
Developer API key
Developer .env
```

---

# 44. Definition of Done

The AI Configuration functionality is complete when:

* [ ] First launch detects missing configuration.
* [ ] Welcome screen appears.
* [ ] User can enter a Gemini API key.
* [ ] API key can be validated.
* [ ] Invalid keys produce a clear error.
* [ ] Valid keys allow the user to continue.
* [ ] Available/usable models can be determined.
* [ ] User can select a model.
* [ ] Selected model can be tested.
* [ ] Invalid model selections produce a clear error.
* [ ] API key is securely stored.
* [ ] Selected model is persistently stored.
* [ ] API key survives application restart.
* [ ] Selected model survives application restart.
* [ ] User does not have to enter the API key every time HoverAI starts.
* [ ] User does not have to select the model every time HoverAI starts.
* [ ] Configuration is automatically loaded during startup.
* [ ] Gemini service uses the saved API key.
* [ ] Gemini service uses the saved selected model.
* [ ] User can change the API key later.
* [ ] User can change the model later.
* [ ] Failed API-key changes do not destroy the old configuration.
* [ ] Failed model changes do not destroy the old configuration.
* [ ] Configuration changes do not require application restart.
* [ ] Existing Change Goal functionality remains intact.
* [ ] Existing OCR functionality remains intact.
* [ ] Existing guidance functionality remains intact.
* [ ] Existing overlay functionality remains intact.
* [ ] No developer API key is included in production.
* [ ] The system is ready to be packaged after stabilization.

---

# 45. Core Requirement

The fundamental requirement is:

> **HoverAI must allow every user to connect their own Gemini API key and use the Gemini models available to that key. The user's API key and selected model must be securely saved and automatically restored whenever HoverAI is opened again. The user must be able to change both the API key and selected model at any time without needing to reconfigure HoverAI on every launch.**

The application should behave as a flexible Gemini client rather than being permanently tied to one developer API key or one fixed Gemini model.

---

# 46. What To Do Next

Do NOT immediately start writing the Welcome UI.

First inspect the existing project and identify:

```text
1. Where the Gemini API key is currently initialized.
2. Where the Gemini model is currently defined.
3. Where Gemini requests are created.
4. Which main-process file owns Gemini.
5. Which IPC methods communicate with Gemini.
6. Where the current .env/API-key logic is used.
7. Where the current model name is used.
8. How the current guidance controller calls Gemini.
9. Where persistent application configuration can be integrated.
10. Whether the current application already has any configuration/session storage.
```

Then modify the architecture gradually.

The first coding task should be:

> **Create the centralized configuration layer and secure persistent storage, then connect the existing Gemini service to it without breaking the current guidance system.**

Only after that should the Welcome screen and Settings UI be connected to the configuration system.
