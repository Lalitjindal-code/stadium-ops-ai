"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";
import { VolunteerAssignmentResult } from "@/types";
import { PageWrapper } from "@/components/layout";

export default function VolunteerAssignmentsPage() {
  const router = useRouter();
  const [scenario, setScenario] = useState("Heavy Rain & Gate Closure");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VolunteerAssignmentResult | null>(null);

  const handleLogout = async () => {
    await auth.signOut();
    Cookies.remove("auth_token");
    Cookies.remove("user_role");
    router.push("/login");
  };

  const optimizeAssignments = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/assignments/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          scenario,
          crowdAnalysisSummary: "High congestion detected at Gate 4.",
          scenarioResultSummary: "Immediate diversion required to Gate 6.",
          stadiumStatus: "Operating at 75% capacity.",
          notes: "Need medical at Gate 4."
        })
      });

      if (!res.ok) throw new Error("Optimization failed");
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderBadge = (priority: string) => {
    let color = "bg-gray-200 text-gray-800";
    if (priority.toLowerCase() === "critical") color = "bg-red-100 text-red-800";
    if (priority.toLowerCase() === "high") color = "bg-orange-100 text-orange-800";
    if (priority.toLowerCase() === "medium") color = "bg-yellow-100 text-yellow-800";
    if (priority.toLowerCase() === "low") color = "bg-green-100 text-green-800";
    return <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>{priority.toUpperCase()}</span>;
  };

  const headerActions = (
    <button
      onClick={handleLogout}
      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
    >
      Logout
    </button>
  );

  return (
    <PageWrapper title="Resource Optimization" actions={headerActions}>
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
        <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Active Scenario Context</label>
            <input type="text" value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="e.g. Heavy Rain + Gate Closure" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-colors" />
        </div>
        <button onClick={optimizeAssignments} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-xl shadow-xs hover:shadow-md hover:shadow-indigo-500/10 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex justify-center items-center cursor-pointer">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Optimizing Resources...
            </span>
          ) : (
            "Optimize Assignments"
          )}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs font-medium mb-4 flex items-center gap-1">⚠️ {error}</p>}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 h-44"></div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 h-32"></div>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 h-96"></div>
        </div>
      )}

      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                    <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Optimization Summary</h2>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">{result.summary}</p>
                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-medium">Volunteers Assigned</span>
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{result.resourceSummary.volunteersAssigned}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-medium">Medical Teams</span>
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{result.resourceSummary.medicalTeams}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-medium">Security Teams</span>
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{result.resourceSummary.securityTeams}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Traffic Teams</span>
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{result.resourceSummary.trafficTeams}</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1">🧠 AI Allocation Reasoning</h3>
                    <ul className="text-xs text-slate-500 space-y-2">
                        {result.reasoning.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-indigo-500 mt-0.5">▪</span>
                            <span>{r}</span>
                          </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="md:col-span-2 space-y-4">
                <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">Actionable Assignments</h2>
                <div className="space-y-4">
                  {result.assignments.map((assignment, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md transition-shadow duration-200">
                          <div className="flex justify-between items-start mb-3">
                              <div>
                                  <h3 className="text-sm font-bold text-slate-800">{assignment.name} <span className="text-xs font-normal text-slate-400">({assignment.volunteerId})</span></h3>
                                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">{assignment.task}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                  {renderBadge(assignment.priority)}
                                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">Score: {assignment.assignmentScore}</span>
                              </div>
                          </div>
                          <div className="text-xs text-slate-600 grid grid-cols-2 gap-3 mt-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100/60 leading-relaxed">
                              <p><strong className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider block mb-0.5">ETA</strong> <span className="font-semibold text-slate-700">{assignment.eta}</span></p>
                              <p><strong className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider block mb-0.5">Duration</strong> <span className="font-semibold text-slate-700">{assignment.estimatedDuration}</span></p>
                              <div className="col-span-2 border-t border-slate-100 pt-2.5 mt-1">
                                  <p><strong className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider block mb-0.5">Allocation Justification</strong> <span className="font-medium text-slate-700">{assignment.reason}</span></p>
                                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Evidence Metrics: {assignment.evidence.join(" • ")}</p>
                              </div>
                          </div>
                      </div>
                  ))}
                </div>
            </div>
        </div>
      )}
    </PageWrapper>
  );
}
