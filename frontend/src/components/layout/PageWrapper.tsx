import React from 'react';
import { SectionHeader } from '@/components/ui';

export interface PageWrapperProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({
  title,
  subtitle,
  actions,
  children,
  className = '',
}: PageWrapperProps) {
  return (
    <div className={`animate-fade-in-up p-8 max-w-[var(--max-content-width)] mx-auto w-full ${className}`}>
      {title && (
        <SectionHeader 
          title={title} 
          subtitle={subtitle} 
          actions={actions} 
          className="mb-8"
        />
      )}
      {children}
    </div>
  );
}
