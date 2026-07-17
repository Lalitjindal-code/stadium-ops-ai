"use client";

import React, { useState } from "react";
import MapLoader from "@/components/map/MapLoader";
import MapView from "@/components/map/MapView";
import Legend from "@/components/map/Legend";
import DecisionCenter from "@/components/map/DecisionCenter";
import AIActivityFeed from "@/components/map/AIActivityFeed";
import OrganizerNav from "@/components/OrganizerNav";
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
    <div className="h-screen flex bg-gray-100">
      <OrganizerNav />
      <div className="flex-1 flex flex-col pl-[220px] overflow-hidden">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center z-20 relative">
        <h1 className="text-2xl font-bold text-gray-800">Operations Control Center</h1>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar - AI Panels */}
        <div className="w-[400px] bg-gray-50 p-6 overflow-y-auto z-10 shadow-lg relative">
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
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 mt-6">
            <h2 className="font-bold mb-3 border-b pb-1">Map Layers</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={layers.gates} onChange={(e) => setLayers(l => ({...l, gates: e.target.checked}))} />
                Show Gates
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={layers.volunteers} onChange={(e) => setLayers(l => ({...l, volunteers: e.target.checked}))} />
                Show Staff & Volunteers
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={layers.incidents} onChange={(e) => setLayers(l => ({...l, incidents: e.target.checked}))} />
                Show Active Incidents
              </label>
            </div>
          </div>
        </div>

        {/* Right Side - Google Map */}
        <div className="flex-1 relative">
          <MapLoader>
            <MapView gates={gates} volunteers={volunteers} incidents={incidents} layers={layers} />
            <Legend />
          </MapLoader>
        </div>

      </div>
      </div>
    </div>
  );
}
