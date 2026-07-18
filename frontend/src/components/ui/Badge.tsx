"use client";

import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'critical' | 'high' | 'medium' | 'safe' | 'info' | 'ai' | 'gold' | 'default';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  showIcon?: boolean;
}

const variantConfig = {
  critical: {
    bg:     'rgba(255,51,88,0.1)',
    border: 'rgba(255,51,88,0.2)',
    text:   '#FF8FA3',
    glow:   'rgba(255,51,88,0.2)',
    dot:    '#FF3358',
    icon:   '🔴',
  },
  high: {
    bg:     'rgba(255,184,0,0.1)',
    border: 'rgba(255,184,0,0.2)',
    text:   '#FFD166',
    glow:   'rgba(255,184,0,0.15)',
    dot:    '#FFB800',
    icon:   '🟡',
  },
  medium: {
    bg:     'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
    text:   '#FDE68A',
    glow:   'rgba(245,158,11,0.15)',
    dot:    '#F59E0B',
    icon:   '🟠',
  },
  safe: {
    bg:     'rgba(0,255,135,0.08)',
    border: 'rgba(0,255,135,0.2)',
    text:   '#6EFFC4',
    glow:   'rgba(0,255,135,0.15)',
    dot:    '#00FF87',
    icon:   '🟢',
  },
  info: {
    bg:     'rgba(0,212,255,0.08)',
    border: 'rgba(0,212,255,0.2)',
    text:   '#7FE8FF',
    glow:   'rgba(0,212,255,0.15)',
    dot:    '#00D4FF',
    icon:   '🔵',
  },
  ai: {
    bg:     'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.2)',
    text:   '#C4B5FD',
    glow:   'rgba(139,92,246,0.15)',
    dot:    '#8B5CF6',
    icon:   '✨',
  },
  gold: {
    bg:     'rgba(245,197,24,0.1)',
    border: 'rgba(245,197,24,0.2)',
    text:   '#F5C518',
    glow:   'rgba(245,197,24,0.15)',
    dot:    '#F5C518',
    icon:   '⭐',
  },
  default: {
    bg:     'rgba(139,159,196,0.1)',
    border: 'rgba(139,159,196,0.15)',
    text:   '#8B9FC4',
    glow:   'transparent',
    dot:    '#8B9FC4',
    icon:   '⚪',
  },
};

const sizeMap = {
  sm: { padding: '2px 8px', fontSize: '10px', gap: '5px', dotSize: '5px' },
  md: { padding: '3px 10px', fontSize: '11px', gap: '6px', dotSize: '6px' },
  lg: { padding: '5px 14px', fontSize: '13px', gap: '7px', dotSize: '7px' },
};

export default function Badge({ label, variant = 'default', size = 'sm', pulse = false, showIcon = false }: BadgeProps) {
  const cfg = variantConfig[variant];
  const sz = sizeMap[size];

  return (
    <span
      className="inline-flex items-center font-bold uppercase tracking-widest rounded-full relative"
      style={{
        padding: sz.padding,
        fontSize: sz.fontSize,
        gap: sz.gap,
        color: cfg.text,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: pulse ? `0 0 8px ${cfg.glow}` : 'none',
        letterSpacing: '0.08em',
      }}
    >
      {/* Dot indicator */}
      <span className="relative flex-shrink-0" style={{ width: sz.dotSize, height: sz.dotSize }}>
        {pulse && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: cfg.dot, opacity: 0.4 }}
          />
        )}
        <span
          className="relative block rounded-full"
          style={{
            width: sz.dotSize,
            height: sz.dotSize,
            background: cfg.dot,
            boxShadow: pulse ? `0 0 4px ${cfg.dot}` : 'none',
          }}
        />
      </span>
      {showIcon && <span>{cfg.icon}</span>}
      {label}
    </span>
  );
}
