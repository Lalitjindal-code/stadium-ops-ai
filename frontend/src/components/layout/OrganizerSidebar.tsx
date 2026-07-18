"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Map as MapIcon, Zap, Users, Clock, Settings,
  Shield, Wifi, Activity
} from 'lucide-react';

export default function OrganizerSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard',          path: '/organizer',             icon: LayoutDashboard, color: 'var(--primary-400)' },
    { name: 'Operations Map',     path: '/organizer/map',         icon: MapIcon,         color: 'var(--primary-400)' },
    { name: 'Scenario Simulator', path: '/organizer/scenario',    icon: Zap,             color: 'var(--primary-500)' },
    { name: 'Resource Optimizer', path: '/organizer/assignments', icon: Users,           color: 'var(--primary-400)' },
    { name: 'Activity Timeline',  path: '/organizer/timeline',    icon: Clock,           color: 'var(--primary-500)' },
    { name: 'Settings',           path: '/organizer/settings',    icon: Settings,        color: 'var(--text-tertiary)' },
  ];

  return (
      <aside
      className="flex flex-col h-full shrink-0"
      style={{
        width: 'var(--sidebar-width)',
        background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-base) 100%)',
        borderRight: '1px solid var(--bg-border)',
      }}
    >
      {/* ── Logo ── */}
      <div className="px-5 py-6 border-b border-[var(--bg-border)]">
        <div className="flex items-center gap-3.5">
          {/* SVG Shield Icon */}
          <div className="relative flex-shrink-0 scale-90">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path
                d="M17 2L4 8v10c0 8.5 5.5 14.5 13 17 7.5-2.5 13-8.5 13-17V8L17 2Z"
                fill="url(#shieldGrad)"
                opacity="0.9"
              />
              <path
                d="M17 2L4 8v10c0 8.5 5.5 14.5 13 17 7.5-2.5 13-8.5 13-17V8L17 2Z"
                fill="none"
                stroke="var(--primary-400)"
                strokeWidth="1.5"
                opacity="0.5"
              />
              <text x="17" y="22" textAnchor="middle" fontSize="11" fill="var(--primary-300)" fontWeight="bold">VIP</text>
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-400)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--primary-700)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
            {/* Live pulse indicator */}
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5">
              <div className="absolute inset-0 rounded-full bg-[var(--primary-400)] animate-ping opacity-60" />
              <div className="relative w-2.5 h-2.5 rounded-full bg-[var(--primary-400)] border border-[var(--bg-surface)]" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-[var(--text-primary)] leading-none tracking-tight">
              Stadium Ops
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1 h-1 rounded-full bg-[var(--gold)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--gold)] opacity-80">
                FIFA 2026 Edition
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1.5 custom-scrollbar">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-disabled)] px-3 pt-3 pb-3">
          Command Operations
        </p>
        {links.map((link) => {
          const isActive = pathname === link.path;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.path}
              className="group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden"
              style={{
                background: isActive
                  ? `linear-gradient(90deg, ${link.color}18 0%, transparent 100%)`
                  : 'transparent',
                borderLeft: isActive ? `2px solid ${link.color}` : '2px solid transparent',
                marginLeft: '0px',
              }}
            >
              {/* Active glow bg */}
              {isActive && (
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 0% 50%, ${link.color} 0%, transparent 60%)` }}
                />
              )}
              {/* Icon */}
              <div
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{
                  background: isActive ? `${link.color}22` : 'transparent',
                  color: isActive ? link.color : 'var(--text-tertiary)',
                }}
              >
                <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              <span
                className="font-medium text-sm transition-colors duration-150"
                style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                {link.name}
              </span>
              {/* Hover indicator */}
              {!isActive && (
                <div
                  className="absolute right-3 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: link.color }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── System Status (Compact) ── */}
      <div className="p-4 border-t border-[var(--bg-border)] bg-[var(--bg-base)]">
        <div className="flex items-center justify-between bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl p-3 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="group relative flex items-center justify-center">
              <Activity size={14} className="text-[var(--primary-400)] transition-transform group-hover:scale-110" />
              <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--primary-400)] shadow-[0_0_6px_var(--primary-400)]" />
            </div>
            <div className="group relative flex items-center justify-center">
              <Wifi size={14} className="text-[var(--primary-400)] transition-transform group-hover:scale-110" />
              <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--primary-400)] shadow-[0_0_6px_var(--primary-400)] opacity-70" />
            </div>
            <div className="group relative flex items-center justify-center">
              <Shield size={14} className="text-[var(--primary-400)] transition-transform group-hover:scale-110" />
              <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--primary-400)] shadow-[0_0_6px_var(--primary-400)] opacity-90" />
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-[var(--primary-400)] font-bold tracking-wider leading-none">SYSTEM LIVE</span>
            <span className="text-[8px] font-mono text-[var(--text-disabled)] tracking-widest mt-1">v2.0.4</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
