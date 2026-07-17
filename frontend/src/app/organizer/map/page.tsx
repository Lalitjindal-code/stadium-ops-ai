"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MapLoader from "@/components/map/MapLoader";
import MapView from "@/components/map/MapView";
import Legend from "@/components/map/Legend";
import DecisionCenter from "@/components/map/DecisionCenter";
import AIActivityFeed from "@/components/map/AIActivityFeed";
import gatesMock from "@/mock/gates.json";
import volunteersMock from "@/mock/volunteers.json";
import incidentsMock from "@/mock/incidents.json";
import { GateEntity, VolunteerEntity, IncidentEntity } from "@/types/map";

export default function MapDashboardPage() {
  const router = useRouter();
  const [gates, setGates] = useState<GateEntity[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerEntity[]>([]);
  const [incidents, setIncidents] = useState<IncidentEntity[]>([]);
  
  const [layers, setLayers] = useState({
    gates: true,
    volunteers: true,
    incidents: true,
  });

  const [feedEvents] = useState([
    { id: "1", time: "10:45 AM", message: "Scenario Simulation completed. Risk assessed as HIGH.", type: "warning" as const },
    { id: "2", time: "10:42 AM", message: "Heavy Rain detected.", type: "critical" as const },
    { id: "3", time: "10:30 AM", message: "Gate A changed to CRITICAL risk.", type: "critical" as const },
    { id: "4", time: "10:25 AM", message: "8 Volunteers assigned to Medical duties.", type: "success" as const }
  ]);

  useEffect(() => {
    // Load mock data
    setGates(gatesMock as GateEntity[]);
    setVolunteers(volunteersMock as VolunteerEntity[]);
    setIncidents(incidentsMock as IncidentEntity[]);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center z-20 relative">
        <h1 className="text-2xl font-bold text-gray-800">Operations Control Center</h1>
        <div className="flex gap-4">
          <button onClick={() => router.push("/organizer")} className="text-blue-600 hover:underline">Dashboard</button>
          <button onClick={() => router.push("/organizer/scenario")} className="text-blue-600 hover:underline">Scenarios</button>
          <button onClick={() => router.push("/organizer/assignments")} className="text-blue-600 hover:underline">Assignments</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar - AI Panels */}
        <div className="w-[400px] bg-gray-50 p-6 overflow-y-auto z-10 shadow-lg relative">
          <DecisionCenter
            currentRisk="Critical"
            topIncident="Heavy Rain"
            priorityGate="Gate A (North)"
            requiredVolunteers={12}
            medicalTeams={3}
            securityTeams={4}
            confidenceScore={0.92}
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
  );
}
