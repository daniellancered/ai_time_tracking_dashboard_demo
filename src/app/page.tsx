import React from 'react';
import Link from 'next/link';
import { Users, Building2, CalendarDays, ArrowRight, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <BarChart3 className="h-4 w-4" />
            Internal Operations Tool
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl">
            AI Time Tracking & Calendar Operations
          </h1>
          <p className="text-sm text-light leading-relaxed">
            Automating the ingestion, AI categorization, and client time allocation analysis for
            Customer Success and Operations teams.
          </p>

          <div className="pt-4 flex items-center gap-3">
            <Link
              href="/employees"
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              <Users className="h-4 w-4" />
              Open Employees Directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/employees"
          className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-slate-300"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10 text-primary mb-3">
            <Users className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-sm text-dark group-hover:text-primary transition-colors">
            1. Employees Directory
          </h3>
          <p className="mt-1 text-xs text-light">
            Internal team members across Customer Success, Engineering, and Design.
          </p>
        </Link>

        <div className="rounded-lg border border-border bg-surface-subtle p-5 opacity-75">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-secondary/10 text-secondary mb-3">
            <Building2 className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-sm text-dark">2. Companies</h3>
          <p className="mt-1 text-xs text-light">
            CRM records, customer tiers, ARR values, and email domain mapping.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface-subtle p-5 opacity-75">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-accent-3/10 text-accent-3 mb-3">
            <CalendarDays className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-sm text-dark">3. Calendar Events & AI</h3>
          <p className="mt-1 text-xs text-light">
            Calendar sync, 15-criteria AI categorization, and client deduction.
          </p>
        </div>
      </div>
    </div>
  );
}
