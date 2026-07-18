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
        dot: "bg-[var(--bg-elevated)] border-[var(--risk-critical)] text-[var(--risk-critical)] shadow-[0_0_8px_var(--risk-critical)]",
        bg: "bg-[var(--risk-critical)]/5 hover:bg-[var(--risk-critical)]/10 border-[var(--risk-critical)]/30",
        text: "text-[var(--risk-critical-text)]",
        icon: <AlertCircle size={14} className="text-[var(--risk-critical)] shrink-0" />,
        label: "CRITICAL ALERT"
      };
      case "warning": return {
        dot: "bg-[var(--bg-elevated)] border-[var(--risk-high)] text-[var(--risk-high)] shadow-[0_0_8px_var(--risk-high)]",
        bg: "bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border-[var(--risk-high)]/30",
        text: "text-[var(--text-primary)]",
        icon: <AlertTriangle size={14} className="text-[var(--risk-high)] shrink-0" />,
        label: "WARNING"
      };
      case "success": return {
        dot: "bg-[var(--bg-elevated)] border-[var(--risk-safe)] text-[var(--risk-safe)] shadow-[0_0_8px_var(--risk-safe)]",
        bg: "bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border-[var(--bg-border)]",
        text: "text-[var(--text-primary)]",
        icon: <CheckCircle2 size={14} className="text-[var(--risk-safe)] shrink-0" />,
        label: "SYSTEM ACTION"
      };
      default: return {
        dot: "bg-[var(--bg-elevated)] border-[var(--primary-400)] text-[var(--primary-400)] shadow-[0_0_8px_var(--primary-400)]",
        bg: "bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border-[var(--bg-border)]",
        text: "text-[var(--text-primary)]",
        icon: <Info size={14} className="text-[var(--primary-400)] shrink-0" />,
        label: "INFORMATION"
      };
    }
  };

  const getMockMetadata = (id: string) => {
    const num = parseInt(id) || 1;
    return {
      operator: num % 2 === 0 ? "System Auto" : "admin@ops",
      source: num % 3 === 0 ? "Gemini 2.0 Flash" : "Ops Engine"
    };
  };

  return (
    <div className="bg-[var(--bg-elevated)] p-6 rounded-2xl border border-[var(--bg-border)] shadow-sm flex flex-col flex-1 min-h-[320px]">
      <div className="flex justify-between items-center border-b border-[var(--bg-border)] pb-4 mb-4">
        <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Zap className="text-[var(--accent-400)]" size={20} />
          <span>AI Activity Feed</span>
        </h2>
      </div>
      
      <div className="relative flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Continuous Timeline Line behind nodes */}
        <div className="absolute left-[13px] top-2 bottom-0 w-px bg-[var(--bg-border)] z-0" />
        
        <div className="space-y-4 relative z-10 pb-2">
          {events.map((event) => {
            const styles = getEventStyles(event.type);
            const meta = getMockMetadata(event.id);
            return (
              <div key={event.id} className="relative pl-9 flex flex-col group">
                {/* Semantic Timeline Node */}
                <div className={`absolute left-[5px] top-2.5 w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 transition-colors z-20 ${styles.dot}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
                
                {/* Event Card */}
                <div className={`p-3 rounded-lg border transition-all duration-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md ${styles.bg}`}>
                  
                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                      {styles.icon}
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{styles.label}</span>
                    </div>
                    <span className="font-mono text-[10px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-base)] px-1.5 py-0.5 rounded border border-[var(--bg-border)]/50">{event.time}</span>
                  </div>
                  
                  {/* Body */}
                  <p className={`text-xs font-medium leading-relaxed mb-3 ${styles.text}`}>
                    {event.message}
                  </p>
                  
                  {/* Footer / Metadata */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--bg-border)]/50 text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span className="opacity-50">ID:</span>
                      <span className="font-mono text-[var(--text-secondary)]">EVT-{event.id.padStart(4, '0')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="opacity-50">OP:</span>
                      <span className="text-[var(--text-secondary)]">{meta.operator}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="opacity-50">AI:</span>
                      <span className="text-[var(--accent-400)]">{meta.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {events.length === 0 && <p className="text-[var(--text-tertiary)] text-sm text-center py-10 italic relative z-20">No recent activity.</p>}
      </div>
    </div>
  );
}
