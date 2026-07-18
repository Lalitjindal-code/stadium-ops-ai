import os

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.core.auth import require_organizer, require_volunteer
from app.core.firebase import init_firebase
from app.routers import analysis, scenario, assignments, incidents, volunteers, realtime

# Initialize Firebase Admin SDK
init_firebase()

# ── Rate Limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

app = FastAPI(
    title="Stadium Operations Dashboard API",
    description=(
        "API for managing FIFA World Cup 2026 stadium operations, "
        "real-time crowd flow analysis, and AI-powered incident response."
    ),
    version="1.1.0",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
)

# ── Attach rate limiter ───────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS — must be before routers ─────────────────────────────────────────────
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allow_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(scenario.router, prefix="/api/v1")
app.include_router(assignments.router, prefix="/api/v1")
app.include_router(incidents.router, prefix="/api/v1")
app.include_router(volunteers.router, prefix="/api/v1")
app.include_router(realtime.router, prefix="/api/v1")


# ── Core Endpoints ────────────────────────────────────────────────────────────
@app.get("/api/v1/health", tags=["health"])
async def health_check():
    """Liveness check for the API."""
    return {
        "status": "ok",
        "version": app.version,
        "service": "stadium-ops-ai-backend",
    }


@app.get("/api/v1/test/organizer", dependencies=[Depends(require_organizer)], tags=["test"])
async def test_organizer():
    return {"message": "You have organizer access"}


@app.get("/api/v1/test/volunteer", dependencies=[Depends(require_volunteer)], tags=["test"])
async def test_volunteer():
    return {"message": "You have volunteer access"}


# ── AI-specific rate-limited endpoint (10 calls/min per IP on /analysis/csv) ─
# These decorators are applied to router endpoints via the `limiter` on app.state.
# Individual endpoint-level limits can be set with @limiter.limit("10/minute")
# directly on the router functions if needed.


# ── Global exception handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "internal_error", "detail": str(exc)},
    )
