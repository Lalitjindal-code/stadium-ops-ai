"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";
import { VolunteerHeader } from "@/components/layout";
import { Badge, Button } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { Clock, MapPin, CheckCircle, AlertTriangle, Hourglass } from "lucide-react";

interface TaskCardProps {
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  location: string;
  eta: string;
  actionLabel?: string;
  disabled?: boolean;
  onAction: () => void;
}

function TaskCard({ priority, title, description, location, eta, actionLabel = "Acknowledge", disabled = false, onAction }: TaskCardProps) {
  const priorityConfig = {
    high: {
      variant: "critical" as const,
      label: "High Priority",
      border: "rgba(255,51,88,0.25)",
      bg: "rgba(255,51,88,0.04)",
      accentColor: "var(--neon-red)",
      icon: <AlertTriangle size={12} />,
    },
    medium: {
      variant: "medium" as const,
      label: "Medium Priority",
      border: "rgba(245,158,11,0.25)",
      bg: "rgba(245,158,11,0.04)",
      accentColor: "var(--neon-amber)",
      icon: <Hourglass size={12} />,
    },
    low: {
      variant: "safe" as const,
      label: "Low Priority",
      border: "rgba(0,255,135,0.2)",
      bg: "rgba(0,255,135,0.03)",
      accentColor: "var(--neon-green)",
      icon: <CheckCircle size={12} />,
    },
  };

  const cfg = priorityConfig[priority];

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden transition-all duration-200 animate-fade-in-up ${disabled ? 'opacity-50' : ''}`}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: disabled ? 'none' : `0 0 0 1px ${cfg.border}, 0 4px 16px rgba(0,0,0,0.5)`,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 0 0 1px ${cfg.border}, 0 8px 24px rgba(0,0,0,0.6), 0 0 30px ${cfg.bg}`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = disabled ? 'none' : `0 0 0 1px ${cfg.border}, 0 4px 16px rgba(0,0,0,0.5)`;
      }}
    >
      {/* Top accent line */}
      <div className="h-0.5" style={{ background: cfg.accentColor, opacity: 0.6 }} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Badge variant={cfg.variant} label={cfg.label} size="sm" />
          <div className="flex items-center gap-1.5 text-[var(--text-tertiary)]">
            <Clock size={11} />
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">{eta}</span>
          </div>
        </div>

        {/* Content */}
        <h3 className="font-display font-bold text-[var(--text-primary)] text-base mb-2 leading-tight">{title}</h3>
        <p className="text-[var(--text-secondary)] text-xs leading-relaxed flex-1 mb-4">{description}</p>

        {/* Footer */}
        <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5">
            <MapPin size={11} style={{ color: cfg.accentColor }} />
            <div>
              <p className="text-[9px] font-bold text-[var(--text-disabled)] uppercase tracking-wider">Location</p>
              <p className="font-bold text-xs mt-0.5" style={{ color: cfg.accentColor }}>{location}</p>
            </div>
          </div>
          {disabled ? (
            <Badge variant="info" label="Standby" size="sm" />
          ) : (
            <Button
              variant={priority === 'high' ? 'danger' : 'secondary'}
              size="sm"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VolunteerDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await auth.signOut();
    Cookies.remove("role");
    Cookies.remove("authToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
      {/* Mesh bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'rgba(0,255,135,0.04)' }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-[100px]" style={{ background: 'rgba(0,212,255,0.04)' }} />
      </div>

      <VolunteerHeader onLogout={handleLogout} />

      <main className="relative z-10 flex-1 p-5 md:p-7 max-w-6xl mx-auto w-full">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="text-[var(--neon-green)]">●</span>
              Active Assignments
            </h2>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">3 tasks assigned · FIFA 2026 Match Day</p>
          </div>
          <Badge variant="safe" label="On Duty" size="md" pulse />
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Tasks Today', value: '3', color: 'var(--neon-blue)' },
            { label: 'Completed', value: '0', color: 'var(--neon-green)' },
            { label: 'Critical', value: '1', color: 'var(--neon-red)' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3 text-center"
              style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="font-display font-bold text-lg" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Task cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          <TaskCard
            priority="high"
            title="Crowd Control Assistance"
            description="Assist with diverting crowd flow away from North entrance to mitigate critical crowding. Immediate action required."
            location="Gate A (North)"
            eta="ETA: 5 min"
            actionLabel="Acknowledge"
            onAction={() => toast("success", "Task acknowledged. Headquarters notified.")}
          />
          <TaskCard
            priority="medium"
            title="Information Desk"
            description="Guide VIPs and hospitality guests to their designated parking zones and premium seating areas."
            location="VIP Zone B"
            eta="ETA: 15 min"
            actionLabel="Start Task"
            onAction={() => toast("success", "Task started. Good luck!")}
          />
          <TaskCard
            priority="low"
            title="Standby Support"
            description="Remain on standby at the primary hub for incoming deployment orders from command center."
            location="Volunteer Hub 1"
            eta="ETA: 30 min"
            disabled
            onAction={() => {}}
          />
        </div>
      </main>
    </div>
  );
}
