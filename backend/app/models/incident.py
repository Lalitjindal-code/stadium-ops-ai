from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class IncidentReportPayload(BaseModel):
    location: str = Field(..., min_length=2, description="Physical location of the incident")
    description: str = Field(..., min_length=5, description="Detailed description of the incident")


class IncidentReport(BaseModel):
    """Stored Firestore document shape."""
    incidentId: str
    location: str
    description: str
    reportedBy: Optional[str] = None
    aiSummary: Optional[str] = None
    riskLevel: str = "unknown"           # low | medium | high | critical | unknown
    status: str = "open"                  # open | in_progress | resolved | closed
    createdAt: datetime
    updatedAt: Optional[datetime] = None


class IncidentReportResponse(BaseModel):
    """Response returned immediately after reporting."""
    success: bool
    incidentId: str
    message: str
    aiSummary: Optional[str] = None
    riskLevel: str = "unknown"
    status: str = "open"
    createdAt: datetime


class IncidentUpdatePayload(BaseModel):
    status: str = Field(..., description="New status: open | in_progress | resolved | closed")
    notes: Optional[str] = None


class IncidentListResponse(BaseModel):
    incidents: list[IncidentReport]
    total: int
