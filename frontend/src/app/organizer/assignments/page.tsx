"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";
import { VolunteerAssignmentResult } from "@/types";
import { PageWrapper } from "@/components/layout";
import { Badge, Spinner, Button, Card } from "@/components/ui";
import { Brain, Users, Activity, Shield, Sparkles, Map, AlertTriangle } from "lucide-react";

export default function VolunteerAssignmentsPage() {
  const router = useRouter();
  const [scenario, setScenario] = useState("Heavy Rain & Gate Closure");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VolunteerAssignmentResult | null>(null);

  const handleLogout = async () => {
    await auth.signOut();
    Cookies.remove("authToken");
    Cookies.remove("role");
    router.push("/login");
  };

  const optimizeAssignments = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const token = Cookies.get("authToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
      const res = await fetch(`${API_URL}/assignments/optimize`, {
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

  const getPriorityVariant = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === "critical") return "critical";
    if (p === "high") return "high";
    if (p === "medium") return "medium";
    if (p === "low") return "safe";
    return "info";
  };

  const headerActions = (
    <Button onClick={handleLogout} variant="danger">Logout</Button>
  );

  return (
    <PageWrapper title="Resource Optimization" actions={headerActions}>
      <Card className="mb-8 mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6 p-6">
        <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">Active Scenario Context</label>
            <input type="text" value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="e.g. Heavy Rain + Gate Closure" className="w-full bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] border border-[var(--bg-border)] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[var(--primary-500)]/50 focus:border-transparent outline-none transition-colors" />
        </div>
        <Button 
          onClick={optimizeAssignments} 
          disabled={loading} 
          variant="primary" 
          className="py-3 px-8 text-sm font-bold flex justify-center items-center h-[46px]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" color="white" />
              Optimizing Resources...
            </span>
          ) : (
            "Optimize Assignments"
          )}
        </Button>
      </Card>

      {error && <p className="text-[var(--risk-critical-text)] bg-[var(--risk-critical)]/10 p-3 rounded-lg border border-[var(--risk-critical)]/20 text-xs font-medium mb-4 flex items-center gap-2">
        <AlertTriangle size={14} /> {error}
      </p>}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--bg-border)] h-44"></div>
            <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--bg-border)] h-32"></div>
          </div>
          <div className="md:col-span-2 bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--bg-border)] h-96"></div>
        </div>
      )}

      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--bg-border)] pb-3 mb-4">Optimization Summary</h2>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">{result.summary}</p>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs border-b border-[var(--bg-border)] pb-2.5">
                          <span className="text-[var(--text-tertiary)] font-medium flex items-center gap-2"><Users size={14} /> Volunteers Assigned</span>
                          <span className="font-bold text-[var(--text-primary)] bg-[var(--bg-base)] border border-[var(--bg-border)] px-2.5 py-0.5 rounded-md">{result.resourceSummary.volunteersAssigned}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-[var(--bg-border)] pb-2.5">
                          <span className="text-[var(--text-tertiary)] font-medium flex items-center gap-2"><Activity size={14} /> Medical Teams</span>
                          <span className="font-bold text-[var(--text-primary)] bg-[var(--bg-base)] border border-[var(--bg-border)] px-2.5 py-0.5 rounded-md">{result.resourceSummary.medicalTeams}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-[var(--bg-border)] pb-2.5">
                          <span className="text-[var(--text-tertiary)] font-medium flex items-center gap-2"><Shield size={14} /> Security Teams</span>
                          <span className="font-bold text-[var(--text-primary)] bg-[var(--bg-base)] border border-[var(--bg-border)] px-2.5 py-0.5 rounded-md">{result.resourceSummary.securityTeams}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[var(--text-tertiary)] font-medium flex items-center gap-2"><Map size={14} /> Traffic Teams</span>
                          <span className="font-bold text-[var(--text-primary)] bg-[var(--bg-base)] border border-[var(--bg-border)] px-2.5 py-0.5 rounded-md">{result.resourceSummary.trafficTeams}</span>
                        </div>
                    </div>
                </Card>
                
                <div className="glass p-8 rounded-2xl border-l-4 border-y border-r border-[var(--bg-border)] border-l-[var(--accent-400)] shadow-md">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--accent-400)] mb-6 flex items-center gap-2">
                      <Brain size={18} /> AI Allocation Reasoning
                    </h3>
                    <ul className="text-sm text-[var(--text-secondary)] space-y-4">
                        {result.reasoning.map((r, i) => (
                          <li key={i} className="flex items-start gap-3 leading-relaxed">
                            <Sparkles size={14} className="text-[var(--accent-500)] mt-0.5 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="md:col-span-2 space-y-6">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">Actionable Assignments</h2>
                <div className="space-y-6">
                  {result.assignments.map((assignment, idx) => (
                      <div key={idx} className="glass p-6 md:p-8 rounded-2xl border border-[var(--bg-border)] hover:border-[var(--primary-500)] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col gap-6 relative overflow-hidden group">
                          {/* Left Accent Border based on priority */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            assignment.priority.toLowerCase() === 'critical' ? 'bg-[var(--risk-critical)] shadow-[0_0_12px_var(--risk-critical)]' :
                            assignment.priority.toLowerCase() === 'high' ? 'bg-[var(--risk-high)] shadow-[0_0_12px_var(--risk-high)]' :
                            assignment.priority.toLowerCase() === 'medium' ? 'bg-[var(--risk-medium)] shadow-[0_0_12px_var(--risk-medium)]' :
                            'bg-[var(--risk-safe)] shadow-[0_0_12px_var(--risk-safe)]'
                          }`} />
                          
                          <div className="flex justify-between items-start pl-4">
                              <div>
                                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{assignment.name} <span className="text-xs font-mono text-[var(--text-tertiary)] font-normal ml-2 bg-[var(--bg-base)] px-2 py-1 rounded-md border border-[var(--bg-border)]">ID: {assignment.volunteerId}</span></h3>
                                  <p className="text-base font-semibold text-[var(--primary-400)]">{assignment.task}</p>
                              </div>
                              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                                  <Badge variant={getPriorityVariant(assignment.priority)} label={assignment.priority.toUpperCase()} size="md" showIcon={false} />
                                  <span className="text-xs font-bold bg-[var(--accent-500)]/10 text-[var(--accent-400)] px-3 py-1.5 rounded-full border border-[var(--accent-500)]/20 shadow-sm">Score: {assignment.assignmentScore}</span>
                              </div>
                          </div>
                          <div className="text-sm grid grid-cols-2 gap-4 bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--bg-border)] leading-relaxed ml-4 shadow-inner">
                              <p><strong className="text-[var(--text-tertiary)] font-semibold uppercase text-[10px] tracking-wider block mb-1.5">ETA</strong> <span className="font-bold text-[var(--text-primary)]">{assignment.eta}</span></p>
                              <p><strong className="text-[var(--text-tertiary)] font-semibold uppercase text-[10px] tracking-wider block mb-1.5">Duration</strong> <span className="font-bold text-[var(--text-primary)]">{assignment.estimatedDuration}</span></p>
                              <div className="col-span-2 border-t border-[var(--bg-border)] pt-4 mt-2">
                                  <p><strong className="text-[var(--text-tertiary)] font-semibold uppercase text-[10px] tracking-wider block mb-1.5">Allocation Justification</strong> <span className="font-medium text-[var(--text-secondary)]">{assignment.reason}</span></p>
                                  <p className="text-xs text-[var(--text-tertiary)] mt-3 font-medium flex items-center gap-2 bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--bg-border)]">
                                    <Sparkles size={14} className="text-[var(--primary-500)] shrink-0" />
                                    <span>Evidence Metrics: {assignment.evidence.join(" • ")}</span>
                                  </p>
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
