import json
import logging
import os
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from google import genai
from google.genai import types

from app.config.ai_config import ai_config
from app.models.data import CrowdDataPayload
from app.services.json_utils import repair_and_parse_json

logger = logging.getLogger("gemini_service")

# Configure Gemini client (new SDK)
_client = genai.Client(api_key=ai_config.GEMINI_API_KEY)


# ── Helpers ──────────────────────────────────────────────────────────────────

def load_prompt(filename: str) -> str:
    filepath = os.path.join(os.path.dirname(__file__), "..", "..", "prompts", "v1", filename)
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()


def _compute_match_phase() -> str:
    """
    Dynamically compute the current match phase based on MATCH_START_UTC config.
    Phases:
      - Pre-Match:    T-120 → T-0
      - Match Live:   T+0   → T+95 (full-time)
      - Post-Match:   T+95  → T+180
    Returns a human-readable phase string for the prompt.
    """
    if not ai_config.MATCH_START_UTC:
        return "Match Day Operations (phase unknown — set MATCH_START_UTC in .env to enable)"

    try:
        kickoff = datetime.fromisoformat(ai_config.MATCH_START_UTC.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        delta = now - kickoff
        minutes = delta.total_seconds() / 60

        if minutes < -120:
            return f"Pre-Match Preparation (T{int(minutes):+d} min)"
        elif minutes < -30:
            return f"Pre-Match Early Entry (T{int(minutes):+d} min)"
        elif minutes < 0:
            return f"Pre-Match Peak Entry (T{int(minutes):+d} min)"
        elif minutes < 45:
            return f"Match Live — First Half (T+{int(minutes)} min)"
        elif minutes < 60:
            return "Match Live — Half Time"
        elif minutes < 95:
            return f"Match Live — Second Half (T+{int(minutes)} min)"
        elif minutes < 180:
            return f"Post-Match Dispersal (T+{int(minutes)} min)"
        else:
            return "Post-Event (stadium clearing)"
    except Exception as e:
        logger.warning(f"Failed to compute match phase from MATCH_START_UTC: {e}")
        return "Match Day Operations"


def _get_generation_config() -> types.GenerateContentConfig:
    return types.GenerateContentConfig(
        temperature=ai_config.TEMPERATURE,
        top_p=ai_config.TOP_P,
        top_k=ai_config.TOP_K,
        max_output_tokens=ai_config.MAX_OUTPUT_TOKENS,
        response_mime_type="application/json",
    )


# ── Core Gemini caller ────────────────────────────────────────────────────────

def get_raw_gemini_response(
    task_prompt: str,
    few_shot_filename: Optional[str] = None,
    system_prompt_override: Optional[str] = None,
) -> Dict[str, Any]:
    system_prompt = system_prompt_override or load_prompt("system_prompt.md")

    contents = []

    # Load few-shot examples if provided
    if few_shot_filename:
        try:
            few_shot = load_prompt(few_shot_filename)
            examples = json.loads(few_shot)
            for ex in examples:
                contents.append(types.Content(role="user", parts=[types.Part(text=ex["input"])]))
                contents.append(types.Content(role="model", parts=[types.Part(text=json.dumps(ex["output"]))]))
        except Exception as ex:
            logger.warning(f"Could not load few-shot examples '{few_shot_filename}': {ex}")

    contents.append(types.Content(role="user", parts=[types.Part(text=task_prompt)]))

    response = _client.models.generate_content(
        model=ai_config.MODEL_NAME,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=ai_config.TEMPERATURE,
            top_p=ai_config.TOP_P,
            top_k=ai_config.TOP_K,
            max_output_tokens=ai_config.MAX_OUTPUT_TOKENS,
            response_mime_type="application/json",
            http_options=types.HttpOptions(timeout=ai_config.TIMEOUT_SECONDS * 1000),
        ),
    )
    return repair_and_parse_json(response.text)


# ── Crowd Analysis ────────────────────────────────────────────────────────────

def get_gemini_analysis(payload: CrowdDataPayload) -> Dict[str, Any]:
    """
    Calls Gemini to analyse the crowd data payload.
    Uses dynamic match phase and injects gate count as context.
    """
    template = load_prompt("stadium_analysis.md")
    data_json = payload.model_dump_json()
    match_phase = _compute_match_phase()
    now_iso = datetime.now(timezone.utc).isoformat()

    task_prompt = (
        template
        .replace("{DATA}", data_json)
        .replace("{TIMESTAMP}", now_iso)
        .replace("{MATCH_PHASE}", match_phase)
        .replace("{GATE_COUNT}", str(len(payload.rows)))
    )

    result = get_raw_gemini_response(task_prompt, "few_shot_examples.json")
    logger.info(f"Gemini crowd analysis done. Phase: {match_phase}, Gates: {len(payload.rows)}")
    return result


# ── Incident Summarization ────────────────────────────────────────────────────

def get_incident_ai_summary(location: str, description: str) -> Dict[str, Any]:
    """
    Call Gemini to triage an incident report.
    Returns: {"aiSummary": str, "riskLevel": str, "reasoning": str}
    """
    try:
        template = load_prompt("incident_summary.md")
        task_prompt = (
            template
            .replace("{LOCATION}", location)
            .replace("{DESCRIPTION}", description)
            .replace("{TIMESTAMP}", datetime.now(timezone.utc).isoformat())
        )
        result = get_raw_gemini_response(task_prompt)
        logger.info(f"Incident AI summary generated. Risk: {result.get('riskLevel')}")
        return result
    except Exception as e:
        logger.error(f"Incident AI summarization failed: {e}")
        raise
