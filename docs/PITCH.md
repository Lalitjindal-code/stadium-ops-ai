# Pitch Deck Narrative

## Stadium Operations Dashboard — Google PromptWars, Challenge 4

---

## 1. Problem (30 seconds)

During FIFA World Cup 2026 matches, stadium control rooms are flooded with fragmented signals — gate cameras, radios, spreadsheets — and organizers must make time-critical calls with incomplete situational awareness. Volunteers on the ground often get vague, delayed instructions with no sense of priority. The result: slower response to congestion, bottlenecks, and incidents, at exactly the moments where minutes matter.

---

## 2. Solution (30 seconds)

An AI-powered Stadium Operations Dashboard where Gemini is the reasoning core, not a bolt-on feature. Organizers feed in live operational data; Gemini returns **reasoned recommendations** — congestion alerts, predicted bottlenecks, volunteer assignments, alternate gate suggestions, and risk-scored incident summaries — each with an explicit rationale. Volunteers get a focused mobile view: their task, its priority, and plain-language AI instructions.

---

## 3. Architecture (30–45 seconds)

Next.js PWA frontend (organizer + volunteer views), FastAPI backend as the single point of control for validation and Gemini prompt construction, Firebase Firestore for real-time data sync, Firebase Auth for role-based access. One backend service, one database — a deliberately simple architecture that keeps every AI call auditable and testable rather than distributed across microservices that don't add value at this scope.

---

## 4. Demo Flow (2–3 minutes)

1. **Organizer uploads crowd data** (CSV) for a live match scenario.
2. **Trigger AI analysis** → show the loading state, then the recommendation cards populating with visible reasoning (not just numbers).
3. **Expand a congestion alert's reasoning** to show Gemini explaining *why* — this is the core differentiator, emphasize it.
4. **Assign a volunteer** from the AI's suggestion → switch to the volunteer's device/view → task appears live with plain-language instructions, no refresh needed.
5. **Volunteer reports an incident** → switch back to organizer view → incident appears with an AI-generated summary and risk level within seconds.
6. **Show the map view** tying gates, incidents, and volunteers together spatially.
7. **Trigger a simulated Gemini failure** (optional, if time allows) → show the fallback banner, proving the system degrades gracefully instead of breaking.

---

## 5. Innovation (30 seconds)

Most "AI dashboards" in this space just summarize data. This system requires **reasoning as a first-class output** — every recommendation is schema-validated to include a rationale before it's ever shown to a human decision-maker. That's a deliberate constraint, not a nice-to-have: it's enforced at the JSON schema level, tested explicitly, and it's what turns Gemini from a text generator into a decision-support system organizers can actually trust under pressure.

---

## 6. Why GenAI (not just rules/dashboards) (30 seconds)

Rule-based thresholds ("alert if crowd > X") can't explain *why* a specific gate matters more than another right now, can't adapt reasoning to combinations of signals (crowd + volunteer availability + parking simultaneously), and can't convert a technical recommendation into plain-language field instructions. Gemini does all three in one reasoning step, which is exactly what a human operator under time pressure needs — not more dashboards, but faster, explainable judgment calls.

---

## 7. Anticipated Judge Q&A

| Likely Question | Answer |
|---|---|
| "What happens if Gemini gives a wrong recommendation?" | Every output requires reasoning, is schema-validated, and displayed with its rationale so a human organizer always makes the final call — this is decision *support*, not decision *automation*. |
| "How do you handle Gemini API failures during a live event?" | Retry once, then fall back to the last known-good analysis with a visible "stale" indicator — see `AI.md` fallback handling. The app never silently breaks or shows fabricated data. |
| "Why Firestore over a relational database?" | Real-time listeners give us live volunteer/organizer sync without building custom WebSocket infrastructure, and it deepens our Google-service integration — directly relevant to this challenge. |
| "How does this scale to a full 80,000-seat stadium?" | The architecture is stateless at the API layer and Cloud Run auto-scales; the current bottleneck would be Gemini request volume, which we'd batch/debounce rather than calling on every data point. |
| "What stops a volunteer from seeing another volunteer's tasks?" | Firestore security rules plus backend role/ownership checks on every read — enforced at two layers, not just the UI. |
| "Why only two personas?" | Deliberate scope discipline — the challenge brief asked us to solve one problem well. Organizer and volunteer cover the full operational loop: decide → act → report → decide again. |
| "What's out of scope and why?" | Live camera/IoT ingestion, multilingual UI, and predictive modeling across multiple stadiums — all listed as future scope in the PRD, cut to keep the MVP focused and demoable in 10–14 days. |
