"use client";

import React, { useState } from "react";
import MapLoader from "@/components/map/MapLoader";
import MapView from "@/components/map/MapView";
import Legend from "@/components/map/Legend";
import DecisionCenter from "@/components/map/DecisionCenter";
import AIActivityFeed from "@/components/map/AIActivityFeed";
import { PageWrapper } from "@/components/layout";
import { Layers } from "lucide-react";
import gatesMock from "@/mock/gates.json";
import volunteersMock from "@/mock/volunteers.json";
import incidentsMock from "@/mock/incidents.json";
import { GateEntity, VolunteerEntity, IncidentEntity } from "@/types/map";

export default function MapDashboardPage() {
  const [gates] = useState<GateEntity[]>(gatesMock as GateEntity[]);
  const [volunteers] = useState<VolunteerEntity[]>(volunteersMock as VolunteerEntity[]);
  const [incidents] = useState<IncidentEntity[]>(incidentsMock as IncidentEntity[]);
  
  const [layers, setLayers] = useState({
    gates: true,
    volunteers: true,
    incidents: true,
  });

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

  return (
    <PageWrapper className="!p-0 h-full flex flex-col max-w-none bg-[var(--bg-base)]">
      <header className="bg-[var(--bg-surface)] border-b border-[var(--bg-border)] px-6 py-4 flex justify-between items-center z-20 relative shrink-0">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Operations Control Center</h1>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar - AI Panels */}
        <div className="w-[380px] bg-[var(--bg-base)] border-r border-[var(--bg-border)] p-6 overflow-y-auto z-10 custom-scrollbar flex flex-col gap-6 relative shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
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

          {/* Layer Controls */}
          <div className="bg-[var(--bg-elevated)] p-5 rounded-xl border border-[var(--bg-border)] shadow-xs">
            <h2 className="font-bold mb-4 border-b border-[var(--bg-border)] pb-3 flex items-center gap-2 text-[var(--text-primary)]">
              <Layers size={18} className="text-[var(--text-tertiary)]" />
              Map Layers
            </h2>
            <div className="space-y-3 text-sm text-[var(--text-secondary)]">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={layers.gates} onChange={(e) => setLayers(l => ({...l, gates: e.target.checked}))} className="peer appearance-none w-5 h-5 border-2 border-[var(--bg-border)] rounded-md bg-[var(--bg-surface)] checked:bg-[var(--primary-500)] checked:border-[var(--primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]/40 transition-colors cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="group-hover:text-[var(--text-primary)] transition-colors">Show Gates</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={layers.volunteers} onChange={(e) => setLayers(l => ({...l, volunteers: e.target.checked}))} className="peer appearance-none w-5 h-5 border-2 border-[var(--bg-border)] rounded-md bg-[var(--bg-surface)] checked:bg-[var(--primary-500)] checked:border-[var(--primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]/40 transition-colors cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="group-hover:text-[var(--text-primary)] transition-colors">Show Staff & Volunteers</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={layers.incidents} onChange={(e) => setLayers(l => ({...l, incidents: e.target.checked}))} className="peer appearance-none w-5 h-5 border-2 border-[var(--bg-border)] rounded-md bg-[var(--bg-surface)] checked:bg-[var(--primary-500)] checked:border-[var(--primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]/40 transition-colors cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="group-hover:text-[var(--text-primary)] transition-colors">Show Active Incidents</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side - Google Map */}
        <div className="flex-1 relative bg-[var(--bg-base)]">
          <MapLoader>
            <MapView gates={gates} volunteers={volunteers} incidents={incidents} layers={layers} />
            <Legend />
          </MapLoader>
        </div>

      </div>
    </PageWrapper>
  );
}
