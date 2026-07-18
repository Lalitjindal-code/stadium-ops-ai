from typing import List, Optional

from pydantic import BaseModel


class Volunteer(BaseModel):
    volunteerId: str
    name: str
    currentZone: str
    skills: List[str]
    status: str
    workload: int

class VolunteerAssignmentRequest(BaseModel):
    scenario: str
    crowdAnalysisSummary: str
    scenarioResultSummary: str
    notes: Optional[str] = ""
    stadiumStatus: str

class Assignment(BaseModel):
    volunteerId: str
    name: str
    task: str
    priority: str
    eta: str
    estimatedDuration: str
    assignmentScore: int
    reason: str
    evidence: List[str]

class ResourceSummary(BaseModel):
    volunteersAssigned: int
    medicalTeams: int
    securityTeams: int
    trafficTeams: int

class VolunteerAssignmentResult(BaseModel):
    summary: str
    assignments: List[Assignment]
    resourceSummary: ResourceSummary
    reasoning: List[str]
