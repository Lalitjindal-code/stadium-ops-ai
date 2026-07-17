import React from 'react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'accent';
}

export default function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
  'aria-label': ariaLabel = 'Loading',
  ...props
}: SpinnerProps) {
  const sizeMap = {
    sm: 14,
    md: 20,
    lg: 32,
  };

  const colorMap = {
    primary: 'var(--primary-400)',
    white: '#ffffff',
    accent: 'var(--accent-400)',
  };

  const sizeValue = sizeMap[size];
  const colorValue = colorMap[color];

  return (
    <span
      role="status"
      aria-label={ariaLabel}
      style={{ color: colorValue }}
      className={`inline-flex ${className}`}
      {...props}
    >
      <span className="sr-only">{ariaLabel}</span>
      <svg
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'spin 0.75s linear infinite' }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.2"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="40"
          strokeDashoffset="30"
        />
      </svg>
    </span>
  );
}
