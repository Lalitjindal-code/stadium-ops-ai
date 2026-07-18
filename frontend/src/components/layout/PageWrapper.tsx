"use client";

import React from 'react';
interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageWrapper({
  children,
  title,
  subtitle,
  actions,
  className = '',
}: PageWrapperProps) {
  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-[var(--bg-base)]">
      {/* ── Sticky Header ── */}
      {(title || actions) && (
        <header
          className="flex-shrink-0 flex items-center justify-between px-6 bg-[var(--bg-base)] border-b border-[var(--bg-border)] relative z-20"
          style={{
            height: 'var(--header-height)',
          }}
        >
          {/* Title block */}
          <div className="flex items-center gap-3">
            {/* Minimal static indicator */}
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-400)]" />
            
            <div className="flex flex-col justify-center">
              <h1 className="text-base font-bold text-[var(--text-primary)] leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </header>
      )}

      {/* ── Page Content ── */}
      <main
        className={`flex-1 overflow-y-auto p-6 relative ${className}`}
      >
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
