import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Radio } from 'lucide-react';
import { Badge, Button } from '@/components/ui';

export interface VolunteerHeaderProps {
  onLogout?: () => void;
}

export default function VolunteerHeader({ onLogout }: VolunteerHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 flex justify-between items-center px-5 py-3 relative"
      style={{
        background: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bg-border)',
        boxShadow: '0 1px 0 rgba(212,175,55,0.05), 0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      {/* Bottom scan-line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), rgba(249,229,150,0.3), transparent)' }}
      />

      {/* Left — Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <Radio size={16} style={{ color: 'var(--primary-400)' }} />
        </div>
        <div>
          <h1 className="font-display text-sm font-bold text-[var(--text-primary)] leading-none tracking-tight">
            Volunteer Portal
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1 h-1 rounded-full bg-[var(--primary-400)]" style={{ boxShadow: '0 0 4px var(--primary-400)' }} />
            <p className="text-[10px] text-[var(--primary-300)] font-bold tracking-[0.1em] uppercase">FIFA 2026</p>
          </div>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2.5">
        <Link href="/volunteer/report">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<AlertTriangle size={13} />}
            className="hidden sm:inline-flex"
          >
            Report Incident
          </Button>
        </Link>
        <Badge variant="safe" label="On Duty" size="sm" />
        <Button variant="ghost" size="sm" onClick={onLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
