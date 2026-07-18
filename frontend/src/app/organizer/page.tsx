"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Papa from "papaparse";
import { Users, DoorOpen, UserCheck, Brain, BarChart2, TrendingUp, Zap, AlertTriangle } from "lucide-react";
import { auth } from "@/lib/firebase";
import DataUploadForm from "@/components/DataUploadForm";
import RecommendationCard from "@/components/RecommendationCard";
import Stadium3DView from "@/components/Stadium3DView";
import { AnalysisResult, CrowdDataRow } from "@/types";
import { PageWrapper } from "@/components/layout";
import { Card, ProgressBar, Button, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  glow: string;
  bg: string;
  delay?: number;
  subValue?: string;
}

function KpiCard({ icon, label, value, color, glow, bg, delay = 0, subValue }: KpiCardProps) {
  const [displayed, setDisplayed] = useState(0);
  const isNumber = typeof value === 'number';

  useEffect(() => {
    if (!isNumber) return;
    let start = 0;
    const target = value as number;
    const duration = 1200;
    const step = duration / 60;
    const increment = target / 60;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setDisplayed(target); clearInterval(timer); }
      else setDisplayed(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [value, isNumber]);

  return (
    <div
      className="animate-fade-in-up relative overflow-hidden rounded-xl p-5 group cursor-default"
      style={{
        animationDelay: `${delay}ms`,
        background: `linear-gradient(135deg, ${bg} 0%, rgba(12,17,32,0.95) 100%)`,
        border: `1px solid ${color}20`,
        boxShadow: `0 0 0 1px ${color}10, 0 4px 20px rgba(0,0,0,0.5)`,
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 1px ${color}35, 0 8px 30px rgba(0,0,0,0.6), 0 0 40px ${glow}`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 1px ${color}10, 0 4px 20px rgba(0,0,0,0.5)`;
        e.currentTarget.style.transform = '';
      }}
    >
      {/* Background glow blob */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-2xl pointer-events-none" style={{ background: color }} />

      {/* Top line accent */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />

      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}25`, color }}>
          {icon}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">{label}</p>
      </div>

      <p className="font-display text-2xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
        {isNumber ? displayed.toLocaleString() : value}
      </p>
      {subValue && <p className="text-xs text-[var(--text-tertiary)] mt-1 font-mono">{subValue}</p>}

      {/* Bottom mini bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${color}40, ${color}80, ${color}40)` }} />
    </div>
  );
}

