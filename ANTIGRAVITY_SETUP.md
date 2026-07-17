# Antigravity Setup Guide — Stadium Operations Dashboard

Ye file batati hai: (1) docs kaha rakhne hai, (2) AGENTS.md kya likhna hai, (3) kaunse task ke liye Claude Sonnet vs Gemini use karna hai.

---

## 1. Project Folder Structure

Antigravity mein naya folder banao (e.g. `stadium-ops-dashboard/`) aur usse Antigravity mein open karo. Structure ye rahega:

```
stadium-ops-dashboard/
├── AGENTS.md                 ← neeche wali content yahan paste karo
├── docs/                     ← saari 10 generated docs yahan daalo
│   ├── README.md
│   ├── PRD.md
│   ├── SYSTEM_DESIGN.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── AI.md
│   ├── UI_UX.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── TESTING.md
│   └── PITCH.md
├── frontend/                 ← Antigravity yaha Next.js app banayega
├── backend/                  ← Antigravity yaha FastAPI app banayega
└── .env.example
```

**Important:** root `README.md` (jo docs/ mein bhi hai) ko root mein bhi ek copy rakho — GitHub aur judges dono usko root mein expect karte hai. Baaki 9 docs sirf `docs/` mein rakhna kaafi hai.

Antigravity project ko **poore repo ke saath** open karo, sirf `frontend/` ya `backend/` folder alag se open mat karo — warna agent ko cross-cutting context (jaise DATABASE.md ka schema jo dono sides use karte hai) nahi milega.

---

## 2. AGENTS.md — Root mein ye file banao

```markdown
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

Antigravity ye file **session start pe automatically read karega** (v1.20.3+ se native support hai). Agar `~/.gemini/GEMINI.md` bhi hai to wo AGENTS.md se priority mein upar rahegi — conflicting rule na rakhna dono jagah.

---

## 3. Model Selection — Claude Sonnet vs Gemini (Token Optimization)

Antigravity mein har agent/task ko manually model assign kar sakte ho. General principle: **Gemini fast + sasta hai bulk/boilerplate ke liye (Google-native, bada context window efficiently use karta hai); Claude Sonnet better hai jaha reasoning quality, careful logic, ya security matter karta hai.** Match model to task — har jagah premium model mat lagao, warna tokens waste honge.

| Task | Recommended Model | Kyun |
|---|---|---|
| Project scaffolding (Next.js/FastAPI boilerplate, folder setup) | **Gemini** | Repetitive, well-known patterns — no need for premium reasoning |
| Firebase Auth + role middleware setup | **Gemini** | Standard, well-documented pattern |
| CSV parsing / Pydantic validation models | **Gemini** | Mechanical, schema-driven — Gemini handles fast and cheap |
| **Gemini prompt engineering (AI.md templates, JSON schema design)** | **Claude Sonnet** | Designing the actual reasoning prompts needs careful judgment on what makes AI output trustworthy — this is your core differentiator, don't cheap out here |
| Backend business logic (analysis pipeline, fallback handling) | **Claude Sonnet** | Multi-step logic with edge cases (retry, fallback, schema validation) — quality > speed |
| Firestore security rules | **Claude Sonnet** | Security-sensitive; mistakes here are costly, worth the extra reasoning |
| Frontend UI components (cards, forms, layouts) | **Gemini** | Antigravity's browser-verification loop (screenshot-based UI checking) is Gemini-native and fastest here |
| Google Maps integration | **Gemini** | Google-native API, Gemini has strong first-party familiarity |
| Debugging a specific failing test/bug | **Claude Sonnet** | Root-cause reasoning on a narrow, hard problem — worth the tokens |
| Writing/updating docs (README, comments) | **Gemini** | Low-stakes, high-volume text — save Claude tokens for code |
| Code review pass before demo (Phase 7 polish) | **Claude Sonnet** | Catching subtle edge cases and security gaps benefits from stronger reasoning |
| Test-writing (pytest cases from TESTING.md) | **Gemini** | Mechanical translation of your checklist into test code |
| PITCH.md refinement / demo script wording | **Gemini** | Text polish, not technical reasoning |

**Rule of thumb:** agar task "likhna/dohrana" (generate boilerplate, repeat a known pattern) hai → Gemini. Agar task "sochna" (design a prompt, debug a subtle bug, judge security/correctness trade-offs) hai → Claude Sonnet. Isse aap Claude ke tokens sirf high-value reasoning steps pe kharch karoge, aur baaki bulk kaam Gemini se fast/cheap complete hoga.

**Practical tip:** Antigravity ke Agent Manager mein separate agents banao (jaise guide mein dikhaya) — e.g. "frontend-dev" (Gemini) aur "ai-logic-dev" (Claude Sonnet) — taaki har mission apne default model ke saath start ho, baar-baar switch na karna pade.
