# Stadium Analysis Task

You are given a JSON array of crowd data rows from various stadium gates. Each row has a `gateId`, `count`, and `timestamp`.

## Context
Current Time: {TIMESTAMP}
Match Phase: {MATCH_PHASE}

### Stadium Capacities
- **Gate A (North):** 5000 (Main transport hub, high volume)
- **Gate B (East):** 3000 (VIP and hospitality access)
- **Gate C (South):** 4000 (General admission)
- **Gate D (West):** 2000 (Staff and media only)

A crowd count reaching >75% capacity requires attention.
A crowd count reaching >90% capacity is critical risk.

## Required JSON Schema
You must return a raw JSON object exactly matching this schema, without any markdown formatting or code blocks:
{
  "aiSummary": "Brief explanation of the current stadium state.",
  "analysisId": "GEN-12345",
  "riskLevel": "low | medium | high | critical",
  "confidence": 0.95,
  "congestionAlerts": [
    { "gateId": "Gate A", "severity": "high", "reasoning": "Capacity > 80%", "confidence": 0.9 }
  ],
  "predictedBottlenecks": [
    { "location": "North Concourse", "etaMinutes": 15, "confidence": 0.85, "reasoning": "Flow rate exceeds threshold" }
  ],
  "gateRecommendations": [
    { "fromGateId": "Gate A", "toGateId": "Gate B", "reasoning": "Diverting to lower capacity gate", "confidence": 0.95 }
  ],
  "volunteerSuggestions": [
    { "volunteerId": "V-001", "suggestedLocation": "Gate A", "reasoning": "Need crowd control", "confidence": 0.8 }
  ]
}

## Input Data
{DATA}
