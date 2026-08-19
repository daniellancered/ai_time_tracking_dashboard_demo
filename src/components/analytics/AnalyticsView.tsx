'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock,
  Briefcase,
  Building2,
  Tag,
  Download,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import OverviewBreakdown from './OverviewBreakdown';
import EventTable from '@/components/events/EventTable';
import useEmployeeCalendar from '@/hooks/useEmployeeCalendar';
import type { Employee, Company } from '@/types';
import { getInitials, getRoleBadgeStyle, exportEventsToCSV } from '@/utils';

type AnalyticsViewProps = {
  employees: Employee[];
  companies: Company[];
  initialEmployeeId?: string;
  errorMsg: string | null;
};

export default function AnalyticsView({
  employees,
  companies,
  initialEmployeeId,
  errorMsg: initialErrorMsg,
}: AnalyticsViewProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    initialEmployeeId || employees[0]?.id || '',
  );

  const currentEmployee = employees.find((emp) => emp.id === selectedEmployeeId) || employees[0];
  const initials = currentEmployee ? getInitials(currentEmployee.name) : '??';
  const roleStyle = currentEmployee ? getRoleBadgeStyle(currentEmployee.role) : '';

  const { events, isLoading, errorMsg } = useEmployeeCalendar({
    email: currentEmployee?.email,
    companies,
    initialError: initialErrorMsg,
  });

  const metrics = useMemo(() => {
    let totalMinutes = 0;
    let clientMinutes = 0;
    const categoryMap = new Map<string, number>();
    const clientMap = new Map<string, number>();

    for (const ev of events) {
      totalMinutes += ev.minutesDuration;

      if (ev.clientName) {
        clientMinutes += ev.minutesDuration;
        clientMap.set(ev.clientName, (clientMap.get(ev.clientName) || 0) + ev.minutesDuration);
      }

      if (ev.category) {
        categoryMap.set(ev.category, (categoryMap.get(ev.category) || 0) + ev.minutesDuration);
      }
    }

    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
    const clientHours = Math.round((clientMinutes / 60) * 10) / 10;
    const clientPercentage =
      totalMinutes > 0 ? Math.round((clientMinutes / totalMinutes) * 100) : 0;

    let topCategory = '—';
    let maxCatMinutes = 0;
    for (const [cat, mins] of categoryMap.entries()) {
      if (mins > maxCatMinutes) {
        maxCatMinutes = mins;
        topCategory = cat;
      }
    }

    let topClient = '—';
    let maxClientMinutes = 0;
    for (const [client, mins] of clientMap.entries()) {
      if (mins > maxClientMinutes) {
        maxClientMinutes = mins;
        topClient = client;
      }
    }

    return {
      totalHours,
      clientHours,
      clientPercentage,
      topCategory,
      topCategoryHours: Math.round((maxCatMinutes / 60) * 10) / 10,
      topClient,
      topClientHours: Math.round((maxClientMinutes / 60) * 10) / 10,
      eventCount: events.length,
    };
  }, [events]);

  const handleExportCSV = () => {
    if (currentEmployee) {
      exportEventsToCSV(events, currentEmployee.name);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-dark flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Time Tracking & Overview Analytics
          </h1>
          <p className="text-sm text-light mt-0.5">
            Real-time work categorization, client time attribution, and granular calendar logs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={isLoading || events.length === 0}
          className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-3.5 py-2 text-xs font-medium text-dark hover:bg-surface-hover transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5 text-light" />
          <span>Export to CSV / Sheet</span>
        </button>
      </div>

      {currentEmployee && (
        <div className="rounded-lg border border-border bg-surface p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 border border-primary/20">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold text-dark">{currentEmployee.name}</span>
                <span
                  className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold ${roleStyle}`}
                >
                  {currentEmployee.role}
                </span>
              </div>
              <div className="text-xs text-light font-mono mt-0.5">{currentEmployee.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-border">
            <div className="relative">
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                disabled={isLoading}
                className="h-9 px-3 rounded border border-border bg-surface text-xs text-dark font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-[210px] disabled:opacity-60"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
              {isLoading && (
                <RefreshCw className="absolute right-8 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-primary pointer-events-none" />
              )}
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <div>
            <div className="font-semibold">Failed to load calendar events</div>
            <div className="text-xs text-red-600 mt-0.5">{errorMsg}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between text-light">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Time Logged
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-dark">
            {metrics.totalHours} <span className="text-sm font-medium text-light">hrs</span>
          </div>
          <div className="text-[11px] text-light mt-1">
            Across {metrics.eventCount} calendar events
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between text-light">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Client Allocation
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded bg-secondary/10 text-secondary">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-secondary">
            {metrics.clientPercentage}%{' '}
            <span className="text-sm font-medium text-light">({metrics.clientHours} hrs)</span>
          </div>
          <div className="text-[11px] text-light mt-1">Client-facing meetings & work</div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between text-light">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Client</span>
            <div className="flex h-7 w-7 items-center justify-center rounded bg-accent-3/10 text-accent-3">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-base font-bold text-dark truncate" title={metrics.topClient}>
            {metrics.topClient}
          </div>
          <div className="text-[11px] text-light mt-1">
            {metrics.topClientHours > 0 ? `${metrics.topClientHours} hrs logged` : 'No client time'}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between text-light">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Category</span>
            <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500/10 text-emerald-600">
              <Tag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-base font-bold text-dark truncate" title={metrics.topCategory}>
            {metrics.topCategory}
          </div>
          <div className="text-[11px] text-light mt-1">
            {metrics.topCategoryHours > 0
              ? `${metrics.topCategoryHours} hrs logged`
              : 'Uncategorized'}
          </div>
        </div>
      </div>

      <OverviewBreakdown events={events} companies={companies} isLoading={isLoading} />

      <div className="border-t border-border pt-6 space-y-3">
        <div>
          <h2 className="text-base font-bold text-dark">Calendar Events & Meeting Log</h2>
          <p className="text-xs text-light">
            Review detailed event logs, run batch AI categorization, or inspect individual
            classification reasons.
          </p>
        </div>
        <EventTable initialEvents={events} companies={companies} isLoading={isLoading} />
      </div>
    </div>
  );
}
