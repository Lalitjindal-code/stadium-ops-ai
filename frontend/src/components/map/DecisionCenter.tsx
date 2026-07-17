import React from "react";

interface Props {
  currentRisk: string;
  topIncident: string;
  priorityGate: string;
  requiredVolunteers: number;
  medicalTeams: number;
  securityTeams: number;
  confidenceScore: number;
}

export default function DecisionCenter({
  currentRisk,
  topIncident,
  priorityGate,
  requiredVolunteers,
  medicalTeams,
  securityTeams,
  confidenceScore
}: Props) {
  
  const riskColor = currentRisk === "Critical" ? "text-red-600" : currentRisk === "High" ? "text-orange-600" : "text-green-600";

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">AI Decision Center</h2>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded border">
          <p className="text-gray-500 text-xs uppercase tracking-wider">Current Risk</p>
          <p className={`text-lg font-bold ${riskColor}`}>{currentRisk}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded border">
          <p className="text-gray-500 text-xs uppercase tracking-wider">Top Incident</p>
          <p className="text-lg font-bold text-gray-800">{topIncident}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded border">
          <p className="text-gray-500 text-xs uppercase tracking-wider">Priority Gate</p>
          <p className="text-lg font-bold text-indigo-700">{priorityGate}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded border">
          <p className="text-gray-500 text-xs uppercase tracking-wider">AI Confidence</p>
          <p className="text-lg font-bold text-blue-600">{Math.round(confidenceScore * 100)}%</p>
        </div>
      </div>
      
      <h3 className="font-bold text-gray-700 mt-6 mb-2">Resource Needs</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex justify-between border-b pb-1"><span>Volunteers</span> <span className="font-bold">{requiredVolunteers}</span></li>
        <li className="flex justify-between border-b pb-1"><span>Medical Teams</span> <span className="font-bold">{medicalTeams}</span></li>
        <li className="flex justify-between"><span>Security Teams</span> <span className="font-bold">{securityTeams}</span></li>
      </ul>
    </div>
  );
}
