import json
import re
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

def repair_and_parse_json(raw_text: str) -> Dict[str, Any]:
    """
    Lightweight JSON repair step.
    Removes markdown code fences and extraneous text before parsing.
    """
    text = raw_text.strip()
    
    # Remove markdown code blocks if present
    # Match ```json ... ``` or just ``` ... ```
    match = re.search(r"```(?:json)?(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if match:
        text = match.group(1).strip()
    else:
        try:
            start_idx = text.index('{')
            end_idx = text.rindex('}')
            text = text[start_idx:end_idx+1]
        except ValueError:
            pass
    
    # Try parsing
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON. Raw text: {raw_text}")
        raise e
