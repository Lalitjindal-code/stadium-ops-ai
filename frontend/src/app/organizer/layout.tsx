import React from 'react';
import { OrganizerSidebar } from '@/components/layout';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--bg-void)] font-sans overflow-hidden">
      <OrganizerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
