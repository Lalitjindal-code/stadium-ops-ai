import React from 'react';
import { Building2 } from 'lucide-react';
import { Badge, Button } from '@/components/ui';

export interface VolunteerHeaderProps {
  onLogout?: () => void;
}

export default function VolunteerHeader({ onLogout }: VolunteerHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-surface)] border-b border-[var(--bg-border)] px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Building2 className="text-[var(--primary-400)]" size={24} strokeWidth={1.5} />
        <div>
          <h1 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
            Volunteer Portal
          </h1>
          <p className="text-[10px] text-[var(--text-tertiary)] font-bold tracking-wider uppercase">
            FIFA 2026
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="safe" label="On Duty" size="sm" showIcon={false} />
        <Button variant="ghost" size="sm" onClick={onLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
