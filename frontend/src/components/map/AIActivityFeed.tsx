import React from "react";
import { Zap, AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";

interface ActivityEvent {
  id: string;
  time: string;
  message: string;
  type: "info" | "warning" | "success" | "critical";
}

interface Props {
  events: ActivityEvent[];
}

export default function AIActivityFeed({ events }: Props) {
  const getEventStyles = (type: string) => {
    switch(type) {
      case "critical": return {
        bg: "bg-[var(--risk-critical)]/10",
        border: "border-l-[var(--risk-critical)]",
        text: "text-[var(--risk-critical-text)]",
        icon: <AlertCircle size={14} className="text-[var(--risk-critical)] shrink-0 mt-0.5" />
      };
      case "warning": return {
        bg: "bg-[var(--risk-high)]/10",
        border: "border-l-[var(--risk-high)]",
        text: "text-[var(--risk-high-text)]",
        icon: <AlertTriangle size={14} className="text-[var(--risk-high)] shrink-0 mt-0.5" />
      };
      case "success": return {
        bg: "bg-[var(--risk-safe)]/10",
        border: "border-l-[var(--risk-safe)]",
        text: "text-[var(--risk-safe-text)]",
        icon: <CheckCircle2 size={14} className="text-[var(--risk-safe)] shrink-0 mt-0.5" />
      };
      default: return {
        bg: "bg-[var(--primary-500)]/10",
        border: "border-l-[var(--primary-500)]",
        text: "text-[var(--primary-200)]",
        icon: <Info size={14} className="text-[var(--primary-400)] shrink-0 mt-0.5" />
      };
    }
  };

  return (
    <div className="bg-[var(--bg-elevated)] p-5 rounded-xl border border-[var(--bg-border)] shadow-xs mt-6 h-72 flex flex-col">
      <h2 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--bg-border)] pb-3.5 mb-4 flex items-center gap-2">
        <Zap className="text-[var(--accent-400)]" size={18} />
        <span>AI Activity Feed</span>
      </h2>
      <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {events.map(event => {
          const styles = getEventStyles(event.type);
          return (
            <div key={event.id} className={`p-3 border-l-3 rounded-lg border border-[var(--bg-border)] shadow-xs text-xs leading-relaxed flex items-start gap-2.5 ${styles.bg} ${styles.border}`}>
              {styles.icon}
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-[10px] text-[var(--text-tertiary)]">{event.time}</span>
                <span className={`font-medium ${styles.text}`}>{event.message}</span>
              </div>
            </div>
          );
        })}
        {events.length === 0 && <p className="text-[var(--text-tertiary)] text-xs text-center py-8">No recent activity.</p>}
      </div>
    </div>
  );
}
