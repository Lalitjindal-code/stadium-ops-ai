import React from "react";
import { Brain, AlertTriangle, AlertCircle, DoorOpen, Sparkles, Users, Activity, Shield } from "lucide-react";
import { ProgressBar } from "@/components/ui";

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
  
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "critical": return "text-[var(--risk-critical)]";
      case "high": return "text-[var(--risk-high)]";
      case "medium": return "text-[var(--risk-medium)]";
      default: return "text-[var(--risk-safe)]";
    }
  };

  const riskColor = getRiskColor(currentRisk);

  return (
    <div className="bg-[var(--bg-elevated)] p-5 rounded-xl border border-[var(--bg-border)] shadow-xs">
      <div className="flex justify-between items-center border-b border-[var(--bg-border)] pb-3.5 mb-5">
        <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Brain className="text-[var(--accent-400)]" size={20} />
          <span>AI Decision Center</span>
        </h2>
        <span className="bg-[var(--accent-500)]/10 text-[var(--accent-400)] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[var(--accent-500)]/20">Active Monitor</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--bg-border)] hover:bg-[var(--bg-elevated)] transition-colors">
          <p className="text-[var(--text-tertiary)] font-semibold uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
            <AlertTriangle size={14} /> Current Risk
          </p>
          <p className={`text-base font-bold ${riskColor}`}>{currentRisk}</p>
        </div>
        
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--bg-border)] hover:bg-[var(--bg-elevated)] transition-colors">
          <p className="text-[var(--text-tertiary)] font-semibold uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
            <AlertCircle size={14} /> Top Incident
          </p>
          <p className="text-base font-bold text-[var(--risk-critical-text)]">{topIncident}</p>
        </div>
        
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--bg-border)] hover:bg-[var(--bg-elevated)] transition-colors">
          <p className="text-[var(--text-tertiary)] font-semibold uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
            <DoorOpen size={14} /> Priority Gate
          </p>
          <p className="text-base font-bold text-[var(--primary-400)]">{priorityGate}</p>
        </div>
 
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--bg-border)] hover:bg-[var(--bg-elevated)] transition-colors relative overflow-hidden group">
          <div className="absolute inset-0 bg-[var(--accent-500)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <p className="text-[var(--text-tertiary)] font-semibold uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[var(--accent-400)]" /> AI Confidence
          </p>
          <div className="flex items-center gap-3">
            <p className="text-base font-bold text-[var(--accent-400)]">{Math.round(confidenceScore * 100)}%</p>
            <div className="flex-1 drop-shadow-[0_0_4px_rgba(34,211,238,0.2)]">
              <ProgressBar value={confidenceScore * 100} color="accent" className="h-1.5" />
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="font-bold text-[var(--text-secondary)] text-xs uppercase tracking-wider mt-6 mb-3">Resource Deployment Status</h3>
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs border-b border-[var(--bg-border)] pb-2">
          <span className="text-[var(--text-tertiary)] font-medium flex items-center gap-2">
            <Users size={14} /> Required Volunteers
          </span>
          <span className="font-bold text-[var(--text-secondary)] font-mono bg-[var(--bg-surface)] px-2.5 py-0.5 rounded-md border border-[var(--bg-border)]">{requiredVolunteers}</span>
        </div>
        <div className="flex justify-between items-center text-xs border-b border-[var(--bg-border)] pb-2">
          <span className="text-[var(--text-tertiary)] font-medium flex items-center gap-2">
            <Activity size={14} /> Medical Teams
          </span>
          <span className="font-bold text-[var(--text-secondary)] font-mono bg-[var(--bg-surface)] px-2.5 py-0.5 rounded-md border border-[var(--bg-border)]">{medicalTeams}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-[var(--text-tertiary)] font-medium flex items-center gap-2">
            <Shield size={14} /> Security Teams
          </span>
          <span className="font-bold text-[var(--text-secondary)] font-mono bg-[var(--bg-surface)] px-2.5 py-0.5 rounded-md border border-[var(--bg-border)]">{securityTeams}</span>
        </div>
      </div>
    </div>
  );
}
