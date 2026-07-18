from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.enums import IncidentStatus, RiskLevel


class IncidentReportPayload(BaseModel):
    location: str = Field(
        ..., min_length=2, description="Physical location of the incident"
    )
    description: str = Field(
        ..., min_length=5, description="Detailed description of the incident"
    )


class IncidentReport(BaseModel):
    """Stored Firestore document shape."""

    incidentId: str
    location: str
    description: str
    reportedBy: Optional[str] = None
    aiSummary: Optional[str] = None
    riskLevel: RiskLevel = RiskLevel.UNKNOWN
    status: IncidentStatus = IncidentStatus.OPEN
    createdAt: datetime
    updatedAt: Optional[datetime] = None


class IncidentReportResponse(BaseModel):
    """Response returned immediately after reporting."""

    success: bool
    incidentId: str
    message: str
    aiSummary: Optional[str] = None
    riskLevel: RiskLevel = RiskLevel.UNKNOWN
    status: IncidentStatus = IncidentStatus.OPEN
    createdAt: datetime


class IncidentUpdatePayload(BaseModel):
    status: IncidentStatus = Field(..., description="New status for the incident")
    notes: Optional[str] = None


class IncidentListResponse(BaseModel):
    incidents: list[IncidentReport]
    total: int
