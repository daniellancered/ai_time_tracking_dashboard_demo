'use client';

import React from 'react';
import { CalendarRange, RefreshCw, Users } from 'lucide-react';
import type { Employee } from '@/types';
import { getInitials, getRoleBadgeStyle, type DateRangePreset } from '@/utils';

type EmployeeFilterBannerProps = {
  employees: Employee[];
  currentEmployee?: Employee;
  selectedEmployeeId: string;
  onEmployeeSelect: (id: string) => void;
  datePreset: DateRangePreset;
  onDatePresetChange: (preset: DateRangePreset) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  isLoading?: boolean;
};

export default function EmployeeFilterBanner({
  employees,
  currentEmployee,
  selectedEmployeeId,
  onEmployeeSelect,
  datePreset,
  onDatePresetChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  isLoading = false,
}: EmployeeFilterBannerProps) {
  if (!currentEmployee) return null;

  const isAll = selectedEmployeeId === 'all';
  const initials = isAll ? 'ALL' : getInitials(currentEmployee.name);
  const roleStyle = isAll
    ? 'border-primary/20 bg-primary/10 text-primary'
    : getRoleBadgeStyle(currentEmployee.role);

  return (
    <div className="rounded-lg border border-border bg-surface p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 border border-primary/20">
          {isAll ? <Users className="h-4 w-4" /> : initials}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-dark">{currentEmployee.name}</span>
            <span
              className={`inline-flex items-center rounded border px-2 py-0.2 text-[10px] font-semibold ${roleStyle}`}
            >
              {isAll ? `All Team Members (${employees.length})` : currentEmployee.role}
            </span>
          </div>
          <div className="text-[11px] text-light font-mono">
            {isAll ? 'All Team Calendars Aggregated' : currentEmployee.email}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-2.5 md:pt-0 border-t md:border-t-0 border-border">
        <div className="relative">
          <select
            value={selectedEmployeeId}
            onChange={(e) => onEmployeeSelect(e.target.value)}
            disabled={isLoading}
            className="h-8 px-2.5 rounded border border-border bg-surface text-xs text-dark font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-[170px] disabled:opacity-60"
          >
            <option value="all">👥 All Employees (Overview)</option>
            <optgroup label="Individual Team Members">
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </optgroup>
          </select>
          {isLoading && (
            <RefreshCw className="absolute right-7 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-primary pointer-events-none" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="relative flex items-center">
            <CalendarRange className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-light pointer-events-none" />
            <select
              value={datePreset}
              onChange={(e) => onDatePresetChange(e.target.value as DateRangePreset)}
              disabled={isLoading}
              className="h-8 pl-8 pr-7 rounded border border-border bg-surface text-xs text-dark font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-60"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="custom">Custom Range...</option>
            </select>
          </div>

          {datePreset === 'custom' && (
            <div className="flex items-center gap-1 text-xs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                disabled={isLoading}
                className="h-8 px-2 rounded border border-border bg-surface text-xs text-dark focus:outline-none focus:border-primary transition-colors cursor-pointer"
              />
              <span className="text-light text-[11px]">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                disabled={isLoading}
                className="h-8 px-2 rounded border border-border bg-surface text-xs text-dark focus:outline-none focus:border-primary transition-colors cursor-pointer"
              />
            </div>
          )}

          {(startDate || endDate) && datePreset !== 'all' && (
            <button
              type="button"
              onClick={() => onDatePresetChange('all')}
              className="h-8 px-2 rounded border border-border bg-surface-subtle text-[11px] font-medium text-light hover:text-dark hover:bg-surface-hover transition-colors cursor-pointer"
              title="Clear Date Filter"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
