'use client';

import React, { useState, useMemo } from 'react';
import {
  Download,
  AlertCircle,
  RefreshCw,
  Sparkles,
  BarChart3,
  Calendar,
} from 'lucide-react';
import SummaryCards from './SummaryCards';
import TimeBreakdown from './TimeBreakdown';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'events'>('overview');

  const currentEmployee = employees.find((emp) => emp.id === selectedEmployeeId) || employees[0];
  const initials = currentEmployee ? getInitials(currentEmployee.name) : '??';
  const roleStyle = currentEmployee ? getRoleBadgeStyle(currentEmployee.role) : '';

  const { events, setEvents, isLoading, errorMsg, refreshEvents } = useEmployeeCalendar({
    email: currentEmployee?.email,
    initialError: initialErrorMsg,
  });

  const pendingCount = useMemo(() => {
    return events.filter((ev) => !ev.category).length;
  }, [events]);

  const totalHours = useMemo(() => {
    const totalMinutes = events.reduce((acc, ev) => acc + ev.event.minutesDuration, 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  }, [events]);

  const handleExportCSV = () => {
    if (currentEmployee) {
      exportEventsToCSV(events, currentEmployee.name);
    }
  };

  return (
    <div className="space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-dark flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Time Tracking & Analytics
          </h1>
          <p className="text-xs text-light mt-0.5">
            Real-time work categorization, client time attribution, and granular calendar logs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={isLoading || events.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-dark hover:bg-surface-hover transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5 text-light" />
          <span>Export CSV</span>
        </button>
      </div>

      {currentEmployee && (
        <div className="rounded-lg border border-border bg-surface p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 border border-primary/20">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-dark">{currentEmployee.name}</span>
                <span
                  className={`inline-flex items-center rounded border px-2 py-0.2 text-[10px] font-semibold ${roleStyle}`}
                >
                  {currentEmployee.role}
                </span>
              </div>
              <div className="text-[11px] text-light font-mono">{currentEmployee.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-border">
            <div className="relative">
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                disabled={isLoading}
                className="h-8 px-2.5 rounded border border-border bg-surface text-xs text-dark font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-[200px] disabled:opacity-60"
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
        <div className="rounded border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <div>
            <div className="font-semibold">Failed to load calendar events</div>
            <div className="text-red-600 mt-0.5">{errorMsg}</div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
        <div className="flex items-center justify-between border-b border-border bg-surface-subtle/80 px-3 pt-2">
          <div className="flex items-center gap-1.5 -mb-[1px]">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-semibold border-t border-x transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-surface text-primary border-border border-b-transparent shadow-xs font-bold'
                  : 'bg-transparent text-light border-transparent hover:text-dark hover:bg-surface/50'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Overview & Charts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-semibold border-t border-x transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-surface text-primary border-border border-b-transparent shadow-xs font-bold'
                  : 'bg-transparent text-light border-transparent hover:text-dark hover:bg-surface/50'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Meeting Log</span>
              {isLoading ? (
                <span className="h-3.5 w-5 rounded-full bg-slate-200 animate-pulse inline-block" />
              ) : (
                <>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-light font-medium">
                    {events.length}
                  </span>
                  {pendingCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                      {pendingCount} pending
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

          <div className="text-[11px] text-light hidden sm:block pb-1.5 font-medium">
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-light animate-pulse">
                <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                <span>Loading calendar events...</span>
              </span>
            ) : (
              `${totalHours} hrs logged across ${events.length} events`
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {activeTab === 'overview' ? (
            <div className="space-y-5">
              <SummaryCards events={events} isLoading={isLoading} />
              <TimeBreakdown events={events} companies={companies} isLoading={isLoading} />
            </div>
          ) : (
            <div className="space-y-4">
              <EventTable
                initialEvents={events}
                companies={companies}
                isLoading={isLoading}
                onEventsChange={setEvents}
                onRefresh={refreshEvents}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
