import React from "react";
import { Layers, AlertTriangle, Shield, Activity, Users, Car } from "lucide-react";

export default function Legend() {
  return (
    <div className="absolute bottom-6 right-6 bg-[var(--bg-base)]/40 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[var(--bg-border)]/50 z-10 w-[180px] text-[var(--text-secondary)]">
      <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3 pb-2 border-b border-[var(--bg-border)]/50 flex items-center gap-1.5 text-[var(--text-primary)]">
        <Layers size={12} className="text-[var(--text-tertiary)]" />
        Map Legend
      </h3>
      
      <div className="space-y-4 text-[10px] font-medium">
        
        {/* Gates Group */}
        <div>
          <span className="text-[8px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold mb-1.5 block">Gates</span>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--risk-safe)] shadow-[0_0_4px_var(--risk-safe)]"></div> 
              <span>Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--risk-high)] shadow-[0_0_4px_var(--risk-high)]"></div> 
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--risk-critical)] shadow-[0_0_4px_var(--risk-critical)] animate-pulse"></div> 
              <span className="text-[var(--text-primary)] font-semibold">Critical</span>
            </div>
          </div>
        </div>

        {/* Resources Group */}
        <div>
          <span className="text-[8px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold mb-1.5 block">Resources</span>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Users size={10} className="text-[var(--primary-400)]" /> 
              <span>Volunteer</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={10} className="text-pink-400" /> 
              <span>Medical Unit</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={10} className="text-purple-400" /> 
              <span>Security Unit</span>
            </div>
            <div className="flex items-center gap-2">
              <Car size={10} className="text-orange-400" /> 
              <span>Traffic Unit</span>
            </div>
          </div>
        </div>
        
        {/* Incidents Group */}
        <div>
          <span className="text-[8px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold mb-1.5 block">Incidents</span>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[var(--risk-critical-text)] font-bold">
              <AlertTriangle size={10} className="text-[var(--risk-critical)]" /> 
              <span>Active Incident</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
