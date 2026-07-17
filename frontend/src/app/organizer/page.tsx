"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Papa from "papaparse";
import { Users, DoorOpen, UserCheck, Brain, BarChart2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import DataUploadForm from "@/components/DataUploadForm";
import RecommendationCard from "@/components/RecommendationCard";
import { AnalysisResult, CrowdDataRow } from "@/types";
import { PageWrapper } from "@/components/layout";
import { Card, ProgressBar, Button, Badge } from "@/components/ui";

export default function OrganizerDashboard() {
  const router = useRouter();
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
      case "high": return "high";
      case "medium": return "medium";
      default: return "safe";
    }
  };

  const handleUseSampleData = async () => {
    setLoading(true);
    setError("");

    const sampleCsv = `gateId,count,timestamp
Gate A,1850,2026-07-17T16:00:00Z
Gate B,2900,2026-07-17T16:00:00Z
Gate C,950,2026-07-17T16:00:00Z
Gate D,4100,2026-07-17T16:00:00Z`;

    Papa.parse(sampleCsv, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.errors.length > 0) {
          setError(`CSV Parsing Error: ${results.errors[0].message}`);
          setLoading(false);
          return;
        }

        const validRows: CrowdDataRow[] = [];
        let crowdSum = 0;
        for (let i = 0; i < results.data.length; i++) {
          const row = results.data[i] as any;
          validRows.push({
            gateId: String(row.gateId),
            count: Number(row.count),
            timestamp: new Date(row.timestamp).toISOString(),
          });
          crowdSum += Number(row.count);
        }

        try {
          const token = Cookies.get("authToken");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analysis/csv`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ rows: validRows }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.detail || "Failed to run analysis");
          }

          setTotalCrowd(crowdSum);
          setActiveGates("10 of 14");
          setAnalysisResult(data);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const headerActions = (
    <div className="flex items-center gap-4">
      {analysisResult && (
        <div className="flex gap-2.5 mr-2">
          <Badge 
            variant={getRiskVariant(analysisResult.riskLevel)} 
            label={`Risk: ${analysisResult.riskLevel}`} 
            size="sm"
          />
          <Badge 
            variant="ai" 
            label={`AI: ${(analysisResult.confidence * 100).toFixed(0)}%`} 
            size="sm"
          />
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
      >
        Log out
      </Button>
    </div>
  );

  return (
    <PageWrapper title="Stadium Ops Dashboard" actions={headerActions} className="bg-[var(--bg-base)]">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2">
        <Card variant="default" padding="sm" className="flex items-center gap-4 border-[var(--bg-border)]">
          <div className="p-3 rounded-lg bg-[var(--bg-surface)] text-[var(--primary-400)]">
            <Users size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Total Crowd</p>
            <p className="text-xl font-bold font-mono text-[var(--text-primary)] mt-0.5">{totalCrowd.toLocaleString()}</p>
          </div>
        </Card>

        <Card variant="default" padding="sm" className="flex items-center gap-4 border-[var(--bg-border)]">
          <div className="p-3 rounded-lg bg-[var(--bg-surface)] text-[var(--primary-400)]">
            <DoorOpen size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Active Gates</p>
            <p className="text-xl font-bold font-mono text-[var(--text-primary)] mt-0.5">{activeGates}</p>
          </div>
        </Card>

        <Card variant="default" padding="sm" className="flex items-center gap-4 border-[var(--bg-border)]">
          <div className="p-3 rounded-lg bg-[var(--bg-surface)] text-[var(--primary-400)]">
            <UserCheck size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Volunteers On Duty</p>
            <p className="text-xl font-bold font-mono text-[var(--text-primary)] mt-0.5">24</p>
          </div>
        </Card>

        <Card variant="default" padding="sm" className="flex items-center gap-4 border-[var(--bg-border)]">
          <div className="p-3 rounded-lg bg-[var(--bg-surface)] text-[var(--accent-400)]">
            <Brain size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">AI Confidence</p>
            <p className="text-xl font-bold font-mono text-[var(--text-primary)] mt-0.5">
              {analysisResult ? `${(analysisResult.confidence * 100).toFixed(0)}%` : "92%"}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Left Column: Data Upload */}
        <div className="lg:col-span-1 space-y-6">
          <DataUploadForm onAnalysisComplete={(res) => {
            setAnalysisResult(res);
            setActiveGates("10 of 14");
          }} />
          
          {analysisResult && (
            <Card variant="accent" accentColor="var(--accent-400)" className="border-[var(--bg-border)]">
              <h3 className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <Brain size={16} className="text-[var(--accent-400)]" />
                AI Analysis Engine
              </h3>
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[var(--text-secondary)] font-medium">Confidence Score</span>
                  <span className="font-bold font-mono text-[var(--accent-300)]">{(analysisResult.confidence * 100).toFixed(0)}%</span>
                </div>
                <ProgressBar value={analysisResult.confidence * 100} color="accent" />
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{analysisResult.aiSummary}</p>
              <div className="text-[10px] text-[var(--text-tertiary)] font-mono mt-4 pt-3 border-t border-[var(--bg-border)]">
                Analysis ID: {analysisResult.analysisId} • Generated just now
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Recommendations */}
        <div className="lg:col-span-2">
          {!analysisResult ? (
            <Card variant="default" className="h-full flex flex-col items-center justify-center text-center p-12 border-[var(--bg-border)] min-h-[350px]">
              <BarChart2 className="w-12 h-12 mb-4 text-[var(--text-tertiary)] animate-pulse" strokeWidth={1.5} />
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Command Center Offline</h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6 leading-relaxed">
                Upload crowd metrics or use simulated sample data to activate AI command recommendations.
              </p>
              {error && (
                <div className="mb-4 p-3 bg-[var(--risk-critical-bg)] text-[var(--risk-critical-text)] text-xs font-medium rounded-xl border border-[var(--risk-critical-border)]">
                  {error}
                </div>
              )}
              <Button
                variant="secondary"
                onClick={handleUseSampleData}
                disabled={loading}
              >
                {loading ? "Simulating analysis..." : "Use Sample Data"}
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecommendationCard
                title="Congestion Alerts"
                icon="⚠️"
                data={analysisResult.congestionAlerts}
                renderItem={(alert) => (
                  <div>
                    <span className="font-bold text-[var(--text-primary)]">{alert.gateId}</span> - <span className="uppercase text-xs font-extrabold text-[var(--risk-critical)]">{alert.severity}</span>
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
                    <div className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">ETA: {item.etaMinutes} mins ({(item.confidence * 100).toFixed(0)}% confident)</div>
                  </div>
                )}
              />

              <RecommendationCard
                title="Gate Recommendations"
                icon="🚪"
                data={analysisResult.gateRecommendations}
                renderItem={(rec) => (
                  <div>
                    Divert <span className="font-bold text-[var(--text-primary)]">{rec.fromGateId}</span> ➔ <span className="font-bold text-[var(--text-primary)]">{rec.toGateId}</span>
                  </div>
                )}
              />

              <RecommendationCard
                title="Volunteer Actions"
                icon="🙋"
                data={analysisResult.volunteerSuggestions}
                renderItem={(vol) => (
                  <div>
                    Deploy <span className="font-bold text-[var(--text-primary)]">{vol.volunteerId}</span> to <span className="font-bold text-[var(--text-primary)]">{vol.suggestedLocation}</span>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
