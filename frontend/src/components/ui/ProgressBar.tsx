"use client";

import React from 'react';

interface ProgressBarProps {
  value: number; // 0–100
  color?: 'blue' | 'violet' | 'green' | 'amber' | 'red' | 'gold' | 'accent';
  height?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const colorMap: Record<string, { from: string; to: string; glow: string }> = {
  blue:   { from: '#00D4FF', to: '#0090B5', glow: 'rgba(0,212,255,0.4)' },
  violet: { from: '#8B5CF6', to: '#6D28D9', glow: 'rgba(139,92,246,0.4)' },
  green:  { from: '#00FF87', to: '#00C96A', glow: 'rgba(0,255,135,0.4)' },
  amber:  { from: '#FFB800', to: '#CC9200', glow: 'rgba(255,184,0,0.4)' },
  red:    { from: '#FF3358', to: '#CC1F40', glow: 'rgba(255,51,88,0.4)' },
  gold:   { from: '#F5C518', to: '#C49D10', glow: 'rgba(245,197,24,0.4)' },
  accent: { from: '#00D4FF', to: '#8B5CF6', glow: 'rgba(0,212,255,0.3)' },
};

const heightMap = { xs: '3px', sm: '5px', md: '8px' };

export default function ProgressBar({
  value,
  color = 'blue',
  height = 'sm',
  showLabel = false,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const clamp = Math.min(100, Math.max(0, value));
  const col = colorMap[color];
  const h = heightMap[height];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-mono text-[var(--text-tertiary)]">{Math.round(clamp)}%</span>
        </div>
      )}
      <div
        className="w-full overflow-hidden rounded-full relative"
        style={{
          height: h,
          background: 'rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            width: `${clamp}%`,
            background: `linear-gradient(90deg, ${col.from} 0%, ${col.to} 100%)`,
            boxShadow: `0 0 10px ${col.glow}, 0 0 3px ${col.glow}`,
            transition: animated ? 'width 0.8s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}
        >
          {/* Shimmer sweep */}
          {animated && clamp > 10 && (
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`,
                backgroundSize: '200% 100%',
              }}
            />
          )}
          {/* Leading bright tip */}
          <div
            className="absolute right-0 top-0 bottom-0 w-4 rounded-full"
            style={{
              background: `radial-gradient(circle at right, ${col.from} 0%, transparent 100%)`,
              filter: 'blur(2px)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
