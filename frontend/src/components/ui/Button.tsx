import React from 'react';
import { Spinner } from './index'; // assuming barrel export

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs h-8',
    md: 'px-5 py-3 text-sm h-10',
    lg: 'px-6 py-3.5 text-sm h-12',
  };

  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-400 text-white',
    secondary:
      'bg-transparent border border-[var(--bg-border)] text-[var(--text-secondary)] hover:border-[var(--bg-border-hover)] hover:text-[var(--text-primary)]',
    danger:
      'bg-[var(--risk-critical-bg)] border border-[var(--risk-critical-border)] text-[var(--risk-critical-text)] hover:brightness-110',
    ghost:
      'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      className={classes.trim()}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size === 'lg' ? 'md' : 'sm'} color="accent" />
          {loadingText || children}
        </>
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
