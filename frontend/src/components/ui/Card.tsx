"use client";

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'accent' | 'glow' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accentColor?: string;
  noBorder?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  accentColor,
  noBorder = false,
  className = '',
  style,
  ...props
}: CardProps) {
  const paddingMap = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-7' };

  const baseStyle: React.CSSProperties = {
    borderRadius: '14px',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'var(--bg-surface)',
      border: noBorder ? 'none' : '1px solid var(--bg-border)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
    glass: {
      background: 'rgba(12,17,32,0.6)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: noBorder ? 'none' : '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
    },
    accent: {
      background: 'var(--bg-surface)',
      border: noBorder ? 'none' : '1px solid var(--bg-border)',
      borderLeft: `3px solid ${accentColor || 'var(--primary-400)'}`,
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
    glow: {
      background: 'var(--bg-surface)',
      border: noBorder ? 'none' : `1px solid ${accentColor || 'rgba(0,212,255,0.2)'}`,
      boxShadow: `0 0 15px ${accentColor || 'rgba(0,212,255,0.1)'}, 0 2px 8px rgba(0,0,0,0.15)`,
    },
    flat: {
      background: 'var(--bg-elevated)',
      border: noBorder ? 'none' : '1px solid var(--bg-border)',
    },
  };

  return (
    <div
      className={`${paddingMap[padding]} card-3d ${className}`}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
