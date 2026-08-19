import React from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  CalendarDays,
  BarChart3,
  Settings,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-6 w-full">
      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" />
            Smartly
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl">
            Time Tracking and Calendar Management
          </h1>
          <p className="text-sm text-light leading-relaxed">
            Automating the ingestion, AI categorization, and client time allocation analysis for
            Customer Success and Operations teams.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover shadow-xs"
            >
              <BarChart3 className="h-4 w-4" />
              Open Time Analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 rounded border border-border bg-surface px-4 py-2 text-sm font-medium text-dark transition-colors hover:bg-surface-hover"
            >
              <CalendarDays className="h-4 w-4" />
              View Calendar
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/employees"
          className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-slate-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10 text-primary mb-3">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-dark group-hover:text-primary transition-colors">
              1. Employees Directory
            </h3>
            <p className="mt-1 text-xs text-light">
              Team members across Customer Success, Engineering, and Design.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
            <span>Explore team</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/companies"
          className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-slate-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded bg-secondary/10 text-secondary mb-3">
              <Building2 className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-dark group-hover:text-secondary transition-colors">
              2. Companies & CRM
            </h3>
            <p className="mt-1 text-xs text-light">
              CRM accounts, customer tiers, ARR values, and email domain mapping.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-secondary gap-1">
            <span>View accounts</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/calendar"
          className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-slate-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded bg-accent-3/10 text-accent-3 mb-3">
              <CalendarDays className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-dark group-hover:text-accent-3 transition-colors">
              3. Visual Calendar
            </h3>
            <p className="mt-1 text-xs text-light">
              Interactive Google Calendar-style schedule with employee search.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-accent-3 gap-1">
            <span>Open schedule</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/analytics"
          className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-slate-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded bg-emerald-500/10 text-emerald-600 mb-3">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-dark group-hover:text-emerald-600 transition-colors">
              4. Time Analytics
            </h3>
            <p className="mt-1 text-xs text-light">
              15-category work breakdown, client time allocation, and AI classifier.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 gap-1">
            <span>View analytics</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/settings"
          className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-slate-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded bg-slate-100 text-dark mb-3">
              <Settings className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-dark group-hover:text-primary transition-colors">
              5. Sync Settings
            </h3>
            <p className="mt-1 text-xs text-light">
              Manual calendar sync trigger, polling intervals, and mock configurations.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-dark gap-1">
            <span>Configure sync</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
