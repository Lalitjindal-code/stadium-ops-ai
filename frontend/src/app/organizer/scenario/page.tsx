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

      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 mb-8">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">Configure Incident Context</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {SCENARIO_OPTIONS.map(s => {
            const isChecked = selectedScenarios.includes(s);
            return (
              <label key={s} className={`flex items-center space-x-2.5 p-3.5 border rounded-xl cursor-pointer select-none transition-all duration-200 ${
                isChecked 
                  ? "border-indigo-500 bg-indigo-50/20 text-indigo-700 font-semibold shadow-xs" 
                  : "border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 text-slate-600"
              }`}>
                <input type="checkbox" checked={isChecked} onChange={() => toggleScenario(s)} className="rounded text-indigo-600 focus:ring-indigo-500/50" />
                <span className="text-xs">{s}</span>
              </label>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Severity</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-colors">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Organizer Notes (Optional)</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Gate 4 scanner is broken" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-colors" />
          </div>
        </div>
        {error && <p className="text-red-500 text-xs font-medium mb-4 flex items-center gap-1">⚠️ {error}</p>}
        <button onClick={runSimulation} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-xs hover:shadow-md hover:shadow-indigo-500/10 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex justify-center items-center cursor-pointer w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Simulating Strategy...
            </span>
          ) : (
            "Run AI Simulation"
          )}
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 md:col-span-2 space-y-3">
            <div className="h-6 bg-slate-100 rounded w-1/4"></div>
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-10 bg-slate-50 rounded"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
            <div className="h-5 bg-slate-100 rounded w-1/2"></div>
            <div className="h-16 bg-slate-50 rounded"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
            <div className="h-5 bg-slate-100 rounded w-1/2"></div>
            <div className="h-16 bg-slate-50 rounded"></div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 md:col-span-2">
             <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-4 mb-4">
               <h2 className="text-xl font-bold text-slate-800">{result.scenario}</h2>
               <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                 result.riskLevel.toLowerCase() === 'critical' ? 'bg-red-100 text-red-700' :
                 result.riskLevel.toLowerCase() === 'high' ? 'bg-orange-100 text-orange-700' :
                 'bg-yellow-100 text-yellow-700'
               }`}>
                 Risk: {result.riskLevel}
               </span>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed mb-6">{result.summary}</p>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 text-xs">
                 <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Est. Delay</span>
                 <span className="font-bold text-slate-700 text-sm">{result.estimatedDelay}</span>
               </div>
               <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 text-xs">
                 <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Impacted Fans</span>
                 <span className="font-bold text-slate-700 text-sm">{result.affectedSpectators.toLocaleString()}</span>
               </div>
               <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 text-xs">
                 <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Volunteers Req.</span>
                 <span className="font-bold text-slate-700 text-sm">{result.requiredVolunteers}</span>
               </div>
               <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 text-xs">
                 <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">Med / Sec Units</span>
                 <span className="font-bold text-slate-700 text-sm">{result.requiredMedicalTeams} Med / {result.requiredSecurityTeams} Sec</span>
               </div>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-red-600 flex items-center gap-1.5">🚨 Immediate Actions (0-5 min)</h3>
            <div className="space-y-4">
              {result.timeline.immediate.map(renderRec)}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-orange-600 flex items-center gap-1.5">⏳ Short Term Actions (5-15 min)</h3>
            <div className="space-y-4">
              {result.timeline.shortTerm.map(renderRec)}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-emerald-600 flex items-center gap-1.5">🙋 Volunteer & Gate Strategy</h3>
            <div className="space-y-4">
              {result.gateRecommendations.length > 0 || result.volunteerDeployment.length > 0 ? (
                <>
                  {result.gateRecommendations.map(renderRec)}
                  {result.volunteerDeployment.map(renderRec)}
                </>
              ) : (
                <p className="text-slate-400 text-xs italic">No specific deployment recommendations needed.</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-indigo-600 flex items-center gap-1.5">📢 Comms & Recovery</h3>
            <div className="space-y-4">
              {result.communicationPlan.length > 0 || result.recoveryPlan.length > 0 ? (
                <>
                  {result.communicationPlan.map(renderRec)}
                  {result.recoveryPlan.map(renderRec)}
                </>
              ) : (
                <p className="text-slate-400 text-xs italic">No communication directives generated.</p>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
