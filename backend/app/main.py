from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Stadium Operations Dashboard API",
    description=(
        "API for managing stadium operations, data ingestion, "
        "and AI recommendations."
    ),
    version="1.0.0",
)

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
async def health_check():
    """Liveness check for the API."""
    return {"status": "ok"}
