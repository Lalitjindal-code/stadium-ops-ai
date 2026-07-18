import React, { useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Map, AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui";

const libraries: ("geometry" | "drawing" | "places" | "visualization")[] = ["geometry"];

export default function MapLoader({ children }: { children: React.ReactNode }) {
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    // Google Maps invokes this global callback on auth failure (billing, invalid key, etc)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gm_authFailure = () => {
      setAuthError(true);
    };
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (loadError || authError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[var(--bg-base)] text-[var(--text-secondary)] p-8">
        <div className="bg-[var(--bg-elevated)]/60 backdrop-blur-md p-10 rounded-2xl border border-[var(--bg-border)] max-w-lg text-center shadow-lg relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[var(--risk-critical)]/10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-[var(--bg-surface)] text-[var(--risk-critical)] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--bg-border)] shadow-sm">
              <AlertTriangle size={32} strokeWidth={1.5} />
            </div>
            
            <h2 className="font-bold text-xl mb-3 text-[var(--text-primary)]">Map Services Unavailable</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
              The spatial intelligence module cannot connect to the mapping provider. This is typically caused by a missing or invalid API configuration.
            </p>
            
            <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--bg-border)] text-xs text-left mb-6 shadow-inner">
              <p className="text-[var(--text-tertiary)] font-mono mb-2">Error Details: <span className="text-[var(--text-primary)]">{authError ? "API Authentication or Billing Failure" : loadError?.message}</span></p>
              <div className="mt-3 pt-3 border-t border-[var(--bg-border)]">
                <span className="block text-[var(--text-tertiary)] uppercase tracking-wider text-[10px] font-bold mb-1">Configuration Required</span>
                <code className="text-[var(--primary-400)] font-mono bg-[var(--bg-base)] px-2 py-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold py-3 px-4 rounded-xl border border-[var(--bg-border)] transition-colors duration-200 shadow-sm"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-center justify-center h-full bg-[var(--bg-base)] rounded-xl animate-pulse border border-[var(--bg-border)] gap-4">
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
