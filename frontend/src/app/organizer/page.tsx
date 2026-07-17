"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";
import DataUploadForm from "@/components/DataUploadForm";
import RecommendationCard from "@/components/RecommendationCard";
import { AnalysisResult } from "@/types";

import OrganizerNav from "@/components/OrganizerNav";

export default function OrganizerDashboard() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleLogout = async () => {
    await auth.signOut();
    Cookies.remove("role");
    Cookies.remove("authToken");
    router.push("/login");
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "critical": return "bg-red-600";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-400";
      default: return "bg-green-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OrganizerNav />
      <div className="flex-1 flex flex-col pl-[220px]">
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Stadium Ops Dashboard</h1>
          {analysisResult && (
            <div className="flex gap-2">
              <span className={`text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${getRiskColor(analysisResult.riskLevel)}`}>
                Risk: {analysisResult.riskLevel}
              </span>
              <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded tracking-wider">
                AI Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Log out
        </button>
      </header>

      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        {/* Left Column: Data Upload */}
        <div className="lg:col-span-1 space-y-6">
          <DataUploadForm onAnalysisComplete={setAnalysisResult} />
          
          {analysisResult && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">AI Summary</h3>
              <p className="text-sm text-blue-800">{analysisResult.aiSummary}</p>
              <p className="text-xs text-blue-500 mt-2">Analysis ID: {analysisResult.analysisId}</p>
            </div>
          )}
        </div>

        {/* Right Column: Recommendations */}
        <div className="lg:col-span-2">
          {!analysisResult ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white border-2 border-dashed border-gray-200 rounded-xl p-12">
              <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg font-medium">No Analysis Yet</p>
              <p className="text-sm">Upload crowd data to see AI operational recommendations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecommendationCard
                title="Congestion Alerts"
                icon="⚠️"
                bgColor="bg-red-50 border-red-100"
                data={analysisResult.congestionAlerts}
                renderItem={(alert) => (
                  <div>
                    <span className="font-semibold">{alert.gateId}</span> - <span className="uppercase text-xs font-bold text-red-600">{alert.severity}</span>
                  </div>
                )}
              />
              
              <RecommendationCard
                title="Predicted Bottlenecks"
                icon="⏳"
                bgColor="bg-orange-50 border-orange-100"
                data={analysisResult.predictedBottlenecks}
                renderItem={(item) => (
                  <div>
                    <span className="font-semibold">{item.location}</span>
                    <div className="text-sm text-gray-600">ETA: {item.etaMinutes} mins ({(item.confidence * 100).toFixed(0)}% confident)</div>
                  </div>
                )}
              />

              <RecommendationCard
                title="Gate Recommendations"
                icon="🚪"
                bgColor="bg-green-50 border-green-100"
                data={analysisResult.gateRecommendations}
                renderItem={(rec) => (
                  <div>
                    Divert <span className="font-semibold">{rec.fromGateId}</span> ➔ <span className="font-semibold">{rec.toGateId}</span>
                  </div>
                )}
              />

              <RecommendationCard
                title="Volunteer Actions"
                icon="🙋"
                bgColor="bg-purple-50 border-purple-100"
                data={analysisResult.volunteerSuggestions}
                renderItem={(vol) => (
                  <div>
                    Deploy <span className="font-semibold">{vol.volunteerId}</span> to <span className="font-semibold">{vol.suggestedLocation}</span>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
