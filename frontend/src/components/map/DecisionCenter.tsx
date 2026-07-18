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
    <div className="bg-[var(--bg-elevated)] p-8 rounded-2xl border border-[var(--bg-border)] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col gap-6">
      <div className="relative flex justify-between items-center border-b border-[var(--bg-border)] pb-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
          <Brain className="text-[var(--primary-500)]" size={24} />
          <span>AI Decision Center</span>
        </h2>
        <span className="bg-[var(--primary-500)]/10 text-[var(--primary-400)] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[var(--primary-500)]/20 shadow-sm animate-pulse">Active Monitor</span>
      </div>
      
      {/* Hero Metric: Current Risk */}
      <div className={`p-6 rounded-2xl ${['critical', 'high'].includes(currentRisk.toLowerCase()) ? 'border border-[var(--risk-critical)] bg-[var(--risk-critical)]/5' : 'bg-[var(--bg-surface)]'} transition-colors shadow-sm`}>
        <p className="text-[var(--text-tertiary)] font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className={['critical', 'high'].includes(currentRisk.toLowerCase()) ? 'text-[var(--risk-critical)]' : ''} /> Current Risk Level
        </p>
        <p className={`text-4xl font-black ${riskColor}`}>{currentRisk}</p>
      </div>
      
      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl flex flex-col justify-between hover:-translate-y-0.5 transition-transform cursor-default">
          <p className="text-[var(--text-tertiary)] font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-2">
            <AlertCircle size={14} /> Top Incident
          </p>
          <p className="text-lg font-bold text-[var(--text-primary)] truncate">{topIncident}</p>
        </div>
        
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl flex flex-col justify-between hover:-translate-y-0.5 transition-transform cursor-default">
          <p className="text-[var(--text-tertiary)] font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-2">
            <DoorOpen size={14} /> Priority Gate
          </p>
          <p className="text-lg font-bold text-[var(--primary-400)] truncate">{priorityGate}</p>
        </div>
 
        <div className="bg-[var(--bg-surface)] p-4 rounded-xl flex flex-col justify-between hover:-translate-y-0.5 transition-transform cursor-default relative overflow-hidden">
          <p className="text-[var(--text-tertiary)] font-bold uppercase tracking-wider text-[10px] mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-[var(--accent-400)]" /> AI Confidence
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-[var(--accent-400)] opacity-20 blur-[8px] rounded-full"></div>
              <ProgressBar value={confidenceScore * 100} color="accent" className="h-2.5 rounded-full relative z-10" />
            </div>
            <p className="text-base font-bold text-[var(--accent-400)]">{Math.round(confidenceScore * 100)}%</p>
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <h3 className="font-bold text-[var(--text-primary)] text-sm mb-4">Resource Deployment</h3>
        <div className="flex flex-col rounded-2xl overflow-hidden bg-[var(--bg-surface)]">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--bg-border)]/50 hover:bg-[var(--bg-elevated)] transition-colors cursor-default">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-500)]/10 flex items-center justify-center shrink-0">
                <Users size={20} className="text-[var(--primary-400)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[var(--text-primary)] font-bold text-sm">Volunteers</span>
                <span className="text-[var(--text-tertiary)] text-xs mt-0.5">Crowd control & assistance</span>
              </div>
            </div>
            <span className="font-bold text-[var(--text-primary)] font-mono text-base bg-[var(--bg-base)] px-3 py-1.5 rounded-lg">{String(requiredVolunteers).padStart(2, '0')}</span>
          </div>
          
          <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--bg-border)]/50 hover:bg-[var(--bg-elevated)] transition-colors cursor-default">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-400)]/10 flex items-center justify-center shrink-0">
                <Activity size={20} className="text-[var(--accent-400)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[var(--text-primary)] font-bold text-sm">Medical Teams</span>
                <span className="text-[var(--text-tertiary)] text-xs mt-0.5">First aid & emergencies</span>
              </div>
            </div>
            <span className="font-bold text-[var(--text-primary)] font-mono text-base bg-[var(--bg-base)] px-3 py-1.5 rounded-lg">{String(medicalTeams).padStart(2, '0')}</span>
          </div>
          
          <div className="flex justify-between items-center px-5 py-4 hover:bg-[var(--bg-elevated)] transition-colors cursor-default">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--risk-medium)]/10 flex items-center justify-center shrink-0">
                <Shield size={20} className="text-[var(--risk-medium)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[var(--text-primary)] font-bold text-sm">Security Teams</span>
                <span className="text-[var(--text-tertiary)] text-xs mt-0.5">Access & safety monitoring</span>
              </div>
            </div>
            <span className="font-bold text-[var(--text-primary)] font-mono text-base bg-[var(--bg-base)] px-3 py-1.5 rounded-lg">{String(securityTeams).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
