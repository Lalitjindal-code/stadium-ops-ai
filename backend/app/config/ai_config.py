from pydantic_settings import BaseSettings, SettingsConfigDict


class AIConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # ── Gemini ────────────────────────────────────────────────────────────────
    GEMINI_API_KEY: str = ""
    MODEL_NAME: str = "gemini-2.0-flash"
    TEMPERATURE: float = 0.2
    TOP_P: float = 0.8
    TOP_K: int = 40
    MAX_OUTPUT_TOKENS: int = 4096      # Raised from 2048 — prevents truncation in complex scenarios
    TIMEOUT_SECONDS: int = 30
    RETRY_COUNT: int = 1

    # ── Match schedule ────────────────────────────────────────────────────────
    # ISO-8601 UTC datetime of match kick-off, used to compute dynamic match phase.
    # Example: "2026-06-11T20:00:00Z"
    # Leave blank to default to "Match Day Operations".
    MATCH_START_UTC: str = ""

    # ── CORS ─────────────────────────────────────────────────────────────────
    # Comma-separated list of allowed origins.
    ALLOWED_ORIGINS: str = "http://localhost:3000"


ai_config = AIConfig()
