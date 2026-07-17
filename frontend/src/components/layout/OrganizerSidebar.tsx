"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map as MapIcon, Zap, Users, Clock, Settings } from 'lucide-react';

export default function OrganizerSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', path: '/organizer', icon: LayoutDashboard },
    { name: 'Operations Map', path: '/organizer/map', icon: MapIcon },
    { name: 'Scenario Simulator', path: '/organizer/scenario', icon: Zap },
    { name: 'Resource Optimizer', path: '/organizer/assignments', icon: Users },
    { name: 'Activity Timeline', path: '/organizer/timeline', icon: Clock },
    { name: 'Settings', path: '/organizer/settings', icon: Settings },
  ];

  return (
    <aside className="w-[var(--sidebar-width)] bg-[var(--bg-surface)] border-r border-[var(--bg-border)] flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-[var(--bg-border)]">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
          <span className="text-[var(--accent-500)]">🏟️</span> Stadium Ops
        </h2>
        <p className="text-xs text-[var(--text-tertiary)] mt-1 uppercase tracking-wider font-semibold">
          FIFA 2026 Edition
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.path;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 border-l-[3px] ${
                isActive
                  ? 'bg-[var(--primary-700)] bg-opacity-30 border-[var(--primary-400)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] border-transparent'
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-[var(--bg-border)]">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)] mb-4">
          System Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--risk-safe)] shadow-[var(--shadow-glow-green)]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">AI Engine Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--risk-safe)] shadow-[var(--shadow-glow-green)]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">Firebase Connected</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">32ms</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
