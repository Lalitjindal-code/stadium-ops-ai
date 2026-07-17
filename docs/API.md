# API Documentation

## Stadium Operations Dashboard — FastAPI Backend

Base URL (local): `http://localhost:8000/api/v1`
All requests (except `/health`) require `Authorization: Bearer <Firebase ID token>`.

---

## 1. Auth

All endpoints verify the Firebase ID token via the Admin SDK and enforce role checks per route. Unauthenticated or wrong-role requests return `401`/`403`.

---

## 2. Endpoints

### Health
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | none | Liveness check |

### Data Upload (Organizer)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/data/upload/csv` | organizer | Upload CSV file for a data type |
| POST | `/data/upload/manual` | organizer | Submit manually entered data |
| GET | `/data/uploads` | organizer | List recent uploads |

**POST `/data/upload/manual`**

Request:
```json
{
  "type": "crowd",
  "rows": [
    { "gateId": "gate_A", "count": 4200, "timestamp": "2026-06-11T18:30:00Z" },
    { "gateId": "gate_B", "count": 1100, "timestamp": "2026-06-11T18:30:00Z" }
  ]
}
```

Response `201`:
```json
{
  "uploadId": "up_045",
  "type": "crowd",
  "rowCount": 2,
  "createdAt": "2026-06-11T18:30:05Z"
}
```

Error `422` (validation failure):
```json
{
  "error": "validation_error",
  "detail": "row[0].count must be a non-negative integer"
}
```

---

### Analysis (Organizer)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/analysis/run` | organizer | Trigger Gemini analysis for an upload |
| GET | `/analysis/{analysisId}` | organizer | Fetch a specific analysis |
| GET | `/analysis/latest` | organizer | Fetch most recent analysis |

**POST `/analysis/run`**

Request:
```json
{ "uploadId": "up_045" }
```

Response `200`:
```json
{
  "analysisId": "an_001",
  "congestionAlerts": [
    { "gateId": "gate_A", "severity": "high", "reasoning": "Entry rate exceeds exit rate by 3x over last 10 min" }
  ],
  "predictedBottlenecks": [
    { "location": "Gate A concourse", "etaMinutes": 15, "confidence": 0.78, "reasoning": "Current inflow trend projects overcapacity within 15 min" }
  ],
  "volunteerSuggestions": [
    { "volunteerId": "user_082", "suggestedLocation": "Gate A exterior", "reasoning": "Nearest available volunteer with crowd-control training" }
  ],
  "gateRecommendations": [
    { "fromGateId": "gate_A", "toGateId": "gate_C", "reasoning": "Gate C at 40% capacity, 2 min walk from Gate A" }
  ],
  "riskLevel": "high",
  "createdAt": "2026-06-11T18:32:00Z"
}
```

Error `502` (Gemini failure, fallback triggered):
```json
{
  "error": "ai_unavailable",
  "detail": "Gemini response could not be parsed; returning last known analysis",
  "fallbackAnalysisId": "an_000"
}
```

---

### Incidents
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/incidents` | organizer, volunteer | Report an incident |
| GET | `/incidents` | organizer | List incidents (filterable by status/risk) |
| GET | `/incidents/{incidentId}` | organizer | Get a single incident |
| PATCH | `/incidents/{incidentId}` | organizer | Update status |

**POST `/incidents`**

Request:
```json
{
  "location": "Gate B concourse",
  "description": "Fan collapsed near the merchandise stand, conscious but disoriented."
}
```

Response `201`:
```json
{
  "incidentId": "inc_009",
  "aiSummary": "Medical incident: fan collapsed, conscious, disoriented, near Gate B merchandise stand.",
  "riskLevel": "high",
  "status": "open",
  "createdAt": "2026-06-11T18:40:00Z"
}
```

---

### Volunteer Tasks
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/volunteers/me/tasks` | volunteer | Get own assigned tasks |
| PATCH | `/volunteers/tasks/{taskId}` | volunteer | Update task status |
| GET | `/volunteers/available` | organizer | List available volunteers |

**GET `/volunteers/me/tasks`**

Response `200`:
```json
{
  "tasks": [
    {
      "taskId": "task_017",
      "title": "Direct incoming crowd to Gate C",
      "priority": "urgent",
      "location": "Gate A exterior concourse",
      "aiInstructions": "Gate A is over capacity. Stand near the north barrier and redirect arriving fans to Gate C.",
      "status": "assigned"
    }
  ]
}
```

---

## 3. Standard Error Format

All errors follow:
```json
{
  "error": "<error_code>",
  "detail": "<human-readable explanation>"
}
```

| HTTP Status | error code | When |
|---|---|---|
| 400 | `bad_request` | Malformed request body |
| 401 | `unauthenticated` | Missing/invalid ID token |
| 403 | `forbidden` | Wrong role for this endpoint |
| 404 | `not_found` | Resource doesn't exist |
| 422 | `validation_error` | Pydantic schema validation failed |
| 502 | `ai_unavailable` | Gemini call failed or returned unparseable output |
| 500 | `internal_error` | Unhandled server error |
