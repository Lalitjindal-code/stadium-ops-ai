import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'glass' | 'accent';
  accentColor?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  as?: React.ElementType;
}

export default function Card({
  variant = 'default',
  accentColor = 'var(--accent-500)',
  padding = 'md',
  hover = false,
  className = '',
  as = 'div',
  children,
  style,
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl',
    glass: 'bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl',
    accent: 'bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl border-l-[3px]',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const hoverClasses = hover
    ? 'transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer'
    : '';

  const classes = `${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  const customStyle = variant === 'accent' ? { ...style, borderLeftColor: accentColor } : style;

  const Tag = as;

  return (
    <Tag className={classes.trim()} style={customStyle} {...props}>
      {children}
    </Tag>
  );
}
