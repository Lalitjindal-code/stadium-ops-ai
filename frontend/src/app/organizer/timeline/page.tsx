"use client";

import React from "react";
import { PageWrapper } from "@/components/layout";
import { Badge } from "@/components/ui";
import { Brain, Users, Zap, AlertTriangle, CheckCircle, DoorOpen, Shield } from "lucide-react";

type TimelineEvent = {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: "ai" | "assignment" | "scenario" | "incident" | "gate" | "system";
  source: string;
  operator?: string;
  model?: string;
};

const MOCK_EVENTS: TimelineEvent[] = [
  {
    id: "evt-001",
    timestamp: "18:42:15",
    title: "AI Analysis Completed",
    description: "Generated 4 optimization recommendations based on crowd surge data at North Concourse.",
    type: "ai",
    source: "Automated Routine",
    model: "Gemini 2.0 Flash",
  },
  {
    id: "evt-002",
    timestamp: "18:35:02",
    title: "Volunteer Reassigned",
    description: "2 volunteers moved from South Concourse to Gate A (North) to manage bottleneck.",
    type: "assignment",
    source: "Manual Intervention",
    operator: "admin@stadium.ops",
  },
  {
    id: "evt-003",
    timestamp: "18:15:44",
    title: "Scenario Simulation Run",
    description: "Simulated Heavy Rain + Sudden Crowd Surge. Estimated impact: Critical.",
    type: "scenario",
    source: "Predictive Module",
    model: "Gemini 2.0 Pro",
  },
  {
    id: "evt-004",
    timestamp: "18:05:10",
    title: "Gate Status Changed",
    description: "Gate D switched to Entry Only mode to accelerate ingress.",
    type: "gate",
    source: "System Policy",
    operator: "Automated",
  },
  {
    id: "evt-005",
    timestamp: "17:50:22",
    title: "Incident Reported",
    description: "Medical incident reported near VIP Entrance. Medics dispatched immediately.",
    type: "incident",
    source: "Field App",
    operator: "vol-721",
  },
  {
    id: "evt-006",
    timestamp: "17:30:00",
    title: "System Online",
    description: "Stadium Operations AI dashboard initialized and modules loaded.",
    type: "system",
    source: "System Core",
  }
];

