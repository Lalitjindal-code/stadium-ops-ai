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
    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 mb-5">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span>🧠</span> AI Decision Center
        </h2>
        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active Monitor</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/60 hover:bg-slate-50 transition-colors">
          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Current Risk</p>
          <p className={`text-base font-bold ${riskColor}`}>{currentRisk}</p>
        </div>
        
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/60 hover:bg-slate-50 transition-colors">
          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Top Incident</p>
          <p className="text-base font-bold text-slate-800">{topIncident}</p>
        </div>
        
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/60 hover:bg-slate-50 transition-colors">
          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Priority Gate</p>
          <p className="text-base font-bold text-indigo-600">{priorityGate}</p>
        </div>
 
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/60 hover:bg-slate-50 transition-colors">
          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">AI Confidence</p>
          <p className="text-base font-bold text-emerald-600">{Math.round(confidenceScore * 100)}%</p>
        </div>
      </div>
      
      <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider mt-6 mb-3">Resource Deployment Status</h3>
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">👤 Required Volunteers</span>
          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{requiredVolunteers}</span>
        </div>
        <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">🚑 Medical Teams</span>
          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{medicalTeams}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">🛡️ Security Teams</span>
          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{securityTeams}</span>
        </div>
      </div>
    </div>
  );
}
