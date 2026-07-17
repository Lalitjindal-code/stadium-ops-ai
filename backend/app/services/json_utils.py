import json
import re
from typing import Dict, Any

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
    
    # Try parsing
    return json.loads(text)
