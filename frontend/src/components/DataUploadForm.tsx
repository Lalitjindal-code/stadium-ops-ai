"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import Cookies from "js-cookie";
import { CrowdDataRow, AnalysisResult } from "@/types";

interface DataUploadFormProps {
  onAnalysisComplete: (data: AnalysisResult) => void;
}

export default function DataUploadForm({ onAnalysisComplete }: DataUploadFormProps) {
  const [preview, setPreview] = useState<CrowdDataRow[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedRows, setParsedRows] = useState<CrowdDataRow[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    if (selected.type !== "text/csv" && !selected.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }
    
    // Parse CSV to preview and validate
    Papa.parse(selected, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`CSV Parsing Error: ${results.errors[0].message}`);
          return;
        }
        
        const rows = results.data as any[];
        // Validate fixed schema: gateId, count, timestamp
        const validRows = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
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
        setPreview(validRows.slice(0, 5)); // Preview first 5
      },
    });
  };

  const handleSubmit = async () => {
    if (parsedRows.length === 0) {
      setError("No valid data to analyze.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const token = Cookies.get("authToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analysis/csv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rows: parsedRows }),
      });
      
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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
      <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
        <span>📊</span> Upload Crowd Data
      </h2>
      
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Select CSV File</label>
        <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-500/50 rounded-2xl p-6 bg-slate-50/50 hover:bg-indigo-50/10 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group">
          <input 
            type="file" 
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="text-3xl mb-2 filter drop-shadow-xs group-hover:scale-110 transition-transform duration-200">📥</span>
          <span className="text-sm font-semibold text-slate-700">Choose CSV File</span>
          <span className="text-xs text-slate-400 mt-1">or drag and drop it here</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-400 font-medium">Required headers: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">gateId</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">count</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">timestamp</code></p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200/50 flex items-start gap-2 animate-pulse">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {preview.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">Data Preview ({parsedRows.length} total rows)</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold text-slate-500">Gate ID</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-slate-500">Count</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-slate-500">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                {preview.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-slate-700">{row.gateId}</td>
                    <td className="px-4 py-2.5">{row.count}</td>
                    <td className="px-4 py-2.5">{new Date(row.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || parsedRows.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-xs hover:shadow-md hover:shadow-indigo-500/10 active:scale-[0.99] disabled:opacity-40 disabled:hover:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed transition-all duration-150 flex justify-center items-center cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Running Gemini AI Analysis...
          </span>
        ) : (
          "Run AI Analysis"
        )}
      </button>
    </div>
  );
}
