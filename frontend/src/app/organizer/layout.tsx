import React from 'react';
import { OrganizerSidebar } from '@/components/layout';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--bg-base)] font-sans overflow-hidden">
      <OrganizerSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
