import React from 'react';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  divider?: boolean;
  size?: 'sm' | 'md' | 'lg';
  labelStyle?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export default function SectionHeader({
  title,
  subtitle,
  badge,
  actions,
  divider = false,
  size = 'md',
  labelStyle = false,
  as = 'h2',
  className = '',
  ...props
}: SectionHeaderProps) {
  const sizeClasses = {
    sm: 'font-semibold text-[var(--text-heading-sm)]',
    md: 'font-semibold text-[var(--text-heading-md)]',
    lg: 'font-bold text-[var(--text-heading-lg)]',
  };

  const labelClasses = 'text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-tertiary)]';
  
  const titleClasses = labelStyle ? labelClasses : sizeClasses[size];

  const Tag = as;

  return (
    <div className={`flex flex-col gap-3 ${className}`} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tag className={titleClasses}>{title}</Tag>
          {badge}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      
      {subtitle && (
        <div className="text-[var(--text-secondary)] text-[var(--text-body-md)]">
          {subtitle}
        </div>
      )}

      {divider && (
        <div 
          className="section-divider mt-2"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--bg-border) 20%, var(--bg-border) 80%, transparent)'
          }}
        />
      )}
    </div>
  );
}
