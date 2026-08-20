import React from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  CalendarDays,
  BarChart3,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

const NAVIGATION_CARDS = [
  {
    href: '/employees',
    title: '1. Employees Directory',
    description: 'Team members across Customer Success, Engineering, and Design.',
    actionText: 'Explore team',
    icon: Users,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    hoverText: 'group-hover:text-primary',
  },
  {
    href: '/companies',
    title: '2. Companies & CRM',
    description: 'CRM accounts, customer tiers, ARR values, and email domain mapping.',
    actionText: 'View accounts',
    icon: Building2,
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    hoverText: 'group-hover:text-secondary',
  },
  {
    href: '/calendar',
    title: '3. Visual Calendar',
    description: 'Interactive Google Calendar-style schedule with employee search.',
    actionText: 'Open schedule',
    icon: CalendarDays,
    iconBg: 'bg-accent-3/10',
    iconColor: 'text-accent-3',
    hoverText: 'group-hover:text-accent-3',
  },
  {
    href: '/analytics',
    title: '4. Time Analytics',
    description: '15-category work breakdown, client time allocation, and AI classifier.',
    actionText: 'View analytics',
    icon: BarChart3,
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    hoverText: 'group-hover:text-emerald-600',
  },
  {
    href: '/sync',
    title: '5. Sync & Export',
    description: 'On-demand calendar sync, batch AI categorization, and cache controls.',
    actionText: 'Open sync',
    icon: RefreshCw,
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    hoverText: 'group-hover:text-amber-600',
  },
];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {NAVIGATION_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-slate-300 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded ${card.iconBg} ${card.iconColor} mb-3`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <h3
                  className={`font-semibold text-sm text-dark ${card.hoverText} transition-colors`}
                >
                  {card.title}
                </h3>
                <p className="mt-1 text-xs text-light">{card.description}</p>
              </div>
              <div
                className={`mt-4 flex items-center text-xs font-semibold ${card.iconColor} gap-1`}
              >
                <span>{card.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
