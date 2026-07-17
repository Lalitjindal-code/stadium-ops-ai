import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Map, AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui";

const libraries: ("geometry" | "drawing" | "places" | "visualization")[] = ["geometry"];

export default function MapLoader({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[var(--bg-base)] text-[var(--text-secondary)] p-8 rounded-xl border border-[var(--bg-border)]">
        <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--bg-border)] max-w-md text-center shadow-md">
          <div className="w-12 h-12 bg-[var(--risk-high)]/10 text-[var(--risk-high)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--risk-high)]/20">
            <AlertTriangle size={24} />
          </div>
          <h2 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Map Configuration Error</h2>
          <p className="text-sm mb-4">Google Maps could not be loaded. This is likely due to a missing or invalid API key.</p>
          <div className="bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--bg-border)] text-xs font-mono text-[var(--text-tertiary)] text-left">
            <p>Error details: {loadError.message}</p>
            <p className="mt-2 text-[var(--primary-400)]">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[var(--bg-base)] rounded-xl animate-pulse border border-[var(--bg-border)] gap-4">
        <Map size={32} className="text-[var(--text-tertiary)] opacity-50" />
        <div className="flex items-center gap-3 text-[var(--text-secondary)] font-medium">
          <Spinner size="sm" />
          <span>Loading Map Assets...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
