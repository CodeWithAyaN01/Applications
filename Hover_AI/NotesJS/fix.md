# HoverAI — Goal Editing During Active Guidance

## Context

HoverAI currently locks the goal after a guidance session starts. If the user realizes the goal is wrong or wants to change it midway, they currently have to restart the application.

We need to fix this so the goal can be changed without restarting HoverAI.

---

## Core Requirement

> HoverAI must allow the user to change their goal at any time during an active guidance session without restarting the application, while correctly resetting the old guidance context and starting a fresh guidance session for the new goal.

---

## Approved Flow

```text
Active Guidance
      ↓
User clicks "Change Goal"
      ↓
Goal becomes editable
      ↓
User enters the new goal
      ↓
User clicks "Confirm Goal"
      ↓
Old guidance session is replaced/reset
      ↓
Fresh guidance session is created
      ↓
Current screen is captured again
      ↓
OCR runs
      ↓
Gemini analyzes the new goal + fresh context
      ↓
New guidance is displayed