'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock,
  Briefcase,
  Building2,
  CalendarOff,
  BarChart3,
  PieChart,
  LayoutGrid,
} from 'lucide-react';
import { CLIENT_WORK_CATEGORIES, INTERNAL_WORK_CATEGORIES } from '@/constants';
import type { ProcessedEvent } from '@/types';
import BarChart from './BarChart';
import DonutChart from './DonutChart';

type SummaryCardsProps = {
  events: ProcessedEvent[];
  isLoading?: boolean;
};

export default function SummaryCards({ events, isLoading = false }: SummaryCardsProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'bar' | 'pie'>('cards');

  const metrics = useMemo(() => {
    let totalMinutes = 0;
    let clientMinutes = 0;
    let internalMinutes = 0;
    let ptoMinutes = 0;
    let clientCount = 0;
    let internalCount = 0;
    let ptoCount = 0;
    let categorizedCount = 0;

    for (const ev of events) {
      const mins = ev.event.minutesDuration;
      totalMinutes += mins;

      if (ev.category) {
        categorizedCount++;
        if (ev.category === 'PTO') {
          ptoMinutes += mins;
          ptoCount++;
        } else if (
          (CLIENT_WORK_CATEGORIES as readonly string[]).includes(ev.category) ||
          ev.clientName ||
          ev.clientId
        ) {
          clientMinutes += mins;
          clientCount++;
        } else if ((INTERNAL_WORK_CATEGORIES as readonly string[]).includes(ev.category)) {
          internalMinutes += mins;
          internalCount++;
        } else {
          internalMinutes += mins;
          internalCount++;
        }
      }
    }

    const hasCategorized = categorizedCount > 0;
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
    const clientHours = Math.round((clientMinutes / 60) * 10) / 10;
    const internalHours = Math.round((internalMinutes / 60) * 10) / 10;
    const ptoHours = Math.round((ptoMinutes / 60) * 10) / 10;

    const clientPercentage =
      totalMinutes > 0 ? Math.round((clientMinutes / totalMinutes) * 100) : 0;
    const internalPercentage =
      totalMinutes > 0 ? Math.round((internalMinutes / totalMinutes) * 100) : 0;
    const ptoPercentage =
      totalMinutes > 0 ? Math.round((ptoMinutes / totalMinutes) * 100) : 0;

    return {
      totalHours,
      clientHours,
      internalHours,
      ptoHours,
      clientPercentage,
      internalPercentage,
      ptoPercentage,
      clientCount,
      internalCount,
      ptoCount,
      hasCategorized,
      eventCount: events.length,
    };
  }, [events]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-7 w-28 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-24 bg-slate-200 rounded" />
                <div className="h-7 w-7 rounded bg-slate-100" />
              </div>
              <div className="mt-3 h-7 w-20 bg-slate-200 rounded" />
              <div className="mt-2 h-3 w-32 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-light">
          Overview Summary
        </span>

        <div className="flex items-center gap-1 p-1 rounded-md bg-surface border border-border">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-primary text-white shadow-xs'
                : 'text-light hover:text-dark hover:bg-surface-hover'
            }`}
            title="Card KPI View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('bar')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'bar'
                ? 'bg-primary text-white shadow-xs'
                : 'text-light hover:text-dark hover:bg-surface-hover'
            }`}
            title="Bar Chart Breakdown"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Bar Chart</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('pie')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'pie'
                ? 'bg-primary text-white shadow-xs'
                : 'text-light hover:text-dark hover:bg-surface-hover'
            }`}
            title="Pie / Donut Chart Breakdown"
          >
            <PieChart className="h-3.5 w-3.5" />
            <span>Pie Chart</span>
          </button>
        </div>
      </div>

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between text-light">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Tracked Hours
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-dark">
              {metrics.totalHours} <span className="text-sm font-medium text-light">hrs</span>
            </div>
            <div className="text-[11px] text-light mt-1">
              {metrics.eventCount} calendar events
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between text-light">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Client Work Hours
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded bg-secondary/10 text-secondary">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-secondary">
              {metrics.hasCategorized ? (
                <>
                  {metrics.clientHours}{' '}
                  <span className="text-sm font-medium text-light">hrs</span>
                </>
              ) : (
                <span className="text-xl font-bold text-light">—</span>
              )}
            </div>
            <div className="text-[11px] text-light mt-1">
              {metrics.hasCategorized
                ? `${metrics.clientCount} events (${metrics.clientPercentage}% of total)`
                : 'Pending AI categorization'}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between text-light">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Internal Work Hours
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded bg-accent-3/10 text-accent-3">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-accent-3">
              {metrics.hasCategorized ? (
                <>
                  {metrics.internalHours}{' '}
                  <span className="text-sm font-medium text-light">hrs</span>
                </>
              ) : (
                <span className="text-xl font-bold text-light">—</span>
              )}
            </div>
            <div className="text-[11px] text-light mt-1">
              {metrics.hasCategorized
                ? `${metrics.internalCount} events (${metrics.internalPercentage}% of total)`
                : 'Pending AI categorization'}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between text-light">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Time Off
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/10 text-amber-600">
                <CalendarOff className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-600">
              {metrics.hasCategorized ? (
                <>
                  {metrics.ptoHours}{' '}
                  <span className="text-sm font-medium text-light">hrs</span>
                </>
              ) : (
                <span className="text-xl font-bold text-light">—</span>
              )}
            </div>
            <div className="text-[11px] text-light mt-1">
              {metrics.hasCategorized
                ? `${metrics.ptoCount} leave events (${metrics.ptoPercentage}%)`
                : 'Pending AI categorization'}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'bar' && <BarChart metrics={metrics} />}

      {viewMode === 'pie' && <DonutChart metrics={metrics} />}
    </div>
  );
}
