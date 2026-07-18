"use client";

import React from "react";
import { PageWrapper } from "@/components/layout";
import { Card } from "@/components/ui";

export default function SettingsPage() {
  return (
    <PageWrapper
      title="Settings"
      subtitle="View system configuration and account details"
    >
      <div className="max-w-3xl mx-auto space-y-12 py-6">
        
        <section>
          <h2 className="text-sm font-display font-bold text-[var(--gold)] uppercase tracking-wider mb-5 flex items-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-[var(--gold)] to-transparent" />
            Account Information
          </h2>
          <Card className="p-8 space-y-6 glass border-neon-gold/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Name</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">Sarah Organizer</div>
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Email</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">sarah.org@fifa.example.com</div>
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Role</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">Command Center Lead</div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-sm font-display font-bold text-[var(--neon-blue)] uppercase tracking-wider mb-5 flex items-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-[var(--neon-blue)] to-transparent" />
            System Configuration
          </h2>
          <Card className="p-8 space-y-6 glass border-neon-blue/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Active AI Model</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">Gemini 2.0 Flash (Production)</div>
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Stadium Context</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">MetLife Stadium, New Jersey</div>
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Max Capacity</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">82,500 + 10,000 Staff</div>
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Data Retention</div>
                <div className="text-sm font-medium text-[var(--text-primary)]">90 Days (Compliance)</div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-sm font-display font-bold text-[var(--neon-violet)] uppercase tracking-wider mb-5 flex items-center gap-3">
            <span className="w-8 h-px bg-gradient-to-r from-[var(--neon-violet)] to-transparent" />
            Appearance
          </h2>
          <Card className="p-8 flex items-center justify-between glass border-neon-violet/30">
            <div>
              <div className="text-sm font-bold text-[var(--text-primary)]">Theme</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                Stadium Ops AI currently supports Dark Mode only for command center visibility.
              </div>
            </div>
            <div className="bg-[var(--bg-elevated)] border border-[var(--bg-border)] px-4 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] cursor-not-allowed opacity-70">
              Dark Mode (Locked)
            </div>
          </Card>
        </section>

      </div>
    </PageWrapper>
  );
}