export default function TimelinePage() {
  const getEventStyles = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "ai": return {
        icon: <Brain size={14} className="text-[var(--accent-400)]" />,
        variant: "info" as const,
        glow: "border-[var(--accent-400)] bg-[var(--bg-elevated)]",
      };
      case "assignment": return {
        icon: <Users size={14} className="text-[var(--primary-400)]" />,
        variant: "info" as const,
        glow: "border-[var(--primary-400)] bg-[var(--bg-elevated)]",
      };
      case "scenario": return {
        icon: <Zap size={14} className="text-[var(--risk-medium)]" />,
        variant: "medium" as const,
        glow: "border-[var(--risk-medium)] bg-[var(--bg-elevated)]",
      };
      case "gate": return {
        icon: <DoorOpen size={14} className="text-[var(--primary-300)]" />,
        variant: "info" as const,
        glow: "border-[var(--primary-300)] bg-[var(--bg-elevated)]",
      };
      case "incident": return {
        icon: <AlertTriangle size={14} className="text-[var(--risk-critical)]" />,
        variant: "critical" as const,
        glow: "border-[var(--risk-critical)] shadow-[0_0_8px_var(--risk-critical)] bg-[var(--bg-elevated)]",
      };
      case "system": return {
        icon: <CheckCircle size={14} className="text-[var(--risk-safe)]" />,
        variant: "safe" as const,
        glow: "border-[var(--risk-safe)] bg-[var(--bg-elevated)]",
      };
      default: return {
        icon: <CheckCircle size={14} className="text-[var(--text-tertiary)]" />,
        variant: "info" as const,
        glow: "border-[var(--text-tertiary)] shadow-none bg-[var(--bg-elevated)]",
      };
    }
  };

  const totalEvents = MOCK_EVENTS.length;
  const criticalEvents = MOCK_EVENTS.filter(e => e.type === "incident").length;
  const warningEvents = MOCK_EVENTS.filter(e => e.type === "scenario").length;
  const aiEvents = MOCK_EVENTS.filter(e => e.type === "ai").length;

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-6 px-4">
        
        {/* Cleaner Minimal Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-[var(--bg-border)] pb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Activity Timeline</h1>
            <p className="text-sm text-[var(--text-secondary)]">Comprehensive audit log of system events and AI actions</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--bg-border)] px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold">Total</span>
              <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{totalEvents}</span>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--risk-critical)]/30 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-[11px] uppercase tracking-wider text-[var(--risk-critical)] font-bold">Critical</span>
              <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{criticalEvents}</span>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--risk-medium)]/30 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-[11px] uppercase tracking-wider text-[var(--risk-medium)] font-bold">Warnings</span>
              <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{warningEvents}</span>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--accent-400)]/30 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-[11px] uppercase tracking-wider text-[var(--accent-400)] font-bold">AI Actions</span>
              <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{aiEvents}</span>
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        {MOCK_EVENTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl border-dashed">
            <Shield size={48} className="text-[var(--text-tertiary)] mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-[var(--text-secondary)] mb-1">No Events Recorded</h3>
            <p className="text-sm text-[var(--text-tertiary)] text-center max-w-md">
              The activity timeline is currently empty.
            </p>
          </div>
        ) : (
          <div className="relative pb-10">
            {/* Continuous Vertical Rail centered inside left padding */}
            <div className="absolute left-[24px] top-4 bottom-0 w-[1px] bg-[var(--bg-border)]" />
            
            <div className="space-y-5">
              {MOCK_EVENTS.map((event) => {
                const styles = getEventStyles(event.type);
                
                return (
                  <div key={event.id} className="relative pl-[60px] group">
                    {/* Timeline Node - Centered on Rail */}
                    <div className={`absolute left-[10px] top-3 w-7 h-7 rounded-full flex items-center justify-center border z-10 transition-colors duration-300 ${styles.glow}`}>
                      {styles.icon}
                    </div>

                    {/* Event Card */}
                    <div className="bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--primary-400)]/50 transition-all duration-200 flex flex-col gap-2">
                      
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Badge variant={styles.variant} label={event.type.toUpperCase()} size="sm" showIcon={false} />
                          <h3 className="text-lg font-bold text-[var(--text-primary)]">
                            {event.title}
                          </h3>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-[var(--text-tertiary)] shrink-0 mt-1 sm:mt-0">
                          {event.timestamp}
                        </span>
                      </div>
                      
                      <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mt-1">
                        {event.description}
                      </p>
                      
                      {/* Metadata Row: 2-column responsive grid */}
                      <div className="mt-2 pt-3 border-t border-[var(--bg-border)]/50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
                        <div className="flex flex-col">
                          <span className="text-[var(--text-tertiary)] uppercase tracking-wider text-[10px]">Event ID</span>
                          <span className="font-mono text-[var(--text-secondary)]">{event.id}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[var(--text-tertiary)] uppercase tracking-wider text-[10px]">Source</span>
                          <span className="text-[var(--text-secondary)]">{event.source}</span>
                        </div>
                        {event.model && (
                          <div className="flex flex-col">
                            <span className="text-[var(--text-tertiary)] uppercase tracking-wider text-[10px]">AI Model</span>
                            <span className="text-[var(--accent-400)]">{event.model}</span>
                          </div>
                        )}
                        {event.operator && (
                          <div className="flex flex-col">
                            <span className="text-[var(--text-tertiary)] uppercase tracking-wider text-[10px]">Operator</span>
                            <span className="font-mono text-[var(--text-secondary)]">{event.operator}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

