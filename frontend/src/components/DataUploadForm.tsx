"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import Cookies from "js-cookie";
import { UploadCloud } from "lucide-react";
import { CrowdDataRow, AnalysisResult } from "@/types";
import { Card, Button, Spinner } from "./ui";

interface DataUploadFormProps {
  onAnalysisComplete: (data: AnalysisResult) => void;
}

export default function DataUploadForm({ onAnalysisComplete }: DataUploadFormProps) {
  const [preview, setPreview] = useState<CrowdDataRow[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedRows, setParsedRows] = useState<CrowdDataRow[]>([]);
  const [loadingStep, setLoadingStep] = useState<string>("Initializing analysis...");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    if (selected.type !== "text/csv" && !selected.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }
    
    Papa.parse(selected, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`CSV Parsing Error: ${results.errors[0].message}`);
          return;
        }
        processParsedData(results.data as any[]);
      },
    });
  };

  const processParsedData = (data: any[]) => {
    const validRows = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row.gateId || row.count === undefined || !row.timestamp) {
        setError(`Row ${i + 1} is missing required fields (gateId, count, timestamp).`);
        return;
      }
      validRows.push({
        gateId: String(row.gateId),
        count: Number(row.count),
        timestamp: new Date(row.timestamp).toISOString(),
      });
    }
    setParsedRows(validRows);
    setPreview(validRows.slice(0, 5));
  };

  const triggerAnalysis = async (rowsToAnalyze: CrowdDataRow[]) => {
    setLoading(true);
    setError("");
    setLoadingStep("Ingesting CSV data...");
    
    try {
      const steps = [
        "Ingesting CSV data...",
        "Running Gemini predictive models...",
        "Formulating gate route recommendations..."
      ];
      
      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        if (stepIndex < steps.length - 1) {
          stepIndex++;
          setLoadingStep(steps[stepIndex]);
        }
      }, 1500);

      const token = Cookies.get("authToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analysis/csv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rows: rowsToAnalyze }),
      });
      
      clearInterval(stepInterval);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to run analysis");
      }
      
      onAnalysisComplete(data);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (parsedRows.length === 0) {
      setError("No valid data to analyze.");
      return;
    }
    await triggerAnalysis(parsedRows);
  };

  const handleUseSampleData = async () => {
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
          return;
        }
        const validRows = [];
        for (let i = 0; i < results.data.length; i++) {
          const row = results.data[i] as any;
          validRows.push({
            gateId: String(row.gateId),
            count: Number(row.count),
            timestamp: new Date(row.timestamp).toISOString(),
          });
        }
        setParsedRows(validRows);
        setPreview(validRows.slice(0, 5));
        await triggerAnalysis(validRows);
      }
    });
  };

  return (
    <Card variant="default" className="border-[var(--bg-border)]">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-pulse">
          <Spinner color="accent" size="lg" className="mb-4" />
          <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-2">
            Gemini is analyzing your data...
          </h3>
          <p className="text-xs text-[var(--text-tertiary)] font-mono">
            {loadingStep}
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2">
            <span className="text-[var(--accent-400)]">📊</span> Upload Crowd Data
          </h2>
          
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">Select CSV File</label>
            <div className="relative border-2 border-dashed border-[var(--bg-border)] hover:border-[var(--primary-400)] rounded-xl p-6 bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group">
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="text-[var(--text-tertiary)] mb-2 group-hover:scale-110 group-hover:text-[var(--primary-400)] transition-all duration-200" size={32} strokeWidth={1.5} />
              <span className="text-sm font-semibold text-[var(--text-primary)]">Choose CSV File</span>
              <span className="text-xs text-[var(--text-tertiary)] mt-1">or drag and drop it here</span>
            </div>
            <p className="mt-2 text-[11px] text-[var(--text-tertiary)] font-medium">Required headers: <code className="bg-[var(--bg-surface)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] font-mono">gateId</code>, <code className="bg-[var(--bg-surface)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] font-mono">count</code>, <code className="bg-[var(--bg-surface)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] font-mono">timestamp</code></p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-[var(--risk-critical-bg)] text-[var(--risk-critical-text)] text-xs font-medium rounded-xl border border-[var(--risk-critical-border)] flex items-start gap-2 animate-pulse">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {preview.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-2.5">Data Preview ({parsedRows.length} total rows)</h3>
              <div className="overflow-x-auto rounded-xl border border-[var(--bg-border)]">
                <table className="min-w-full divide-y divide-[var(--bg-border)] text-xs">
                  <thead className="bg-[var(--bg-surface)]">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-tertiary)]">Gate ID</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-tertiary)]">Count</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-tertiary)]">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--bg-border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                    {preview.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[var(--bg-surface)]/40 transition-colors">
                        <td className="px-4 py-2.5 font-semibold text-[var(--text-primary)]">{row.gateId}</td>
                        <td className="px-4 py-2.5">{row.count}</td>
                        <td className="px-4 py-2.5">{new Date(row.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <Button
              onClick={handleSubmit}
              disabled={parsedRows.length === 0}
              fullWidth
            >
              Run AI Analysis
            </Button>
            <Button
              variant="secondary"
              onClick={handleUseSampleData}
              fullWidth
            >
              Use Sample Data
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
