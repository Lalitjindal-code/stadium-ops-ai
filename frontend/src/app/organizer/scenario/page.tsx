"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";
import { ScenarioResult, ScenarioRecommendation } from "@/types";
import { PageWrapper } from "@/components/layout";
import { Badge, Spinner, Button, Card } from "@/components/ui";
import { AlertCircle, Clock, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";

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
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(["Heavy Rain", "Sudden Crowd Surge"]);
  const [severity, setSeverity] = useState<string>("Medium");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const handleLogout = async () => {
    await auth.signOut();
    Cookies.remove("authToken");
    Cookies.remove("role");
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
      const token = Cookies.get("authToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const res = await fetch(`${API_URL}/scenario/simulate`, {
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
    <div key={idx} className="mb-4 border-b border-[var(--bg-border)] pb-3 text-sm last:border-0 last:mb-0 last:pb-0">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <p className="font-semibold text-[var(--text-primary)] leading-tight">{r.action}</p>
        <Badge variant={r.confidence > 0.85 ? 'high' : 'medium'} label={`${(r.confidence * 100).toFixed(0)}% Conf`} size="sm" showIcon={false} />
      </div>
      <p className="text-[var(--text-secondary)] mb-1"><span className="text-[var(--text-tertiary)] uppercase tracking-wider text-[10px] font-bold mr-1">Reason:</span> {r.reason}</p>
      <p className="text-[var(--text-secondary)] mb-1"><span className="text-[var(--text-tertiary)] uppercase tracking-wider text-[10px] font-bold mr-1">Evidence:</span> {r.evidence}</p>
      <div className="bg-[var(--bg-base)] rounded px-2 py-1 mt-2 text-xs text-[var(--text-secondary)] border border-[var(--bg-border)] inline-block">
        <Sparkles size={10} className="inline mr-1 text-[var(--accent-400)]" />
        {r.reasonForConfidence}
      </div>
    </div>
  );

  const headerActions = (
    <Button onClick={handleLogout} variant="danger">Logout</Button>
  );

  const getRiskVariant = (risk: string) => {
    const r = risk.toLowerCase();
    if (r === 'critical') return 'critical';
    if (r === 'high') return 'high';
    if (r === 'medium' || r === 'moderate') return 'medium';
    return 'safe';
  };

  return (
    <PageWrapper title="Scenario Simulation" actions={headerActions}>
      <Card className="mb-8 mt-4">
        <h2 className="text-base font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2">
          <AlertCircle size={18} className="text-[var(--primary-400)]" /> Configure Incident Context
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {SCENARIO_OPTIONS.map(s => {
            const isChecked = selectedScenarios.includes(s);
            return (
              <label key={s} className={`flex items-center space-x-2.5 p-3.5 border rounded-xl cursor-pointer select-none transition-all duration-200 ${
                isChecked 
                  ? "border-[var(--primary-500)] bg-[var(--primary-500)]/10 text-[var(--primary-300)] font-semibold shadow-[0_0_12px_rgba(34,211,238,0.15)]" 
                  : "border-[var(--bg-border)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] hover:border-[var(--primary-500)]/40 text-[var(--text-secondary)]"
              }`}>
                <input type="checkbox" checked={isChecked} onChange={() => toggleScenario(s)} className="rounded text-[var(--primary-500)] focus:ring-[var(--primary-500)]/50 bg-[var(--bg-base)] border-[var(--bg-border)]" />
                <span className="text-xs">{s}</span>
              </label>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">Severity</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-primary)] border border-[var(--bg-border)] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[var(--primary-500)]/50 focus:border-transparent outline-none transition-colors">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">Organizer Notes (Optional)</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Gate 4 scanner is broken" className="w-full bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] border border-[var(--bg-border)] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[var(--primary-500)]/50 focus:border-transparent outline-none transition-colors" />
          </div>
        </div>
        {error && <p className="text-[var(--risk-critical-text)] bg-[var(--risk-critical)]/10 p-3 rounded-lg border border-[var(--risk-critical)]/20 text-xs font-medium mb-4 flex items-center gap-2">
          <ShieldAlert size={14} /> {error}
        </p>}
        <Button 
          onClick={runSimulation} 
          disabled={loading} 
          variant="primary" 
          className="w-full py-3.5 text-sm font-bold flex justify-center items-center h-12"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" color="white" />
              Simulating Strategy...
            </span>
          ) : (
            "Run AI Simulation"
          )}
        </Button>
      </Card>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="glass p-8 rounded-2xl border-neon-blue md:col-span-2 space-y-6 animate-pulse glow-blue">
            <div className="h-6 bg-[var(--neon-blue-bg)] rounded-md w-1/4"></div>
            <div className="h-4 bg-[var(--neon-blue-bg)]/50 rounded-md w-3/4"></div>
            <div className="h-12 bg-[var(--neon-blue-bg)] rounded-md mt-6"></div>
          </div>
          <div className="glass p-8 rounded-2xl border-neon-red space-y-6 animate-pulse glow-red">
            <div className="h-6 bg-[var(--neon-red-bg)] rounded-md w-1/2"></div>
            <div className="h-28 bg-[var(--neon-red-bg)]/50 rounded-md"></div>
          </div>
          <div className="glass p-8 rounded-2xl border-neon-amber space-y-6 animate-pulse glow-amber">
            <div className="h-6 bg-[var(--neon-amber-bg)] rounded-md w-1/2"></div>
            <div className="h-28 bg-[var(--neon-amber-bg)]/50 rounded-md"></div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="glass p-8 rounded-2xl border-neon-blue md:col-span-2 glow-blue">
             <div className="flex flex-wrap justify-between items-center gap-4 border-b border-neon-blue/30 pb-5 mb-6">
               <h2 className="text-2xl font-bold text-[var(--text-primary)]">{result.scenario}</h2>
               <Badge variant={getRiskVariant(result.riskLevel)} label={`Risk: ${result.riskLevel}`} size="md" pulse={['critical', 'high'].includes(result.riskLevel.toLowerCase())} />
             </div>
             <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-8">{result.summary}</p>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--bg-border)] text-sm">
                 <span className="text-[var(--text-tertiary)] font-semibold uppercase tracking-wider block mb-2">Est. Delay</span>
                 <span className="font-bold text-[var(--text-primary)] text-lg">{result.estimatedDelay}</span>
               </div>
               <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--bg-border)] text-sm">
                 <span className="text-[var(--text-tertiary)] font-semibold uppercase tracking-wider block mb-2">Impacted Fans</span>
                 <span className="font-bold text-[var(--text-primary)] text-lg">{result.affectedSpectators.toLocaleString()}</span>
               </div>
               <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--bg-border)] text-sm">
                 <span className="text-[var(--text-tertiary)] font-semibold uppercase tracking-wider block mb-2">Volunteers Req.</span>
                 <span className="font-bold text-[var(--text-primary)] text-lg">{result.requiredVolunteers}</span>
               </div>
               <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--bg-border)] text-sm">
                 <span className="text-[var(--text-tertiary)] font-semibold uppercase tracking-wider block mb-2">Med / Sec Units</span>
                 <span className="font-bold text-[var(--text-primary)] text-lg">{result.requiredMedicalTeams} Med / {result.requiredSecurityTeams} Sec</span>
               </div>
             </div>
          </div>
          
          <div className="glass p-8 rounded-2xl border-l-4 border-y border-r border-y-neon-red/20 border-r-neon-red/20 border-l-[var(--neon-red)] glow-red relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--neon-red-bg)] opacity-20 pointer-events-none" />
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-[var(--neon-red)] flex items-center gap-2 relative z-10">
              <ShieldAlert size={18} /> Immediate Actions (0-5 min)
            </h3>
            <div className="space-y-4 relative z-10">
              {result.timeline.immediate.map(renderRec)}
            </div>
          </div>
          <div className="glass p-8 rounded-2xl border-l-4 border-y border-r border-y-neon-amber/20 border-r-neon-amber/20 border-l-[var(--neon-amber)] glow-amber relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--neon-amber-bg)] opacity-20 pointer-events-none" />
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-[var(--neon-amber)] flex items-center gap-2 relative z-10">
              <Clock size={18} /> Short Term Actions (5-15 min)
            </h3>
            <div className="space-y-4 relative z-10">
              {result.timeline.shortTerm.map(renderRec)}
            </div>
          </div>
          
          <div className="glass p-8 rounded-2xl border-l-4 border-y border-r border-y-neon-green/20 border-r-neon-green/20 border-l-[var(--neon-green)] glow-green relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--neon-green-bg)] opacity-20 pointer-events-none" />
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-[var(--neon-green)] flex items-center gap-2 relative z-10">
              <Sparkles size={18} /> Volunteer & Gate Strategy
            </h3>
            <div className="space-y-4 relative z-10">
              {result.gateRecommendations.length > 0 || result.volunteerDeployment.length > 0 ? (
                <>
                  {result.gateRecommendations.map(renderRec)}
                  {result.volunteerDeployment.map(renderRec)}
                </>
              ) : (
                <p className="text-[var(--text-tertiary)] text-sm italic">No specific deployment recommendations needed.</p>
              )}
            </div>
          </div>
          <div className="glass p-8 rounded-2xl border-l-4 border-y border-r border-y-neon-blue/20 border-r-neon-blue/20 border-l-[var(--neon-blue)] glow-blue relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--neon-blue-bg)] opacity-20 pointer-events-none" />
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-[var(--neon-blue)] flex items-center gap-2 relative z-10">
              <MessageSquare size={18} /> Comms & Recovery
            </h3>
            <div className="space-y-4 relative z-10">
              {result.communicationPlan.length > 0 || result.recoveryPlan.length > 0 ? (
                <>
                  {result.communicationPlan.map(renderRec)}
                  {result.recoveryPlan.map(renderRec)}
                </>
              ) : (
                <p className="text-[var(--text-tertiary)] text-sm italic">No communication directives generated.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
