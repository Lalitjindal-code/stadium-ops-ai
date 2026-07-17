import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export default function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = '',
  ...props
}: SkeletonProps) {
  const roundedClasses = {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    full: 'var(--radius-full)',
  };

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`animate-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius: roundedClasses[rounded],
        backgroundColor: 'var(--bg-muted)',
      }}
      {...props}
    />
  );
}
