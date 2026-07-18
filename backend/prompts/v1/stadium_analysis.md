# Stadium Analysis Task

You are given a JSON array of crowd data rows from various stadium gates. Each row has a `gateId`, `count`, and `timestamp`.

## Context
Current Time: {TIMESTAMP}
Match Phase: {MATCH_PHASE}
Number of gates reporting: {GATE_COUNT}

### Stadium Capacities & Risk Thresholds
| Gate | Capacity | Notes |
|------|----------|-------|
| Gate A (North) | 5,000 | Main transport hub — highest volume |
| Gate B (East)  | 3,000 | VIP and hospitality access |
| Gate C (South) | 4,000 | General admission |
| Gate D (West)  | 2,000 | Staff and media only |

- **≥ 50% capacity** → Monitor (medium risk)
- **≥ 75% capacity** → Attention required (high risk)
- **≥ 90% capacity** → Critical — immediate diversion required

## Required JSON Schema
Return a raw JSON object EXACTLY matching this schema. No markdown fences, no extra fields.

```json
{
  "aiSummary": "Brief explanation of the current stadium state mentioning specific gate IDs and counts.",
  "analysisId": "GEN-XXXXX",
  "riskLevel": "low | medium | high | critical",
  "confidence": 0.95,
  "reasoning": [
    "Specific reason 1 citing gate ID and count",
    "Specific reason 2 with evidence"
  ],
  "congestionAlerts": [
    { "gateId": "Gate A", "severity": "high", "reasoning": "Count 4200 is 84% of capacity 5000", "confidence": 0.9 }
  ],
  "predictedBottlenecks": [
    { "location": "North Concourse", "etaMinutes": 15, "confidence": 0.85, "reasoning": "Flow rate exceeds threshold at current entry rate" }
  ],
  "gateRecommendations": [
    { "fromGateId": "Gate A", "toGateId": "Gate C", "reasoning": "Gate C at 40% capacity — 2 min walk for fans", "confidence": 0.95 }
  ],
  "volunteerSuggestions": [
    { "volunteerId": "V-001", "suggestedLocation": "Gate A exterior", "reasoning": "Crowd control needed for diversion signage", "confidence": 0.8 }
  ]
}
```

**IMPORTANT**: The `reasoning` array must be non-empty. Cite exact gate IDs and crowd counts.

## Input Data
{DATA}
