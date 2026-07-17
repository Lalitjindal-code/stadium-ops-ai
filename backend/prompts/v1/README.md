# Prompt Engineering Strategy (v1.0)

## Purpose
This directory contains the prompts used to guide Google Gemini in analyzing stadium crowd data and generating actionable operational recommendations.

## Structure
- **system_prompt.md**: Establishes the AI's persona, constraints, and strict output format (JSON only).
- **stadium_analysis.md**: The task-specific prompt that injects the CSV context, dynamic data, and the required JSON schema.
- **few_shot_examples.json**: Provides concrete examples of input/output pairs to guide the model's reasoning and ensure format compliance.

## Optimization Strategy
- **Strict JSON Enforcement**: The prompts explicitly forbid markdown fences, conversational text, and explanations outside the JSON payload to simplify parsing and reduce failure rates.
- **Modular Design**: Separating system instructions from the task allows us to iterate on the stadium logic without breaking the model's core behavior.
- **Few-Shot Prompting**: By providing examples, we drastically improve the model's reliability in conforming to the required schema.

## Expected Output Schema
The model is constrained to return a flat JSON structure designed to map easily into our frontend `AnalysisResult` schema:
```json
{
  "summary": "string",
  "riskLevel": "string",
  "confidence": "number",
  "recommendedGate": "string",
  "requiredVolunteers": "number",
  "reasoning": ["string"]
}
```
