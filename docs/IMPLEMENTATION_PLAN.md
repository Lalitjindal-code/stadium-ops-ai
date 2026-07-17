# Implementation Plan

## Stadium Operations Dashboard — Solo Build, Phase by Phase

---

## Phase 0: Project Setup

**Goal:** Repos, environments, and cloud services ready to build against.

**Tasks:**
- Create GitHub repo, `frontend/` and `backend/` folders
- Init Next.js (TS + Tailwind) app; init FastAPI app with base structure
- Create Firebase project; enable Firestore + Auth
- Get Gemini API key, Google Maps API key
- Set up `.env.example` files for both apps

**Files to create:** `frontend/` scaffold, `backend/app/main.py`, `.env.example` (both), `README.md` (draft)

**Testing:** Frontend renders default page; backend `/health` returns 200

**Suggested commits:**
- `chore: scaffold frontend and backend`
- `chore: add firebase and gemini env config`

---

## Phase 1: Auth & Roles

**Goal:** Organizer and volunteer can log in and reach role-gated routes.

**Tasks:**
- Firebase Auth email/password on frontend
- Role custom claim set on user creation (small admin script)
- Backend: Admin SDK token verification dependency
- Frontend: route middleware for `/organizer/*` vs `/volunteer/*`

**Files to create:** `backend/app/core/auth.py`, `frontend/lib/firebase.ts`, `frontend/middleware.ts`, `frontend/app/login/page.tsx`

**Testing:** Login as each role; verify wrong-role access to a route returns 403 / redirects

**Suggested commits:**
- `feat: firebase auth on frontend`
- `feat: backend token verification + role enforcement`

---

## Phase 2: Data Ingestion

**Goal:** Organizer can upload CSV or enter data manually; it's validated and stored.

**Tasks:**
- Pydantic models for each data type (crowd, gate, volunteer, medical, parking)
- `POST /data/upload/csv`, `POST /data/upload/manual` endpoints
- CSV parsing + row validation
- Frontend upload page with drag-and-drop + manual entry toggle
- Firestore `dataUploads` collection writes

**Files to create:** `backend/app/routers/data.py`, `backend/app/models/data.py`, `backend/app/services/firestore_service.py`, `frontend/app/organizer/upload/page.tsx`, `frontend/components/DataUploadForm.tsx`

**Testing:** Valid CSV uploads succeed; malformed rows return 422 with a clear message; manual entry round-trips to Firestore

**Suggested commits:**
- `feat: data upload endpoints and validation`
- `feat: organizer upload UI`

---

## Phase 3: Gemini Analysis Pipeline

**Goal:** Organizer can trigger an AI analysis and see structured, reasoned recommendations.

**Tasks:**
- `gemini_service.py`: prompt construction, structured JSON output call, schema validation
- `POST /analysis/run`, `GET /analysis/{id}`, `GET /analysis/latest`
- Fallback handling (retry once, then last-known-good + `stale` flag)
- Frontend: `RecommendationCard` components, loading state, dashboard wiring

**Files to create:** `backend/app/services/gemini_service.py`, `backend/app/routers/analysis.py`, `backend/app/models/analysis.py`, `frontend/components/RecommendationCard.tsx`, `frontend/app/organizer/page.tsx`

**Testing:** Analysis run against sample CSV returns valid schema; simulate Gemini failure and confirm fallback path works; reasoning field is always non-empty

**Suggested commits:**
- `feat: gemini analysis service with schema validation`
- `feat: analysis endpoints + fallback handling`
- `feat: organizer dashboard recommendation cards`

---

## Phase 4: Incidents

**Goal:** Incidents can be reported (by either persona), AI-summarized, and triaged.

**Tasks:**
- `POST /incidents`, `GET /incidents`, `GET /incidents/{id}`, `PATCH /incidents/{id}`
- Incident summarization prompt + call
- Organizer incident list + detail pages
- Volunteer incident report form

**Files to create:** `backend/app/routers/incidents.py`, `backend/app/models/incident.py`, `frontend/app/organizer/incidents/page.tsx`, `frontend/app/organizer/incidents/[id]/page.tsx`, `frontend/app/volunteer/report/page.tsx`

**Testing:** Submit incident from volunteer view, confirm it appears in organizer list with AI summary + risk level within a few seconds

**Suggested commits:**
- `feat: incident endpoints and gemini summarization`
- `feat: incident triage UI`
- `feat: volunteer incident report form`

---

## Phase 5: Volunteer Tasks

**Goal:** Volunteers see assigned tasks with AI instructions; can update status.

**Tasks:**
- `GET /volunteers/me/tasks`, `PATCH /volunteers/tasks/{id}`, `GET /volunteers/available`
- Volunteer instruction generation prompt (plain-language conversion)
- Firestore real-time listener wiring on volunteer task view
- Volunteer dashboard UI (`TaskCard`)

**Files to create:** `backend/app/routers/volunteers.py`, `backend/app/models/task.py`, `frontend/app/volunteer/page.tsx`, `frontend/components/TaskCard.tsx`

**Testing:** Assign a task from an analysis result, confirm it appears live on volunteer's device without refresh; status updates reflect on organizer side

**Suggested commits:**
- `feat: volunteer task endpoints`
- `feat: realtime task updates on volunteer dashboard`

---

## Phase 6: Map Integration

**Goal:** Organizer dashboard shows a live map of gates, incidents, and volunteers.

**Tasks:**
- `LiveMap` component wrapping Google Maps JS API
- Gate/incident/volunteer marker rendering with color-coded status

**Files to create:** `frontend/components/LiveMap.tsx`, `backend/app/routers/gates.py` (if gate CRUD needed)

**Testing:** Map renders with correct marker colors matching current status/risk data

**Suggested commits:**
- `feat: live map integration`

---

## Phase 7: Polish, Edge Cases, Testing

**Goal:** App is demo-ready and resilient to bad input/AI failures.

**Tasks:**
- Edge case pass (empty data, malformed CSV, Gemini timeout, no volunteers available)
- Loading/error states across all views
- Accessibility pass (color+text indicators, tap target sizes)
- Full testing checklist from `TESTING.md`

**Files to create/modify:** various, plus `frontend/components/ErrorState.tsx`, `frontend/components/AnalysisLoadingState.tsx`

**Testing:** Full manual pass of `TESTING.md` checklist

**Suggested commits:**
- `fix: edge case handling across upload and analysis flows`
- `feat: loading and error states`
- `test: manual QA pass`

---

## Phase 8: Deployment & Demo Prep

**Goal:** Deployed, working demo with seed data ready.

**Tasks:**
- Deploy frontend to Vercel, backend to Cloud Run
- Seed Firestore with a realistic demo dataset
- Dry-run the demo flow end to end
- Finalize `PITCH.md` talking points

**Files to create:** `backend/scripts/seed_demo_data.py`, deployment configs (`vercel.json`, `Dockerfile` for Cloud Run)

**Testing:** Full demo run-through on deployed URLs, not localhost

**Suggested commits:**
- `chore: deployment configs`
- `chore: demo seed data`

---

## Phase Summary

| Phase | Focus |
|---|---|
| 0 | Setup |
| 1 | Auth |
| 2 | Data ingestion |
| 3 | Gemini analysis |
| 4 | Incidents |
| 5 | Volunteer tasks |
| 6 | Map |
| 7 | Polish & testing |
| 8 | Deploy & demo prep |
