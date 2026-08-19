'use client';

import React, { useState } from 'react';
import {
  Download,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import SummaryCards from './SummaryCards';
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

  const { events, setEvents, isLoading, errorMsg, refreshEvents } = useEmployeeCalendar({
    email: currentEmployee?.email,
    initialError: initialErrorMsg,
  });

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

      <SummaryCards events={events} isLoading={isLoading} />

      <OverviewBreakdown events={events} companies={companies} isLoading={isLoading} />

      <div className="border-t border-border pt-6 space-y-3">
        <div>
          <h2 className="text-base font-bold text-dark">Calendar Events & Meeting Log</h2>
          <p className="text-xs text-light">
            Review detailed event logs, run batch AI categorization, or inspect individual
            classification reasons.
          </p>
        </div>
        <EventTable
          initialEvents={events}
          companies={companies}
          isLoading={isLoading}
          onEventsChange={setEvents}
          onRefresh={refreshEvents}
        />
      </div>
    </div>
  );
}
