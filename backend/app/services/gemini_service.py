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

def get_raw_gemini_response(task_prompt: str, few_shot_filename: str = None) -> Dict[str, Any]:
    system_prompt = load_prompt("system_prompt.md")
    
    messages = []
    if few_shot_filename:
        try:
            few_shot = load_prompt(few_shot_filename)
            examples = json.loads(few_shot)
            for ex in examples:
                messages.append({"role": "user", "parts": [ex["input"]]})
                messages.append({"role": "model", "parts": [json.dumps(ex["output"])]})
        except Exception:
            pass

    messages.append({"role": "user", "parts": [task_prompt]})

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
    
    response = model.generate_content(messages, request_options={"timeout": ai_config.TIMEOUT_SECONDS})
    return repair_and_parse_json(response.text)

def get_gemini_analysis(payload: CrowdDataPayload) -> Dict[str, Any]:
    """
    Calls the Gemini API to analyze the crowd data payload.
    """
    task_prompt_template = load_prompt("stadium_analysis.md")
    data_json = payload.model_dump_json()
    task_prompt = task_prompt_template.replace("{DATA}", data_json)
    
    return get_raw_gemini_response(task_prompt, "few_shot_examples.json")
