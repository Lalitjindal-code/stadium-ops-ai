"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";
import { ScenarioResult, ScenarioRecommendation } from "@/types";
import OrganizerNav from "@/components/OrganizerNav";

const SCENARIO_OPTIONS = [
  "Heavy Rain",
  "Medical Emergency",
  "Fire Alert",
  "Gate Closure",
  "Parking Overflow",
  "VIP Arrival",
  "Public Transport Delay",
  "Power Failure",
  "Network Failure",
  "Sudden Crowd Surge",
  "Equipment Failure",
  "Security Incident"
];

export default function ScenarioSimulationPage() {
  const router = useRouter();
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [severity, setSeverity] = useState<string>("Medium");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const handleLogout = async () => {
    await auth.signOut();
    Cookies.remove("auth_token");
    Cookies.remove("user_role");
    router.push("/login");
  };

  const toggleScenario = (s: string) => {
    setSelectedScenarios(prev => 
      prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]
    );
  };

  const runSimulation = async () => {
    if (selectedScenarios.length === 0) {
      setError("Please select at least one scenario.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/scenario/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          scenarios: selectedScenarios,
          severity,
          notes
        })
      });

      if (!res.ok) throw new Error("Simulation failed");
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderRec = (r: ScenarioRecommendation, idx: number) => (
    <div key={idx} className="mb-4 border-b pb-2 text-sm">
      <p className="font-semibold text-blue-700">{r.action}</p>
      <p><span className="font-medium text-gray-700">Reason:</span> {r.reason}</p>
      <p><span className="font-medium text-gray-700">Evidence:</span> {r.evidence}</p>
      <p><span className="font-medium text-gray-700">Confidence:</span> {(r.confidence * 100).toFixed(0)}% - {r.reasonForConfidence}</p>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OrganizerNav />
      <div className="flex-1 flex flex-col p-8 pl-[220px]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Scenario Simulation</h1>
        <div className="flex gap-4">
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow">Logout</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border mb-8">
        <h2 className="text-xl font-semibold mb-4">Configure Incident Context</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {SCENARIO_OPTIONS.map(s => (
            <label key={s} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-blue-50">
              <input type="checkbox" checked={selectedScenarios.includes(s)} onChange={() => toggleScenario(s)} className="rounded" />
              <span className="text-sm">{s}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Severity</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full border p-2 rounded">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          <div className="flex-[2]">
            <label className="block text-sm font-medium mb-1">Organizer Notes (Optional)</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Gate 4 scanner is broken" className="w-full border p-2 rounded" />
          </div>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button onClick={runSimulation} disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 w-full disabled:opacity-50">
          {loading ? "Simulating Strategy..." : "Run AI Simulation"}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border md:col-span-2">
             <h2 className="text-2xl font-bold mb-2">{result.scenario} ({result.riskLevel.toUpperCase()})</h2>
             <p className="text-gray-700 mb-4">{result.summary}</p>
             <div className="flex gap-6 text-sm text-gray-600">
               <p><strong>Delay:</strong> {result.estimatedDelay}</p>
               <p><strong>Affected:</strong> {result.affectedSpectators}</p>
               <p><strong>Vols Needed:</strong> {result.requiredVolunteers}</p>
               <p><strong>Medical/Security:</strong> {result.requiredMedicalTeams} / {result.requiredSecurityTeams}</p>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Immediate Actions (0-5 min)</h3>
            {result.timeline.immediate.map(renderRec)}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">Short Term Actions (5-15 min)</h3>
            {result.timeline.shortTerm.map(renderRec)}
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Volunteer & Gate Strategy</h3>
            {result.gateRecommendations.map(renderRec)}
            {result.volunteerDeployment.map(renderRec)}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Comms & Recovery</h3>
            {result.communicationPlan.map(renderRec)}
            {result.recoveryPlan.map(renderRec)}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
