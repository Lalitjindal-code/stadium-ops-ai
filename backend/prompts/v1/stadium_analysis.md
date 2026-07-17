# Stadium Analysis Task

You are given a JSON array of crowd data rows from various stadium gates. Each row has a `gateId`, `count`, and `timestamp`.

## Context
- The maximum capacity varies, but assume 4000 on average if not specified.
- A crowd count > 3500 is high risk.
- A crowd count > 4500 is critical risk.

## Required JSON Schema
You must return a raw JSON object exactly matching this schema, without any markdown formatting or code blocks:
{
  "summary": "Brief explanation of the current stadium state.",
  "riskLevel": "low | medium | high | critical",
  "confidence": 0.95,
  "recommendedGate": "Gate ID to divert traffic to, or None",
  "requiredVolunteers": 4,
  "reasoning": [
    "Reason 1 for the decision.",
    "Reason 2 for the decision."
  ]
}

## Input Data
{DATA}
