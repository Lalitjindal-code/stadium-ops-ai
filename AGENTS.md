# AGENTS.md — Stadium Operations Dashboard

## Project Context
This is a hackathon MVP for Google PromptWars Challenge 4 (Smart Stadiums &
Tournament Operations, FIFA World Cup 2026). Full specs are in /docs — always
read the relevant doc before implementing a feature:
- docs/PRD.md — requirements, personas, MVP scope
- docs/SYSTEM_DESIGN.md — architecture decisions and trade-offs
- docs/DATABASE.md — Firestore schema (source of truth for all data shapes)
- docs/API.md — exact endpoint contracts (request/response shapes)
- docs/AI.md — Gemini prompt templates, JSON schemas, fallback rules
- docs/UI_UX.md — page layouts, component list
- docs/IMPLEMENTATION_PLAN.md — build order, follow this phase sequence

## Tech Stack (do not deviate without asking)
- Frontend: Next.js (App Router) + TypeScript + TailwindCSS
- Backend: FastAPI (Python 3.11+)
- Database/Auth: Firebase Firestore + Firebase Auth
- AI: Gemini API — structured JSON output only, schema-validated on the backend
- Maps: Google Maps JS API

## Rules
- GenAI (Gemini) must be the core of every recommendation feature — never
  hardcode or stub AI output, even temporarily, without marking it TODO.
- Every Gemini response must include a non-empty `reasoning` field (see AI.md).
- All Gemini calls happen backend-side only. Never call Gemini directly from
  the frontend or expose the API key client-side.
- Validate all incoming data with Pydantic before it reaches a Gemini prompt.
- Match DATABASE.md field names and types exactly — don't invent new fields.
- Match API.md request/response shapes exactly — don't change contracts
  without updating API.md first.
- Keep the two personas separate: organizer routes under /organizer, volunteer
  routes under /volunteer, enforced by role-based middleware + backend auth.
- Follow IMPLEMENTATION_PLAN.md phase order — don't jump ahead to Phase 5
  before Phase 2–4 are working.
- No unnecessary microservices, no over-engineering — this is a 10–14 day
  solo hackathon MVP, not production infra.

## Testing Expectations
- Every new endpoint needs at least one pytest case (see TESTING.md for cases).
- Every Gemini-calling function must have a test for the fallback path
  (simulate malformed/failed response).

## Commit Style
- Conventional commits: feat:, fix:, chore:, test: — see IMPLEMENTATION_PLAN.md
  for suggested commit messages per phase.
```