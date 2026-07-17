"use client";

import React, { useEffect, useState } from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  color?: 'primary' | 'accent' | 'safe' | 'warning' | 'critical';
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md';
  animated?: boolean;
}

export default function ProgressBar({
  value,
  color = 'primary',
  showLabel = false,
  label,
  size = 'md',
  animated = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [animated, value]);

  const sizeClasses = {
    sm: '4px',
    md: '8px',
  };

  const colorTokens = {
    primary: 'var(--primary-500)',
    accent: 'var(--accent-500)',
    safe: 'var(--risk-safe)',
    warning: 'var(--risk-medium)',
    critical: 'var(--risk-critical)',
  };

  const displayLabel = label || `${value}%`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`} {...props}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel || displayLabel}
        className="w-full"
        style={{
          background: 'var(--bg-muted)',
          borderRadius: 'var(--radius-full)',
          height: sizeClasses[size],
        }}
      >
        <div
          style={{
            width: `${displayValue}%`,
            backgroundColor: colorTokens[color],
            borderRadius: 'inherit',
            height: '100%',
            transition: 'width 600ms var(--ease-decel)',
          }}
        />
      </div>
      {showLabel && (
        <div className="font-mono text-sm text-[var(--text-secondary)] text-right">
          {displayLabel}
        </div>
      )}
    </div>
  );
}
