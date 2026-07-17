"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import Cookies from "js-cookie";
import { CrowdDataRow, AnalysisResult } from "@/types";

interface DataUploadFormProps {
  onAnalysisComplete: (data: AnalysisResult) => void;
}

export default function DataUploadForm({ onAnalysisComplete }: DataUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
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
    
    setFile(selected);
    
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
        
        const rows = results.data as Record<string, unknown>[];
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
    <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Upload Crowd Data</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File</label>
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <p className="mt-1 text-xs text-gray-500">Required headers: gateId, count, timestamp</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      {preview.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Data Preview ({parsedRows.length} total rows)</h3>
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Gate ID</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Count</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {preview.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">{row.gateId}</td>
                    <td className="px-4 py-2">{row.count}</td>
                    <td className="px-4 py-2">{new Date(row.timestamp).toLocaleString()}</td>
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
        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Running Rule-based Analysis...
          </span>
        ) : (
          "Run AI Analysis"
        )}
      </button>
    </div>
  );
}
