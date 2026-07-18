"use client";

import React from 'react';
import Spinner from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  loadingText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const sizeMap = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3.5 text-base rounded-xl',
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    overflow: 'hidden',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.5 : 1,
    whiteSpace: 'nowrap',
    letterSpacing: '0.01em',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0 0 20px rgba(0,212,255,0.2), 0 4px 12px rgba(0,0,0,0.4)',
    },
    secondary: {
      background: 'rgba(0,212,255,0.06)',
      color: 'var(--text-secondary)',
      border: '1px solid rgba(0,212,255,0.15)',
      boxShadow: 'none',
    },
    danger: {
      background: 'rgba(255,51,88,0.1)',
      color: 'var(--risk-critical-text)',
      border: '1px solid rgba(255,51,88,0.25)',
      boxShadow: '0 0 16px rgba(255,51,88,0.1)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
      boxShadow: 'none',
    },
    outline: {
      background: 'transparent',
      color: 'var(--neon-blue)',
      border: '1px solid rgba(0,212,255,0.35)',
      boxShadow: '0 0 12px rgba(0,212,255,0.08)',
    },
    neon: {
      background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(139,92,246,0.1) 100%)',
      color: 'var(--neon-blue)',
      border: '1px solid rgba(0,212,255,0.3)',
      boxShadow: '0 0 20px rgba(0,212,255,0.15), inset 0 1px 0 rgba(0,212,255,0.1)',
    },
  };

  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`${sizeMap[size]} ${fullWidth ? 'w-full' : ''} group ${className}`}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
      onMouseEnter={(e) => {
        if (isDisabled) return;
        const el = e.currentTarget;
        if (variant === 'primary') {
          el.style.transform = 'translateY(-1px) scale(1.01)';
          el.style.boxShadow = '0 0 30px rgba(0,212,255,0.3), 0 8px 20px rgba(0,0,0,0.4)';
        } else if (variant === 'secondary') {
          el.style.background = 'rgba(0,212,255,0.1)';
          el.style.borderColor = 'rgba(0,212,255,0.3)';
          el.style.color = 'var(--text-primary)';
        } else if (variant === 'ghost') {
          el.style.background = 'rgba(0,212,255,0.06)';
          el.style.color = 'var(--text-primary)';
        } else if (variant === 'outline' || variant === 'neon') {
          el.style.transform = 'translateY(-1px)';
          el.style.boxShadow = '0 0 30px rgba(0,212,255,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (isDisabled) return;
        const el = e.currentTarget;
        el.style.transform = '';
        Object.assign(el.style, variantStyles[variant]);
      }}
      onMouseDown={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
      }}
      onMouseUp={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      {...props}
    >
      {/* Shimmer overlay for primary */}
      {variant === 'primary' && !isDisabled && (
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {loading ? (
        <><Spinner size="sm" color="white" /> {loadingText ?? 'Loading…'}</>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
