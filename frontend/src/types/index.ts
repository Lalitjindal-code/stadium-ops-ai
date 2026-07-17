export interface CrowdDataRow {
  gateId: string;
  count: number;
  timestamp: string;
}

export interface CongestionAlert {
  gateId: string;
  severity: "low" | "medium" | "high" | "critical";
  reasoning: string;
  confidence?: number;
}

export interface PredictedBottleneck {
  location: string;
  etaMinutes: number;
  confidence: number;
  reasoning: string;
}

export interface VolunteerSuggestion {
  volunteerId: string;
  suggestedLocation: string;
  reasoning: string;
  confidence?: number;
}

export interface GateRecommendation {
  fromGateId: string;
  toGateId: string;
  reasoning: string;
  confidence?: number;
}

export interface AnalysisResult {
  analysisId: string;
  uploadId: string;
  aiSummary: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  congestionAlerts: CongestionAlert[];
  predictedBottlenecks: PredictedBottleneck[];
  volunteerSuggestions: VolunteerSuggestion[];
  gateRecommendations: GateRecommendation[];
  createdAt: string;
}

export interface ScenarioRecommendation {
  action: string;
  reason: string;
  evidence: string;
  confidence: number;
  reasonForConfidence: string;
}

export interface ScenarioTimeline {
  immediate: ScenarioRecommendation[];
  shortTerm: ScenarioRecommendation[];
  longTerm: ScenarioRecommendation[];
}

export interface ScenarioResult {
  scenario: string;
  riskLevel: string;
  confidence: number;
  summary: string;
  expectedImpact: string;
  estimatedDelay: string;
  affectedSpectators: number;
  requiredVolunteers: number;
  requiredMedicalTeams: number;
  requiredSecurityTeams: number;
  timeline: ScenarioTimeline;
  gateRecommendations: ScenarioRecommendation[];
  volunteerDeployment: ScenarioRecommendation[];
  communicationPlan: ScenarioRecommendation[];
  recoveryPlan: ScenarioRecommendation[];
  reasoning: string[];
  evidence: string[];
}