export default function OrganizerDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [totalCrowd, setTotalCrowd] = useState<number>(92450);
  const [activeGates, setActiveGates] = useState<string>("12 of 14");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogout = async () => {
    await auth.signOut();
    Cookies.remove("role");
    Cookies.remove("authToken");
    router.push("/login");
  };

  const getRiskVariant = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "critical": return "critical";
      case "high":     return "high";
      case "medium":   return "medium";
      default:         return "safe";
    }
  };

  const handleUseSampleData = async () => {
    setLoading(true);
    setError("");
    const sampleCsv = `gateId,count,timestamp\nGate A,1850,2026-07-17T16:00:00Z\nGate B,2900,2026-07-17T16:00:00Z\nGate C,950,2026-07-17T16:00:00Z\nGate D,4100,2026-07-17T16:00:00Z`;
    Papa.parse(sampleCsv, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.errors.length > 0) {
          const errMsg = `CSV Parsing Error: ${results.errors[0].message}`;
          setError(errMsg); toast("error", errMsg); setLoading(false); return;
        }
        const validRows: CrowdDataRow[] = [];
        let crowdSum = 0;
        for (const row of results.data as Record<string, unknown>[]) {
          validRows.push({ gateId: String(row.gateId), count: Number(row.count), timestamp: new Date(String(row.timestamp)).toISOString() });
          crowdSum += Number(row.count);
        }
        try {
          const token = Cookies.get("authToken");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/analysis/csv`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ rows: validRows }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.detail || "Failed to run analysis");
          setTotalCrowd(crowdSum);
          setActiveGates("10 of 14");
          setAnalysisResult(data);
          toast("ai", "AI Analysis Complete: New recommendations generated.");
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          setError(errMsg); toast("error", errMsg);
        } finally { setLoading(false); }
      },
    });
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      {analysisResult && (
        <div className="flex gap-2">
          <Badge variant={getRiskVariant(analysisResult.riskLevel)} label={`Risk: ${analysisResult.riskLevel}`} size="sm" pulse />
          <Badge variant="ai" label={`AI: ${(analysisResult.confidence * 100).toFixed(0)}%`} size="sm" />
        </div>
      )}
      <Button variant="ghost" size="sm" onClick={handleLogout}>Log out</Button>
    </div>
  );

  return (
    <PageWrapper title="Stadium Ops Dashboard" subtitle="FIFA 2026 — AI Command Center" actions={headerActions}>

      {/* ── Row 1: KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger">
        <KpiCard
          icon={<Users size={18} strokeWidth={1.5} />}
          label="Total Crowd"
          value={totalCrowd}
          color="var(--primary-400)"
          glow="rgba(212,175,55,0.12)"
          bg="rgba(212,175,55,0.05)"
          delay={0}
          subValue="↑ 4.2% vs last hour"
        />
        <KpiCard
          icon={<DoorOpen size={18} strokeWidth={1.5} />}
          label="Active Gates"
          value={activeGates}
          color="var(--primary-500)"
          glow="rgba(197,160,48,0.1)"
          bg="rgba(197,160,48,0.04)"
          delay={70}
          subValue="2 gates on alert"
        />
        <KpiCard
          icon={<UserCheck size={18} strokeWidth={1.5} />}
          label="Volunteers On Duty"
          value={24}
          color="var(--primary-300)"
          glow="rgba(249,229,150,0.1)"
          bg="rgba(249,229,150,0.04)"
          delay={140}
          subValue="5 deployed this hour"
        />
        <KpiCard
          icon={<Brain size={18} strokeWidth={1.5} />}
          label="AI Confidence"
          value={analysisResult ? `${(analysisResult.confidence * 100).toFixed(0)}%` : "—"}
          color="var(--primary-400)"
          glow="rgba(212,175,55,0.1)"
          bg="rgba(212,175,55,0.04)"
          delay={210}
          subValue="Gemini · Rule Engine"
        />
      </div>

      {/* ── Row 2: 3D Stadium — Full Width Centerpiece ── */}
      <div className="w-full mb-6 h-[320px] lg:h-[340px]">
        <Stadium3DView analysisResult={analysisResult} />
      </div>

      {/* ── Row 3: Upload Form + AI Engine side-by-side ── */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Data Upload — 60% width */}
        <div className="w-full lg:w-3/5">
          <DataUploadForm onAnalysisComplete={(res) => {
            setAnalysisResult(res);
            setActiveGates("10 of 14");
            const totalFromAlerts = res.congestionAlerts?.length > 0 ? 9800 + Math.floor(Math.random() * 5000) : totalCrowd;
            setTotalCrowd(totalFromAlerts);
            toast("ai", "AI Analysis Complete: New recommendations generated.");
          }} />
        </div>

        {/* AI Engine Status — 40% width */}
        <div className="w-full lg:w-2/5">
          {analysisResult ? (
            <Card variant="accent" accentColor="var(--primary-400)" className="animate-fade-in flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-border)] flex items-center justify-center">
                  <Brain size={20} className="text-[var(--primary-400)]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[var(--text-primary)] text-base leading-none mb-1">AI Analysis Engine</h3>
                  <p className="text-xs text-[var(--text-tertiary)]">Gemini Pro · Live</p>
                </div>
                <span className="ml-auto text-[10px] font-mono text-[var(--primary-400)] bg-[var(--primary-400)]/10 px-3 py-1 rounded-full border border-[var(--primary-400)]/20">
                  ACTIVE
                </span>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-[var(--text-secondary)] font-medium">Confidence Score</span>
                  <span className="font-bold font-mono text-[var(--primary-400)] text-lg">{(analysisResult.confidence * 100).toFixed(0)}%</span>
                </div>
                <ProgressBar value={analysisResult.confidence * 100} color="accent" height="md" />
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-base)]/60 border border-[var(--bg-border)] mb-6 flex-1">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{analysisResult.aiSummary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                <div className="p-3 rounded-xl bg-[var(--bg-base)]/40 border border-[var(--bg-border)]/50">
                  <p className="text-lg font-bold text-[var(--text-primary)] mb-1">{analysisResult.congestionAlerts?.length ?? 0}</p>
                  <p className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">Alerts</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-base)]/40 border border-[var(--bg-border)]/50">
                  <p className="text-lg font-bold text-[var(--text-primary)] mb-1">{analysisResult.gateRecommendations?.length ?? 0}</p>
                  <p className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">Gate Recs</p>
                </div>
              </div>

              <div className="text-[11px] text-[var(--text-disabled)] font-mono mt-auto pt-4 border-t border-[var(--bg-border)]">
                ID: {analysisResult.analysisId} · Generated just now
              </div>
            </Card>
          ) : (
            <Card variant="glass" className="h-full flex flex-col items-center justify-center text-center p-6 min-h-[250px]">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--primary-400)]/20 flex items-center justify-center animate-float">
                  <BarChart2 size={28} strokeWidth={1.5} className="text-[var(--primary-400)] opacity-70" />
                </div>
                <div className="absolute -inset-3 rounded-2xl border border-[var(--primary-400)]/10 animate-ping" style={{ animationDuration: '3s' }} />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">Command Center Offline</h3>
              <p className="text-xs text-[var(--text-tertiary)] leading-relaxed mb-6 max-w-[250px]">
                Upload CSV or activate sample data to power the AI engine.
              </p>
              {error && (
                <div className="mb-6 p-3 bg-[var(--risk-critical)]/10 text-[var(--risk-critical)] text-xs rounded-xl border border-[var(--risk-critical)]/20 w-full">
                  {error}
                </div>
              )}
              <Button variant="outline" size="md" onClick={handleUseSampleData} disabled={loading} leftIcon={<Zap size={16} className="text-[var(--primary-400)]" />}>
                {loading ? "Analyzing…" : "Run Sample Analysis"}
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* ── Row 4: AI Recommendations Grid (only when data exists) ── */}
      {analysisResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          <RecommendationCard
            title="Congestion Alerts"
            icon="⚠️"
            data={analysisResult.congestionAlerts}
            renderItem={(alert) => (
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} className="text-[var(--risk-critical)] flex-shrink-0" />
                <span className="font-bold text-[var(--text-primary)]">{alert.gateId}</span>
                <span className="ml-auto text-[10px] font-extrabold uppercase tracking-wide text-[var(--risk-critical)] bg-[var(--risk-critical)]/10 px-1.5 py-0.5 rounded border border-[var(--risk-critical)]/20">{alert.severity}</span>
              </div>
            )}
          />
          <RecommendationCard
            title="Predicted Bottlenecks"
            icon="⏳"
            data={analysisResult.predictedBottlenecks}
            renderItem={(item) => (
              <div>
                <span className="font-bold text-[var(--text-primary)]">{item.location}</span>
                <div className="text-[11px] text-[var(--text-tertiary)] font-mono mt-0.5 flex items-center gap-2">
                  <span>ETA {item.etaMinutes}m</span>
                  <span className="text-[var(--risk-medium)]">{(item.confidence * 100).toFixed(0)}% conf</span>
                </div>
              </div>
            )}
          />
          <RecommendationCard
            title="Gate Recommendations"
            icon="🚪"
            data={analysisResult.gateRecommendations}
            renderItem={(rec) => (
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--text-primary)]">{rec.fromGateId}</span>
                <TrendingUp size={12} className="text-[var(--risk-safe)]" />
                <span className="font-bold text-[var(--text-primary)]">{rec.toGateId}</span>
              </div>
            )}
          />
          <RecommendationCard
            title="Volunteer Actions"
            icon="🙋"
            data={analysisResult.volunteerSuggestions}
            renderItem={(vol) => (
              <div>
                <span className="font-bold text-[var(--primary-400)]">{vol.volunteerId}</span>
                <span className="text-[var(--text-secondary)]"> → </span>
                <span className="font-bold text-[var(--text-primary)]">{vol.suggestedLocation}</span>
              </div>
            )}
          />
        </div>
      )}
    </PageWrapper>
  );
}

