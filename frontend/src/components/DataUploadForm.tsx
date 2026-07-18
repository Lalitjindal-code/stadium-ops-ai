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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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
        processParsedData(results.data as Record<string, unknown>[]);
      },
    });
  };

  const processParsedData = (data: Record<string, unknown>[]) => {
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
        timestamp: new Date(String(row.timestamp)).toISOString(),
      });
    }
    setParsedRows(validRows);
    setPreview(validRows.slice(0, 3));
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
      const res = await fetch(`${API_URL}/analysis/csv`, {
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
          const row = results.data[i] as Record<string, unknown>;
          validRows.push({
            gateId: String(row.gateId),
            count: Number(row.count),
            timestamp: new Date(String(row.timestamp)).toISOString(),
          });
        }
        setParsedRows(validRows);
        setPreview(validRows.slice(0, 3));
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
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <span className="text-[var(--accent-400)]">📊</span> Upload Crowd Data
          </h2>
          
          <div className="mb-3">
            <label htmlFor="csv-upload" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">Select CSV File</label>
            <div className="relative border-2 border-dashed border-[var(--bg-border)] hover:border-[var(--primary-400)] rounded-xl p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group">
              <input 
                id="csv-upload"
                type="file" 
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="text-[var(--text-tertiary)] mb-1 group-hover:scale-110 group-hover:text-[var(--primary-400)] transition-all duration-200" size={24} strokeWidth={1.5} />
              <span className="text-sm font-semibold text-[var(--text-primary)]">Choose CSV File</span>
              <span className="text-[10px] text-[var(--text-tertiary)] mt-0.5">or drag and drop it here</span>
            </div>
            <p className="mt-1.5 text-[10px] text-[var(--text-tertiary)] font-medium">Required headers: <code className="bg-[var(--bg-surface)] px-1 py-0.5 rounded text-[var(--text-secondary)] font-mono">gateId</code>, <code className="bg-[var(--bg-surface)] px-1 py-0.5 rounded text-[var(--text-secondary)] font-mono">count</code>, <code className="bg-[var(--bg-surface)] px-1 py-0.5 rounded text-[var(--text-secondary)] font-mono">timestamp</code></p>
          </div>

          {error && (
            <div className="mb-3 p-3 bg-[var(--risk-critical-bg)] text-[var(--risk-critical-text)] text-xs font-medium rounded-xl border border-[var(--risk-critical-border)] flex items-start gap-2 animate-pulse">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {preview.length > 0 && (
            <div className="mb-3">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">Data Preview ({parsedRows.length} total rows)</h3>
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

          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            <Button
              onClick={handleSubmit}
              disabled={parsedRows.length === 0}
              className="w-full sm:flex-1"
            >
              Run AI Analysis
            </Button>
            <Button
              variant="secondary"
              onClick={handleUseSampleData}
              className="w-full sm:flex-1"
            >
              Use Sample Data
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
