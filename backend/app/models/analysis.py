from datetime import datetime
from typing import List

from pydantic import BaseModel


class CongestionAlert(BaseModel):
    gateId: str
    severity: str
    reasoning: str


class PredictedBottleneck(BaseModel):
    location: str
    etaMinutes: int
    confidence: float
    reasoning: str


class VolunteerSuggestion(BaseModel):
    volunteerId: str
    suggestedLocation: str
    reasoning: str


class GateRecommendation(BaseModel):
    fromGateId: str
    toGateId: str
    reasoning: str


class AnalysisResult(BaseModel):
    analysisId: str
    uploadId: str
    aiSummary: str
    congestionAlerts: List[CongestionAlert]
    predictedBottlenecks: List[PredictedBottleneck]
    volunteerSuggestions: List[VolunteerSuggestion]
    gateRecommendations: List[GateRecommendation]
    riskLevel: str
    createdAt: datetime
