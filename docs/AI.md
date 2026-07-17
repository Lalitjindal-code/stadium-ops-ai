# AI Integration — Gemini

## Stadium Operations Dashboard

Gemini is the reasoning core of this application. Every AI-facing endpoint must return **structured JSON with an explicit `reasoning` field** — never raw prose, and never a bare data dump with no rationale.

---

## 1. Integration Approach

- Backend-only calls (never from the frontend) via `services/gemini_service.py`, using the official Gemini SDK.
- All prompts request **JSON-schema-constrained output** (Gemini structured output mode) so responses can be validated with Pydantic before being trusted or stored.
- One Gemini call per "analysis run" and one per incident report — kept simple rather than chaining multiple calls, to stay within hackathon scope and keep latency predictable.

---

## 2. Prompt Design Principles

1. **Always provide context + constraints**, not just raw data — gate capacities, known thresholds, and persona needs so Gemini reasons over meaningful baselines, not numbers alone.
2. **Always request reasoning** as a required field, not optional — this is a judging criterion and a product requirement (FR-2, FR-3).
3. **Constrain output format** with an explicit JSON schema in the prompt and via Gemini's structured output config, so backend parsing is reliable.
4. **Keep prompts stateless** — each request includes all context needed; no reliance on prior conversation turns, since this is a request/response API, not a chat.

---

## 3. Prompt Templates

### 3.1 Congestion / Bottleneck / Volunteer / Gate Analysis

```
System instruction:
You are an operations analyst for a FIFA World Cup stadium. Analyze the
provided operational data and return ONLY valid JSON matching the schema
below. Every recommendation must include a "reasoning" field explaining
the specific data points that led to it. Do not invent data not present
in the input.

Input data:
- Gate capacities: {gate_capacities_json}
- Current crowd counts: {crowd_data_json}
- Volunteer availability: {volunteer_data_json}
- Parking status: {parking_data_json}

Output schema:
{
  "congestionAlerts": [{"gateId": string, "severity": "low"|"medium"|"high"|"critical", "reasoning": string}],
  "predictedBottlenecks": [{"location": string, "etaMinutes": number, "confidence": number, "reasoning": string}],
  "volunteerSuggestions": [{"volunteerId": string, "suggestedLocation": string, "reasoning": string}],
  "gateRecommendations": [{"fromGateId": string, "toGateId": string, "reasoning": string}],
  "riskLevel": "low"|"medium"|"high"|"critical"
}
```

### 3.2 Incident Summarization

```
System instruction:
You are triaging an incident report at a FIFA World Cup stadium. Summarize
the report in one sentence and assign a risk level. Return ONLY valid JSON.
Do not speculate about facts not stated in the report.

Input:
- Report text: {incident_description}
- Location: {location}

Output schema:
{
  "aiSummary": string,
  "riskLevel": "low"|"medium"|"high"|"critical",
  "reasoning": string
}
```

### 3.3 Volunteer Instructions

```
System instruction:
Convert this operational recommendation into a single, clear, plain-language
instruction for a volunteer with no technical background. One or two
sentences max. Return ONLY valid JSON.

Input:
- Recommendation: {recommendation_json}
- Volunteer location: {volunteer_location}

Output schema:
{
  "instructions": string
}
```

---

## 4. JSON Output Contract

- Every Gemini call in this app uses Gemini's structured/JSON output mode with the schemas above passed as the response schema, not just described in prompt text.
- Backend validates every response against a matching Pydantic model before writing to Firestore or returning to the client.
- `riskLevel` and `severity` are always constrained enums — never free text — so the frontend can reliably color-code UI without string matching.

---

## 5. Safety Checks

| Check | Where | Why |
|---|---|---|
| Input validation (types, ranges) before prompt construction | `services/validation.py` | Prevent malformed/oversized data from corrupting prompts |
| No PII beyond what's operationally necessary sent to Gemini | prompt construction | Incident reports may contain names — strip/redact before sending where not needed for the summary |
| Output schema validation | `gemini_service.py` | Reject and fallback on any response that doesn't match the Pydantic schema |
| Reasoning field required (non-empty) | schema validation | Enforces the "AI must reason, not just output" product requirement |
| No prompt injection from raw incident text | prompt construction | Incident `description` is inserted as a delimited data field, never concatenated into the system instruction |

---

## 6. Fallback Handling

If Gemini call fails, times out, or returns output that fails schema validation:

1. Retry once with a shorter/simplified prompt (in case of a size/complexity issue).
2. If retry fails, return the **last successful analysis** for that context (e.g., `fallbackAnalysisId`) with a flag `"stale": true`, per the `502 ai_unavailable` contract in `API.md`.
3. Log the raw failed response for debugging (never surfaced to the end user).
4. Frontend displays a clear "AI analysis temporarily unavailable — showing last known state" banner rather than failing silently or crashing.

This keeps the app usable during a live demo or real event even if a single Gemini call has an issue.
