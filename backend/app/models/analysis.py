from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, field_validator


class CongestionAlert(BaseModel):
    gateId: str
    severity: str  # low | medium | high | critical
    reasoning: str
    confidence: float = 0.9

    @field_validator("reasoning")
    @classmethod
    def reasoning_must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("reasoning field must not be empty in CongestionAlert")
        return v

    @field_validator("severity")
    @classmethod
    def severity_must_be_valid(cls, v: str) -> str:
        allowed = {"low", "medium", "high", "critical"}
        if v.lower() not in allowed:
            raise ValueError(f"severity must be one of {allowed}, got '{v}'")
        return v.lower()


class PredictedBottleneck(BaseModel):
    location: str
    etaMinutes: int
    confidence: float
    reasoning: str


class VolunteerSuggestion(BaseModel):
    volunteerId: str
    suggestedLocation: str
    reasoning: str
    confidence: float = 0.9


class GateRecommendation(BaseModel):
    fromGateId: str
    toGateId: str
    reasoning: str
    confidence: float = 0.9


class AnalysisResult(BaseModel):
    analysisId: str
    uploadId: str
    aiSummary: str
    riskLevel: str  # low | medium | high | critical
    congestionAlerts: List[CongestionAlert]
    predictedBottlenecks: List[PredictedBottleneck]
    volunteerSuggestions: List[VolunteerSuggestion]
    gateRecommendations: List[GateRecommendation]
    reasoning: List[str] = []       # top-level overall reasoning (required by AI.md)
    confidence: float = 0.9
    stale: bool = False             # True when returned by fallback rule engine
    createdAt: datetime
