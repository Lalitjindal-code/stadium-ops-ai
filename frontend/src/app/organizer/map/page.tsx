"use client";

import React, { useState, useEffect } from "react";
import MapLoader from "@/components/map/MapLoader";
import MapView from "@/components/map/MapView";
import Legend from "@/components/map/Legend";
import DecisionCenter from "@/components/map/DecisionCenter";
import AIActivityFeed from "@/components/map/AIActivityFeed";
import { PageWrapper } from "@/components/layout";
import { Badge } from "@/components/ui";
import { Layers, Clock, Activity, ShieldAlert, Sparkles } from "lucide-react";
import gatesMock from "@/mock/gates.json";
import volunteersMock from "@/mock/volunteers.json";
import incidentsMock from "@/mock/incidents.json";
import { GateEntity, VolunteerEntity, IncidentEntity } from "@/types/map";

export default function MapDashboardPage() {
  const [gates] = useState<GateEntity[]>(gatesMock as GateEntity[]);
  const [volunteers] = useState<VolunteerEntity[]>(volunteersMock as VolunteerEntity[]);
  const [incidents] = useState<IncidentEntity[]>(incidentsMock as IncidentEntity[]);
  const [currentTime, setCurrentTime] = useState<string>("");
  
  const [layers, setLayers] = useState({
    gates: true,
    volunteers: true,
    incidents: true,
  });

  useEffect(() => {
    // Avoid synchronous setState in effect per React guidelines
    setTimeout(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 0);
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamically generate timestamps for the feed
  const now = new Date();
  const getPastTime = (mins: number) => {
    const t = new Date(now.getTime() - mins * 60000);
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [feedEvents] = useState([
    { id: "1", time: getPastTime(2), message: "Scenario Simulation completed. Risk assessed as HIGH.", type: "warning" as const },
    { id: "2", time: getPastTime(5), message: "Heavy Rain detected.", type: "critical" as const },
    { id: "3", time: getPastTime(15), message: "Gate A changed to CRITICAL risk.", type: "critical" as const },
    { id: "4", time: getPastTime(20), message: "8 Volunteers assigned to Medical duties.", type: "success" as const }
  ]);

  // Derive Decision Center data from mock data
  const criticalGate = gates.find(g => g.riskLevel.toLowerCase() === "critical") || gates.find(g => g.riskLevel.toLowerCase() === "moderate") || gates[0];
  const currentRisk = criticalGate?.riskLevel || "Safe";
  const priorityGate = criticalGate?.name || "None";
  
  const highIncidents = incidents.filter(i => i.severity.toLowerCase() === "high");
  const topIncident = highIncidents.length > 0 ? highIncidents[0].incidentType : (incidents[0]?.incidentType || "None");
  
  const nonSafeGates = gates.filter(g => g.riskLevel.toLowerCase() !== "safe").length;
  const requiredVolunteers = nonSafeGates * 3;
  const medicalTeams = highIncidents.length;
  const securityTeams = highIncidents.length + 1;
  const AI_CONFIDENCE = 0.92;

  const getRiskVariant = (risk: string): "critical" | "high" | "safe" => {
    const r = risk.toLowerCase();
    if (r === 'critical') return 'critical';
    if (r === 'high' || r === 'moderate') return 'high';
    return 'safe';
  };

  return (
    <PageWrapper className="!p-0 h-full flex flex-col max-w-none bg-[var(--bg-base)]">
      {/* Enhanced Header */}
      <header className="bg-[var(--bg-surface)] border-b border-[var(--bg-border)] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-20 relative shrink-0">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Operations Control Center</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Activity size={14} className="animate-pulse text-[var(--risk-safe)]" />
            <Badge variant="safe" label="System Online" size="sm" />
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#00D4FF]" />
            <Badge variant="info" label="AI Active" size="sm" />
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldAlert size={14} className={getRiskVariant(currentRisk) === 'critical' ? 'text-[var(--risk-critical)]' : getRiskVariant(currentRisk) === 'high' ? 'text-[var(--risk-high)]' : 'text-[var(--risk-safe)]'} />
            <Badge variant={getRiskVariant(currentRisk)} label={`${currentRisk} Risk`} size="sm" />
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-base)] border border-[var(--bg-border)] px-3 py-1.5 rounded-lg text-sm font-mono text-[var(--text-secondary)] shadow-inner ml-2">
            <Clock size={14} className="text-[var(--text-tertiary)]" />
            {currentTime}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative flex-col lg:flex-row">
        
        {/* Left Sidebar - Independent Cards Layout */}
        <div className="w-full lg:w-[420px] shrink-0 bg-[var(--bg-base)] p-4 md:p-6 overflow-y-auto z-10 custom-scrollbar flex flex-col gap-6 relative border-r border-[var(--bg-border)]/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <DecisionCenter
            currentRisk={currentRisk}
            topIncident={topIncident}
            priorityGate={priorityGate}
            requiredVolunteers={requiredVolunteers}
            medicalTeams={medicalTeams}
            securityTeams={securityTeams}
            confidenceScore={AI_CONFIDENCE}
          />

          <AIActivityFeed events={feedEvents} />

          {/* Map Layers Card */}
          <div className="bg-[var(--bg-elevated)] p-6 rounded-2xl border border-[var(--bg-border)] shadow-sm flex flex-col">
            <h2 className="text-lg font-bold mb-4 border-b border-[var(--bg-border)] pb-3 flex items-center gap-2 text-[var(--text-primary)]">
              <Layers size={20} className="text-[var(--primary-400)]" />
              Map Layers
            </h2>
            <div className="space-y-4 text-sm text-[var(--text-secondary)]">
              <label className="flex items-center justify-between cursor-pointer group py-1">
                <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors font-medium">Show Gates</span>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" checked={layers.gates} onChange={(e) => setLayers(l => ({...l, gates: e.target.checked}))} className="sr-only peer" />
                  <div className="w-9 h-5 bg-[var(--bg-base)] border border-[var(--bg-border)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--primary-500)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-500)] peer-checked:border-[var(--primary-500)] shadow-inner"></div>
                </div>
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group py-1">
                <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors font-medium">Show Staff & Volunteers</span>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" checked={layers.volunteers} onChange={(e) => setLayers(l => ({...l, volunteers: e.target.checked}))} className="sr-only peer" />
                  <div className="w-9 h-5 bg-[var(--bg-base)] border border-[var(--bg-border)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--primary-500)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-500)] peer-checked:border-[var(--primary-500)] shadow-inner"></div>
                </div>
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group py-1">
                <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors font-medium">Show Active Incidents</span>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" checked={layers.incidents} onChange={(e) => setLayers(l => ({...l, incidents: e.target.checked}))} className="sr-only peer" />
                  <div className="w-9 h-5 bg-[var(--bg-base)] border border-[var(--bg-border)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--primary-500)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--primary-500)] peer-checked:border-[var(--primary-500)] shadow-inner"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side - Google Map */}
        <div className="flex-1 relative bg-[var(--bg-base)] min-h-[500px]">
          <MapLoader>
            <MapView gates={gates} volunteers={volunteers} incidents={incidents} layers={layers} />
            <Legend />
          </MapLoader>
        </div>

      </div>
    </PageWrapper>
  );
}
