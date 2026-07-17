# Testing Strategy

## Stadium Operations Dashboard

---

## 1. Unit Testing

| Area | What to test | Tooling |
|---|---|---|
| Pydantic models | Valid/invalid data rejected correctly for each data type | pytest |
| `validation.py` | CSV row edge cases (missing fields, wrong types, negative counts) | pytest |
| `gemini_service.py` | Prompt construction produces expected structure (mock Gemini response) | pytest + mocked SDK |
| Schema validation | Malformed Gemini JSON correctly triggers fallback, not a crash | pytest |
| Frontend components | `RiskBadge`, `RecommendationCard`, `TaskCard` render correctly for each state | Jest + React Testing Library |

---

## 2. API Testing

| Endpoint | Cases to cover |
|---|---|
| `POST /data/upload/manual` | Valid payload → 201; missing field → 422; wrong role → 403 |
| `POST /data/upload/csv` | Valid CSV → 201; malformed CSV → 422; empty file → 422 |
| `POST /analysis/run` | Valid upload → 200 with full schema; missing uploadId → 400; Gemini failure → 502 with fallback |
| `POST /incidents` | Valid report → 201 with AI summary; empty description → 422 |
| `PATCH /incidents/{id}` | Valid status transition → 200; invalid status value → 422; wrong role → 403 |
| `GET /volunteers/me/tasks` | Returns only the authenticated volunteer's tasks, never another's |
| Auth (all routes) | Missing token → 401; expired token → 401; wrong role → 403 |

Tooling: `pytest` + `httpx.AsyncClient` against the FastAPI test app; Firestore emulator for isolated test runs (no writes to production data).

---

## 3. AI Output Validation

This is the most hackathon-specific testing category — judges will probe AI reliability directly.

| Check | How |
|---|---|
| Every recommendation includes non-empty `reasoning` | Assert in schema validation tests |
| Output strictly matches JSON schema | Automated Pydantic validation on every real and mocked response |
| No hallucinated entities (gateIds/volunteerIds not present in input) | Cross-check returned IDs against input data before accepting response |
| Fallback triggers correctly | Mock a malformed/timeout Gemini response, assert fallback path returns last-known-good data with `stale: true` |
| Risk/severity values are constrained enums only | Reject any response using a value outside the defined enum |
| Prompt injection resistance | Feed an incident description containing instruction-like text (e.g., "ignore previous instructions") and confirm it's treated as data, not followed as a command |

---

## 4. Edge Cases

| Scenario | Expected behavior |
|---|---|
| CSV upload with zero rows | 422, clear error message, no Firestore write |
| Gemini API key missing/invalid at runtime | 502 with fallback, logged server-side, app doesn't crash |
| No volunteers available for assignment | Analysis still returns other recommendation types; `volunteerSuggestions` is an empty array with a reasoning note, not an error |
| Duplicate incident report (same volunteer, same location, within seconds) | Accepted but flagged for organizer review, not silently deduped or silently duplicated without visibility |
| Volunteer with no assigned tasks | Dashboard shows a clear empty state, not a blank/broken screen |
| Extremely high crowd count (e.g., data entry typo of 999999) | Validation caps/flags implausible values before they reach the Gemini prompt |
| Concurrent analysis runs on the same upload | Only the latest is treated as "current" for dashboard display; both are stored |
| Firestore listener disconnect (volunteer loses signal) | Frontend shows a "reconnecting" state rather than silently going stale with no indicator |

---

## 5. Manual Testing Checklist (Pre-Demo)

- [ ] Organizer can log in and reach `/organizer`
- [ ] Volunteer can log in and reach `/volunteer`; cannot reach `/organizer/*`
- [ ] CSV upload of sample crowd data succeeds and shows preview
- [ ] "Run AI Analysis" produces recommendations with visible reasoning within a few seconds
- [ ] Map renders gates with correct color-coded status
- [ ] Volunteer report an incident → appears in organizer incident list with AI summary within seconds
- [ ] Assign a task from a recommendation → volunteer sees it live without refreshing
- [ ] Volunteer acknowledges/completes a task → status updates on organizer side
- [ ] Kill network briefly on volunteer device → reconnect shows correct current state (no stale silent data)
- [ ] Simulate Gemini failure (bad API key) → app shows fallback banner, doesn't crash
- [ ] Full demo script run end-to-end on deployed (non-localhost) URLs
