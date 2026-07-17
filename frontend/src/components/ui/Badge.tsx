import React from 'react';
import { ShieldAlert, AlertOctagon, AlertTriangle, ShieldCheck, Info, Sparkles } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: 'critical' | 'high' | 'medium' | 'safe' | 'info' | 'ai';
  label: string;
  showIcon?: boolean;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

export default function Badge({
  variant,
  label,
  showIcon = true,
  pulse = false,
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 border rounded-full font-semibold';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantMap = {
    critical: {
      classes: 'bg-[var(--risk-critical-bg)] border-[var(--risk-critical-border)] text-[var(--risk-critical-text)]',
      icon: ShieldAlert,
    },
    high: {
      classes: 'bg-[var(--risk-high-bg)] border-[var(--risk-high-border)] text-[var(--risk-high-text)]',
      icon: AlertOctagon,
    },
    medium: {
      classes: 'bg-[var(--risk-medium-bg)] border-[var(--risk-medium-border)] text-[var(--risk-medium-text)]',
      icon: AlertTriangle,
    },
    safe: {
      classes: 'bg-[var(--risk-safe-bg)] border-[var(--risk-safe-border)] text-[var(--risk-safe-text)]',
      icon: ShieldCheck,
    },
    info: {
      classes: 'bg-[var(--info-bg)] border-[var(--info-border)] text-[var(--info-text)]',
      icon: Info,
    },
    ai: {
      classes: 'bg-[var(--accent-glow)] border-[var(--accent-500)] text-[var(--accent-300)]',
      icon: Sparkles,
    },
  };

  const { classes: variantClasses, icon: Icon } = variantMap[variant];
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses} ${className}`;
  const ariaLabel = props['aria-label'] || `Risk level: ${label}`;

  const badgeContent = (
    <span
      role="status"
      aria-label={ariaLabel}
      className={classes.trim()}
      {...props}
    >
      {showIcon && <Icon size={size === 'md' ? 14 : 12} aria-hidden="true" />}
      {label}
    </span>
  );

  if (pulse && variant === 'critical') {
    return (
      <span className="relative inline-flex">
        {badgeContent}
        <span
          className="animate-pulse-ring absolute inset-0 rounded-full pointer-events-none"
          style={{ color: 'var(--risk-critical)' }}
          aria-hidden="true"
        />
      </span>
    );
  }

  return badgeContent;
}
