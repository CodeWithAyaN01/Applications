# HoverAI - Phase 6 Architecture Design

## Objective

Phase 6 transforms HoverAI from a **single-screen AI analyzer** into a **continuous AI guidance assistant**.

Unlike the previous phases, Phase 6 is focused on designing the architecture before implementation.

The primary goals are:

- Introduce a continuous guidance loop
- Maintain context across multiple steps
- Reduce unnecessary OCR processing
- Reduce unnecessary Gemini API calls
- Improve the overall user experience
- Keep the user completely in control

---

# Core Philosophy

HoverAI should behave like a **software tutor**, not an automation tool.

Instead of automatically controlling the user's computer or continuously monitoring the screen, HoverAI should:

- Understand the user's goal
- Guide one step at a time
- Wait for the user
- Continue only when requested

The user always remains in control.

---

# The Problem With Phase 5

Current workflow:

```text
Capture Screen
        ↓
OCR
        ↓
Gemini
        ↓
Move Pointer
        ↓
STOP
```

Every request is independent.

Gemini forgets everything after responding.

If the user needs additional guidance, HoverAI starts from scratch.

This creates problems such as:

- Repeated reasoning
- No memory of previous steps
- Unnecessary API calls
- No continuity
- Poor guidance for multi-step tasks

---

# Phase 6 Solution

Phase 6 introduces two major architectural changes.

## 1. Guidance Loop

HoverAI continuously guides the user until the requested task is completed.

## 2. Floating Overlay Control Bar

The overlay itself becomes the primary interface for interacting with HoverAI.

---

# Guidance Loop System

The Guidance Loop is the heart of Phase 6.

Instead of analyzing only one screenshot, HoverAI continuously helps the user complete a workflow.

The assistant understands that every step belongs to the same task.

---

# Guidance Loop Workflow

```text
User enters Goal
        ↓
Capture Current Screen
        ↓
OCR
        ↓
Build Session Context
        ↓
Gemini Analysis
        ↓
Display Pointer + Explanation
        ↓
WAIT FOR USER
        ↓
User performs action
        ↓
User presses "Next Step"
        ↓
Capture Updated Screen
        ↓
OCR
        ↓
Update Session Context
        ↓
Gemini Analysis
        ↓
Display Next Guidance
        ↓
Repeat
        ↓
Goal Completed
```

---

# Why Manual Progression?

HoverAI intentionally avoids automatically capturing the screen.

Instead, the user explicitly controls when HoverAI proceeds.

Benefits:

- Prevent unnecessary OCR execution
- Prevent unnecessary API calls
- Lower CPU usage
- Lower API cost
- Better user control
- Better debugging
- Simpler architecture
- Better reliability

If the user makes a mistake, HoverAI waits until the user presses **Next Step** instead of immediately consuming another API call.

---

# Guidance Philosophy

HoverAI behaves like an instructor.

Workflow:

```text
Guide
    ↓
Wait
    ↓
User Performs Action
    ↓
User Requests Next Step
    ↓
Continue Guiding
```

HoverAI never assumes the user has completed the step.

---

# Guidance Session

Every guidance request belongs to a **Guidance Session**.

The session begins when the user enters a goal.

The session ends when:

- Goal completed
- User ends the session

The Guidance Session provides continuity between every AI request.

---

# AI Context Persistence

This is the biggest architectural improvement in Phase 6.

Before Phase 6:

Every Gemini request receives:

- Screenshot
- OCR
- Prompt

After responding, all context is lost.

---

After Phase 6:

Every Gemini request receives:

- User Goal
- Current Screenshot
- OCR Data
- Previous Instruction
- Current Step
- Session State

Gemini now understands that it is continuing an existing workflow instead of starting over.

---

# Example

Goal:

```text
Change Display Resolution
```

Step 1

Gemini:

```text
Open Settings.
```

↓

User clicks Settings.

↓

Next Step

↓

Gemini receives:

```text
Goal:
Change Display Resolution

Current Step:
2

Previous Instruction:
Open Settings.

Screenshot:
(Settings Window)

OCR:
(...)
```

Gemini naturally continues:

```text
Click Display.
```

instead of repeating

```text
Open Settings.
```

---

# Session Context

Each active session stores information similar to:

```text
Goal

Current Step

Previous Instruction

Current Explanation

Current Status

Completed
```

This information is updated after every successful step.

