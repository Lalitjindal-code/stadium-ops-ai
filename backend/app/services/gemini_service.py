import os
import json
import google.generativeai as genai
from typing import Dict, Any
from app.config.ai_config import ai_config
from app.models.data import CrowdDataPayload
from app.services.json_utils import repair_and_parse_json

# Configure Gemini
genai.configure(api_key=ai_config.GEMINI_API_KEY)

def load_prompt(filename: str) -> str:
    filepath = os.path.join(os.path.dirname(__file__), "..", "..", "prompts", "v1", filename)
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read()

def get_gemini_analysis(payload: CrowdDataPayload) -> Dict[str, Any]:
    """
    Calls the Gemini API to analyze the crowd data payload.
    Returns the repaired and parsed JSON dictionary.
    """
    # Load prompts
    system_prompt = load_prompt("system_prompt.md")
    task_prompt_template = load_prompt("stadium_analysis.md")
    
    try:
        few_shot = load_prompt("few_shot_examples.json")
    except Exception:
        few_shot = "[]"
    
    # Prepare data
    data_json = payload.model_dump_json()
    
    # Construct final prompt
    task_prompt = task_prompt_template.replace("{DATA}", data_json)
    
    # Initialize Model
    model = genai.GenerativeModel(
        model_name=ai_config.MODEL_NAME,
        system_instruction=system_prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=ai_config.TEMPERATURE,
            top_p=ai_config.TOP_P,
            top_k=ai_config.TOP_K,
            max_output_tokens=ai_config.MAX_OUTPUT_TOKENS,
            response_mime_type="application/json"
        )
    )
    
    # Create conversation history with few-shot examples
    messages = []
    examples = json.loads(few_shot)
    for ex in examples:
        messages.append({"role": "user", "parts": [ex["input"]]})
        messages.append({"role": "model", "parts": [json.dumps(ex["output"])]})
    
    messages.append({"role": "user", "parts": [task_prompt]})
    
    # Call Gemini
    response = model.generate_content(
        messages,
        request_options={"timeout": ai_config.TIMEOUT_SECONDS}
    )
    
    # Parse and repair
    return repair_and_parse_json(response.text)
