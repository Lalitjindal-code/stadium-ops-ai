import os
from pydantic_settings import BaseSettings

class AIConfig(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    MODEL_NAME: str = "gemini-1.5-flash"
    TEMPERATURE: float = 0.2
    TOP_P: float = 0.8
    TOP_K: int = 40
    MAX_OUTPUT_TOKENS: int = 2048
    TIMEOUT_SECONDS: int = 30
    RETRY_COUNT: int = 1

    class Config:
        env_file = ".env"

ai_config = AIConfig()
