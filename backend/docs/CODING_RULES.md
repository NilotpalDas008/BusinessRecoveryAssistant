# Coding Rules

## Purpose

This document defines the coding standards and architectural rules that every AI agent must follow while generating code for this project.

These rules are mandatory.

---

# General Principles

- Follow SOLID principles.
- Follow Clean Architecture where applicable.
- Write modular and reusable code.
- Keep business logic separate from controllers.
- Prefer composition over inheritance.
- Avoid code duplication (DRY).
- Keep functions focused on a single responsibility.

---

# Language

- Use TypeScript only.
- Enable strict TypeScript mode.
- Never use JavaScript.
- Never disable type checking.

---

# Type Safety

- Never use `any`.
- Prefer `unknown` when necessary.
- Create interfaces for all request and response objects.
- Use explicit return types for every function.
- Use enums instead of magic strings where appropriate.

Example

❌ Bad

```ts
function analyze(data: any) {}
```

✅ Good

```ts
function analyze(review: Review): Promise<AIReview> {}
```

---

# Project Structure

Controllers

- Handle HTTP requests.
- Validate request data.
- Call services.
- Return responses.
- No business logic.

Services

- Contain business logic.
- Perform review analysis.
- Generate analytics.
- Communicate with Gemini.

Agents

- Perform AI reasoning.
- Build prompts.
- Parse AI responses.

Prompts

- Store all prompts separately.
- Never hardcode prompts inside services.

Utilities

- Helper functions only.

---

# AI Prompt Rules

- Every AI prompt must exist inside the `/prompts` folder.
- Never hardcode prompts.
- Prompts must be reusable.
- Prompts must instruct Gemini to return JSON only.
- Never accept markdown responses from Gemini.

---

# API Rules

All endpoints must

- Return JSON.
- Return proper HTTP status codes.
- Validate request body.
- Handle errors gracefully.

Never expose stack traces.

---

# Error Handling

Always

- Catch exceptions.
- Log errors.
- Return meaningful error messages.

Never

- Crash the application.
- Ignore promise rejections.
- Throw raw Gemini responses.

---

# Async Rules

Use

- async / await

Do NOT use

- Promise chains (.then())
- Nested callbacks

---

# Naming Convention

Variables

camelCase

Functions

camelCase

Classes

PascalCase

Interfaces

PascalCase

Enums

PascalCase

Constants

UPPER_SNAKE_CASE

Files

kebab-case

Examples

review-analysis.service.ts

gemini.service.ts

review.controller.ts

---

# Function Rules

Every function should

- Have one responsibility.
- Be easy to read.
- Be easy to test.

Avoid functions longer than 50 lines.

Extract reusable logic whenever possible.

---

# Validation Rules

Validate

- Rating
- Review text
- Date
- Empty arrays
- Missing fields

Reject invalid requests before AI processing.

---

# Logging

Log

- API requests
- Gemini requests
- Gemini responses (optional in development)
- Errors
- Processing time

Never log

- API Keys
- Secrets
- Sensitive user data

---

# Performance

- Batch review analysis whenever possible.
- Avoid unnecessary Gemini API calls.
- Cache repeated prompts if appropriate.
- Minimize response latency.

---

# Security

Never

- Hardcode API keys.
- Commit `.env` files.
- Expose internal errors.

Use environment variables for all secrets.

---

# Testing

Every service should be testable independently.

Write

- Unit tests
- Integration tests

Mock Gemini responses during testing.

---

# Documentation

Every public function should include JSDoc.

Example

```ts
/**
 * Analyze a customer review using Gemini.
 *
 * @param review Customer review.
 * @returns AI analysis.
 */
```

---

# Response Format

Always return structured JSON.

Never return free-form AI text.

Every response must follow the schema defined in `API_SPEC.md`.

---

# Code Generation Rules for AI Agents

When generating code:

- Read PROJECT.md first.
- Read CONTEXT.md before every task.
- Follow API_SPEC.md strictly.
- Follow DATA_SCHEMA.md for all interfaces.
- Follow REVIEW_PIPELINE.md for workflow.
- Never invent APIs.
- Never change existing interfaces without updating documentation.
- Ask for clarification if requirements are ambiguous.
- Keep generated code production-ready.

---

# Definition of Done

A task is complete only if:

- Code compiles without errors.
- TypeScript has zero type errors.
- Lint passes.
- API returns expected JSON.
- Error handling is implemented.
- Documentation is updated if required.
- Code follows every rule in this document.




# AI Behavior Rules

The AI assistant must:

- Never hallucinate missing business logic.
- Never create fake API endpoints.
- Never assume unavailable data.
- Prefer reusable services over duplicated logic.
- Keep prompts deterministic.
- Always return valid JSON from AI interactions.
- If unsure about a requirement, stop and ask for clarification instead of guessing.