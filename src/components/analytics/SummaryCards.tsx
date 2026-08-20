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
  Sparkles,
} from 'lucide-react';
import { CLIENT_WORK_CATEGORIES, INTERNAL_WORK_CATEGORIES } from '@/constants';
import type { ProcessedEvent } from '@/types';

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

  // Circumference for Donut Chart (radius = 54, 2 * pi * 54 = 339.292)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clientDash = (metrics.clientPercentage / 100) * circumference;
  const internalDash = (metrics.internalPercentage / 100) * circumference;
  const ptoDash = (metrics.ptoPercentage / 100) * circumference;

  const clientOffset = 0;
  const internalOffset = -clientDash;
  const ptoOffset = -(clientDash + internalDash);

  return (
    <div className="space-y-3">
      {/* Toggle View Header */}
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

      {/* 1. CARDS VIEW */}
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

      {/* 2. BAR CHART VIEW */}
      {viewMode === 'bar' && (
        <div className="rounded-lg border border-border bg-surface p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-dark flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>Work Hours Allocation (Bar Distribution)</span>
              </h3>
              <p className="text-xs text-light mt-0.5">
                Proportion of time spent between client delivery, internal tasks, and time off.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-light">Total Tracked:</span>{' '}
              <span className="text-sm font-bold text-dark">{metrics.totalHours} hrs</span>
            </div>
          </div>

          {!metrics.hasCategorized ? (
            <div className="py-8 text-center text-xs text-light flex flex-col items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-muted" />
              <div className="font-semibold text-dark text-sm">Categorization Pending</div>
              <p className="text-xs text-light">
                Run AI Categorization in the meeting log below to generate the bar chart distribution.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stacked Proportional Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-light">
                  <span className="font-medium text-dark">Overall Time Distribution</span>
                  <span>100% ({metrics.totalHours} hrs)</span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex">
                  {metrics.clientPercentage > 0 && (
                    <div
                      className="bg-secondary h-full transition-all duration-500"
                      style={{ width: `${metrics.clientPercentage}%` }}
                      title={`Client Work: ${metrics.clientHours} hrs (${metrics.clientPercentage}%)`}
                    />
                  )}
                  {metrics.internalPercentage > 0 && (
                    <div
                      className="bg-accent-3 h-full transition-all duration-500"
                      style={{ width: `${metrics.internalPercentage}%` }}
                      title={`Internal Work: ${metrics.internalHours} hrs (${metrics.internalPercentage}%)`}
                    />
                  )}
                  {metrics.ptoPercentage > 0 && (
                    <div
                      className="bg-amber-500 h-full transition-all duration-500"
                      style={{ width: `${metrics.ptoPercentage}%` }}
                      title={`Time Off: ${metrics.ptoHours} hrs (${metrics.ptoPercentage}%)`}
                    />
                  )}
                </div>
              </div>

              {/* Individual Category Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-lg border border-secondary/20 bg-secondary/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-secondary flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      Client Work
                    </span>
                    <span className="font-bold text-dark font-mono">{metrics.clientHours}h</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(metrics.clientPercentage, 2)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-light">
                    <span>{metrics.clientCount} events</span>
                    <span className="font-semibold text-secondary">{metrics.clientPercentage}%</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-accent-3/20 bg-accent-3/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-accent-3 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      Internal Work
                    </span>
                    <span className="font-bold text-dark font-mono">{metrics.internalHours}h</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="bg-accent-3 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(metrics.internalPercentage, 2)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-light">
                    <span>{metrics.internalCount} events</span>
                    <span className="font-semibold text-accent-3">{metrics.internalPercentage}%</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                      <CalendarOff className="h-3.5 w-3.5" />
                      Time Off
                    </span>
                    <span className="font-bold text-dark font-mono">{metrics.ptoHours}h</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(metrics.ptoPercentage, 2)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-light">
                    <span>{metrics.ptoCount} leave events</span>
                    <span className="font-semibold text-amber-700">{metrics.ptoPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. PIE / DONUT CHART VIEW */}
      {viewMode === 'pie' && (
        <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-dark flex items-center gap-2">
                <PieChart className="h-4 w-4 text-primary" />
                <span>Time Allocation Breakdown (Donut Chart)</span>
              </h3>
              <p className="text-xs text-light mt-0.5">
                Proportionate distribution of work categories and leave.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-light">Total Logged:</span>{' '}
              <span className="text-sm font-bold text-dark">{metrics.totalHours} hrs</span>
            </div>
          </div>

          {!metrics.hasCategorized ? (
            <div className="py-8 text-center text-xs text-light flex flex-col items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-muted" />
              <div className="font-semibold text-dark text-sm">Categorization Pending</div>
              <p className="text-xs text-light">
                Run AI Categorization in the meeting log below to view the interactive pie chart.
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
              {/* SVG Donut Chart */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg
                  className="h-44 w-44 -rotate-90 transform"
                  viewBox="0 0 140 140"
                  aria-hidden="true"
                >
                  {/* Background Circle */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    className="stroke-slate-100"
                    strokeWidth="16"
                    fill="none"
                  />

                  {/* Client Work Segment */}
                  {clientDash > 0 && (
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className="stroke-secondary transition-all duration-500"
                      strokeWidth="16"
                      strokeDasharray={`${clientDash} ${circumference}`}
                      strokeDashoffset={clientOffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  )}

                  {/* Internal Work Segment */}
                  {internalDash > 0 && (
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className="stroke-accent-3 transition-all duration-500"
                      strokeWidth="16"
                      strokeDasharray={`${internalDash} ${circumference}`}
                      strokeDashoffset={internalOffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  )}

                  {/* Time Off Segment */}
                  {ptoDash > 0 && (
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className="stroke-amber-500 transition-all duration-500"
                      strokeWidth="16"
                      strokeDasharray={`${ptoDash} ${circumference}`}
                      strokeDashoffset={ptoOffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  )}
                </svg>

                {/* Donut Center Metrics */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xl font-bold text-dark">{metrics.totalHours}</span>
                  <span className="text-[10px] font-medium text-light uppercase tracking-wider">
                    Hours Total
                  </span>
                </div>
              </div>

              {/* Legend & Breakdown List */}
              <div className="space-y-3 flex-1 max-w-sm">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-subtle/40">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-secondary shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-dark">Client Work</div>
                      <div className="text-[11px] text-light">{metrics.clientCount} events</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-secondary">{metrics.clientHours} hrs</div>
                    <div className="text-[11px] text-light">{metrics.clientPercentage}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-subtle/40">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-accent-3 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-dark">Internal Work</div>
                      <div className="text-[11px] text-light">{metrics.internalCount} events</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-accent-3">{metrics.internalHours} hrs</div>
                    <div className="text-[11px] text-light">{metrics.internalPercentage}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-subtle/40">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-dark">Time Off</div>
                      <div className="text-[11px] text-light">{metrics.ptoCount} leave events</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-amber-600">{metrics.ptoHours} hrs</div>
                    <div className="text-[11px] text-light">{metrics.ptoPercentage}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
