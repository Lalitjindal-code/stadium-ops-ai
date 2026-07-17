"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OrganizerNav from "@/components/OrganizerNav";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";
import { VolunteerAssignmentResult } from "@/types";

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OrganizerNav />
      <div className="flex-1 p-8 pl-[220px]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resource Optimization</h1>
        <button
          onClick={handleLogout}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border mb-8 flex items-center justify-between">
        <div className="flex-1 mr-4">
            <label className="block text-sm font-medium mb-1">Active Scenario Context</label>
            <input type="text" value={scenario} onChange={(e) => setScenario(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <button onClick={optimizeAssignments} disabled={loading} className="mt-5 bg-indigo-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
          {loading ? "Optimizing Resources..." : "Optimize Assignments"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
                    <h2 className="text-xl font-bold mb-2">Optimization Summary</h2>
                    <p className="text-gray-700 mb-4">{result.summary}</p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between border-b pb-1"><span>Volunteers Assigned</span> <span className="font-bold">{result.resourceSummary.volunteersAssigned}</span></li>
                        <li className="flex justify-between border-b pb-1"><span>Medical Teams</span> <span className="font-bold">{result.resourceSummary.medicalTeams}</span></li>
                        <li className="flex justify-between border-b pb-1"><span>Security Teams</span> <span className="font-bold">{result.resourceSummary.securityTeams}</span></li>
                        <li className="flex justify-between border-b pb-1"><span>Traffic Teams</span> <span className="font-bold">{result.resourceSummary.trafficTeams}</span></li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h3 className="font-semibold mb-2">AI Reasoning</h3>
                    <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
                        {result.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
            </div>

            <div className="md:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Actionable Assignments</h2>
                {result.assignments.map((assignment, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{assignment.name} <span className="text-sm font-normal text-gray-500">({assignment.volunteerId})</span></h3>
                                <p className="text-indigo-600 font-semibold">{assignment.task}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {renderBadge(assignment.priority)}
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 rounded-full border border-blue-200">Score: {assignment.assignmentScore}</span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-700 grid grid-cols-2 gap-2 mt-4 bg-gray-50 p-3 rounded-lg border">
                            <p><strong>ETA:</strong> {assignment.eta}</p>
                            <p><strong>Duration:</strong> {assignment.estimatedDuration}</p>
                            <div className="col-span-2">
                                <p><strong>Reason:</strong> {assignment.reason}</p>
                                <p className="text-xs text-gray-500 mt-1">Evidence: {assignment.evidence.join(" • ")}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
      </div>
    </div>
  );
}
