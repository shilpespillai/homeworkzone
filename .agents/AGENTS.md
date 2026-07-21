# Project-Scoped Rules for Homework Zone (Keen Noether)

This file contains rules and constraints that guide all agentic development, refactoring, and code changes in this workspace.

## 1. Safety and Guardrails for Critical Layers

### Firebase Operations
- Do NOT perform raw Firestore write operations without validating the user authentication status.
- Ensure all queries targeting user-scoped data filter explicitly by `userId` or verify permission context.
- Keep security rules updated if schemas change.

### Stripe Payments
- Any changes to checkout flows or webhooks must include log checks and error-handling try-catch blocks.
- Never hardcode Stripe keys or expose private tokens to the client environment. Always load them via `import.meta.env` or serverless configuration.

### AI Prompt Generation & LLMs
- AI models are tiered by grade. Do not bypass the grade-tiered routing model (Haiku for F-5, Sonnet for 6-10, Opus for 11-12 STEM).
- When generating questions, dynamic payloads must validate schemas (e.g. check for required keys like `questions`, `options`, `correctAnswer`) before saving to Firestore to prevent runtime UI crashes.

---

## 2. Design and Aesthetics Guide
- Follow the guidelines defined in [design.md](file:///C:/Users/ASUS/Documents/antigravity/keen-noether/design.md) for animal coordinate anchors and absolute layouts.
- Always use smooth transition curves (Framer Motion transitions should have spring or ease-in-out properties).
- Use dynamic, premium illustrations (e.g. Pixar-style SVGs or curated palettes) rather than standard solid color placeholders.

---

## 3. Verification & Execution Loop
- Before declaring a feature complete, verify:
  1. No console errors are triggered.
  2. Tailwind CSS builds successfully.
  3. JSON files (like subject data schemas) remain valid.
