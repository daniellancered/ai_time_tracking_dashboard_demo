'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import type { Employee } from '@/types';

type CalendarToolbarProps = {
  monthName: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  currentEmployee?: Employee;
  isLoading: boolean;
};

export default function CalendarToolbar({
  monthName,
  onPrevMonth,
  onNextMonth,
  onToday,
  currentEmployee,
  isLoading,
}: CalendarToolbarProps) {
  return (
    <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-subtle">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-dark min-w-[150px]">{monthName}</h2>
        <div className="flex items-center border border-border rounded overflow-hidden bg-surface">
          <button
            type="button"
            onClick={onPrevMonth}
            disabled={isLoading}
            className="h-7 px-2 hover:bg-surface-hover text-dark border-r border-border transition-colors cursor-pointer disabled:opacity-50"
            title="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            disabled={isLoading}
            className="h-7 px-2 hover:bg-surface-hover text-dark transition-colors cursor-pointer disabled:opacity-50"
            title="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={onToday}
          disabled={isLoading}
          className="h-7 px-2.5 rounded border border-border bg-surface text-xs font-medium text-dark hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
        >
          Today
        </button>
      </div>

      {currentEmployee && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-light">Viewing:</span>
          <span className="font-semibold text-dark">{currentEmployee.name}</span>
          {isLoading && <RefreshCw className="h-3 w-3 animate-spin text-primary shrink-0" />}
        </div>
      )}
    </div>
  );
}
