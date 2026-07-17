import React from 'react';

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  level?: 'base' | 'surface' | 'elevated' | 'overlay';
  border?: boolean;
  rounded?: 'none' | 'md' | 'lg' | 'xl' | '2xl';
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

export default function Surface({
  level = 'surface',
  border = false,
  rounded = 'none',
  glass = false,
  padding = 'none',
  as = 'div',
  className = '',
  children,
  style,
  ...props
}: SurfaceProps) {
  const levelTokens = {
    base: 'var(--bg-base)',
    surface: 'var(--bg-surface)',
    elevated: 'var(--bg-elevated)',
    overlay: 'var(--bg-overlay)',
  };

  const paddingMap = {
    none: '',
    sm: '1rem',
    md: '1.25rem',
    lg: '1.5rem',
  };

  const roundedMap = {
    none: '',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
  };

  const backgroundColor = glass ? 'var(--glass-bg)' : levelTokens[level];
  const borderColor = glass ? 'var(--glass-border)' : 'var(--bg-border)';
  
  const customStyle: React.CSSProperties = {
    ...style,
    backgroundColor,
    padding: paddingMap[padding] || undefined,
    borderRadius: roundedMap[rounded] || undefined,
  };

  if (border) {
    customStyle.border = `1px solid ${borderColor}`;
  }

  if (glass) {
    customStyle.backdropFilter = 'blur(20px)';
  }

  const Tag = as;

  return (
    <Tag className={className} style={customStyle} {...props}>
      {children}
    </Tag>
  );
}