---

# Session Lifecycle

```text
Idle

↓

Goal Entered

↓

Session Started

↓

Capture

↓

OCR

↓

Gemini

↓

Display Guidance

↓

Waiting For User

↓

Next Step

↓

Capture

↓

...

↓

Goal Completed

↓

Session Ended

↓

Idle
```

---

# Floating Overlay Control Bar

The overlay is no longer only responsible for rendering pointers.

It now becomes the primary user interface.

Instead of interacting with the main application window, the user interacts directly with the overlay.

---

# Design Goals

The Floating Control Bar should be:

- Minimal
- Rounded
- Semi-transparent
- Lightweight
- Modern
- Non-intrusive

The design should resemble a desktop HUD instead of a traditional application window.

---

# Control Bar Components

## Goal Input

A text input where the user types the task they want HoverAI to perform.

Example:

```text
Change Display Resolution
```

The goal starts a new Guidance Session.

---

## Next Step Button

The **Next Step** button advances the Guidance Loop.

When pressed, HoverAI performs:

1. Capture desktop
2. OCR
3. Build session context
4. Gemini reasoning
5. Update pointer
6. Update explanation

No automatic capture occurs.

---

# Overlay Architecture

The overlay contains two independent layers.

---

## Static Layer

Contains:

- Floating Control Bar
- Goal Input
- Next Step Button

This layer remains fixed during the session.

---

## Dynamic Layer

Contains:

- Pointer
- Tooltip
- Highlight Ring
- Future Animations

This layer updates every guidance step.

---

# Draggable Control Bar

The entire control bar should be draggable.

Benefits:

- Avoid covering important UI
- User decides placement
- Better experience across different software

Future Enhancement:

Remember the last position between sessions.

---

# Transparency

The Floating Control Bar should:

- Be semi-transparent
- Stay readable
- Feel lightweight
- Minimize screen obstruction

The control bar should never distract the user from the software being guided.

---

# Screenshot Pipeline

The Floating Control Bar must never appear inside screenshots processed by OCR or Gemini.

Desired pipeline:

```text
Capture Desktop
        ↓
OCR
        ↓
Build Context
        ↓
Gemini
        ↓
Render Overlay
```

This prevents HoverAI from analyzing its own interface.

---

# Guidance Engine

The Guidance Engine becomes the central controller of HoverAI.

Responsibilities:

- Manage the Guidance Loop
- Manage the active session
- Build AI context
- Call Gemini
- Update overlay
- Wait for user interaction
- Continue until completion

The Guidance Engine coordinates every major component introduced in Phase 6.

---

# Overall Architecture

```text
                 User Goal
                      │
                      ▼
        Floating Overlay Control Bar
                      │
                      ▼
              Guidance Engine
                      │
      ┌───────────────┼───────────────┐
      │               │               │
      ▼               ▼               ▼
 Screenshot      OCR Service     Session Context
      │               │               │
      └───────────────┼───────────────┘
                      ▼
                 Gemini AI
                      ▼
          Pointer + Explanation
                      ▼
             WAIT FOR USER
                      ▼
             Next Step Button
                      │
                 Loop Continues
```

---

# Phase 6 Scope

This phase introduces:

- Guidance Loop
- Guidance Session
- Session Context
- AI Context Persistence
- Floating Overlay Control Bar
- Goal Input
- Next Step Button
- Manual User Progression
- Overlay Architecture
- Guidance Engine

---

# Future Enhancements

The following are intentionally outside the scope of the initial Phase 6 implementation:

- Automatic Screen Change Detection
- Click Detection
- Continuous Monitoring
- Retry Logic
- Undo Previous Step
- Session History
- Voice Commands
- Accessibility APIs
- Multi-monitor Support
- Smart Application Profiles
- Custom Guidance Templates
- Advanced Overlay Animations

These features can be integrated later because the Phase 6 architecture has been designed to support future expansion.

---

# Final Vision

HoverAI should feel like a lightweight AI assistant living directly on the user's screen.

The user workflow should be as simple as:

1. Type the goal.
2. HoverAI analyzes the screen.
3. Follow the visual guidance.
4. Press **Next Step** when ready.
5. HoverAI continues guiding until the task is complete.

The result is an AI assistant that behaves like a knowledgeable software tutor—maintaining context throughout the session while keeping the user fully in control and minimizing unnecessary processing and API usage.