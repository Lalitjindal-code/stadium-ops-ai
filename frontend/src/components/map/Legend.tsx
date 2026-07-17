import React from "react";
import Image from "next/image";
import { Layers } from "lucide-react";

export default function Legend() {
  return (
    <div className="absolute bottom-6 left-6 bg-[var(--bg-elevated)] p-4 rounded-xl shadow-lg border border-[var(--bg-border)] text-xs z-10 w-48 text-[var(--text-secondary)]">
      <h3 className="font-bold mb-3 border-b border-[var(--bg-border)] pb-2 flex items-center gap-2 text-[var(--text-primary)]">
        <Layers size={14} className="text-[var(--text-tertiary)]" />
        Map Legend
      </h3>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-[var(--risk-safe)] shadow-[0_0_8px_var(--risk-safe)] opacity-80"></div> Safe Gate</div>
        <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-[var(--risk-high)] shadow-[0_0_8px_var(--risk-high)] opacity-80"></div> Moderate Gate</div>
        <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-[var(--risk-critical)] shadow-[0_0_8px_var(--risk-critical)] opacity-80"></div> Critical Gate</div>
        <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-400)] shadow-[0_0_8px_var(--primary-400)] opacity-80"></div> Volunteer</div>
        <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] opacity-80"></div> Medical</div>
        <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] opacity-80"></div> Security</div>
        <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] opacity-80"></div> Traffic</div>
        <div className="flex items-center gap-2.5 text-[var(--risk-critical-text)] font-medium">
          <Image src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-error.png" alt="incident" width={12} height={16} className="w-3 h-4 drop-shadow-md filter brightness-110" /> 
          Incident
        </div>
      </div>
    </div>
  );
}
