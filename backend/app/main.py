from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.auth import require_organizer, require_volunteer
from app.core.firebase import init_firebase
from app.routers import analysis

# Initialize Firebase Admin SDK
init_firebase()

app = FastAPI(
    title="Stadium Operations Dashboard API",
    description=(
        "API for managing stadium operations, data ingestion, "
        "and AI recommendations."
    ),
    version="1.0.0",
)

app.include_router(analysis.router, prefix="/api/v1")


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


@app.get("/api/v1/test/organizer", dependencies=[Depends(require_organizer)])
async def test_organizer():
    return {"message": "You have organizer access"}


@app.get("/api/v1/test/volunteer", dependencies=[Depends(require_volunteer)])
async def test_volunteer():
    return {"message": "You have volunteer access"}
