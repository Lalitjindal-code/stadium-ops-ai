from typing import List

from pydantic import BaseModel


class ScenarioPayload(BaseModel):
    scenarios: List[str]
    severity: str
    notes: str = ""


class ScenarioRecommendation(BaseModel):
    action: str
    reason: str
    evidence: str
    confidence: float
    reasonForConfidence: str


class ScenarioTimeline(BaseModel):
    immediate: List[ScenarioRecommendation]
    shortTerm: List[ScenarioRecommendation]
    longTerm: List[ScenarioRecommendation]


class ScenarioResult(BaseModel):
    scenario: str
    riskLevel: str
    confidence: float
    summary: str
    expectedImpact: str
    estimatedDelay: str
    affectedSpectators: int
    requiredVolunteers: int
    requiredMedicalTeams: int
    requiredSecurityTeams: int
    timeline: ScenarioTimeline
    gateRecommendations: List[ScenarioRecommendation]
    volunteerDeployment: List[ScenarioRecommendation]
    communicationPlan: List[ScenarioRecommendation]
    recoveryPlan: List[ScenarioRecommendation]
    reasoning: List[str]
    evidence: List[str]
