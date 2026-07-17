export interface MapEntity {
  id: string;
  type: string;
  latitude: number;
  longitude: number;
  status: string;
}

export interface GateEntity extends MapEntity {
  type: "Gate";
  name: string;
  capacity: number;
  currentCrowd: number;
  riskLevel: "Safe" | "Moderate" | "Critical";
  aiRecommendation: string;
}

export interface VolunteerEntity extends MapEntity {
  type: "Volunteer" | "Medical" | "Security" | "Traffic";
  name: string;
}

export interface IncidentEntity extends MapEntity {
  type: "Incident";
  incidentType: string;
  description: string;
  severity: "High" | "Medium" | "Low";
}
