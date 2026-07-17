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
