'use client';

import React from 'react';
import { Users, Search } from 'lucide-react';
import type { Employee } from '@/types';
import { getInitials, getRoleBadgeStyle } from '@/utils';

type CalendarSidebarProps = {
  employees: Employee[];
  selectedEmployeeId: string;
  onSelectEmployee: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading: boolean;
};

export default function CalendarSidebar({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  searchQuery,
  onSearchChange,
  isLoading,
}: CalendarSidebarProps) {
  return (
    <div className="lg:col-span-3 rounded-lg border border-border bg-surface p-4 space-y-3.5">
      <div className="flex items-center gap-2 text-dark font-semibold text-xs uppercase tracking-wider">
        <Users className="h-4 w-4 text-primary" />
        <span>Select Employee</span>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-light" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={isLoading}
          placeholder="Search team member..."
          className="w-full h-8 pl-8 pr-2.5 rounded border border-border bg-surface text-xs text-dark placeholder:text-light/70 focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="space-y-1 max-h-[520px] overflow-y-auto pr-0.5 divide-y divide-border/60">
        <button
          type="button"
          onClick={() => onSelectEmployee('all')}
          disabled={isLoading}
          className={`w-full text-left p-2.5 rounded transition-colors flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedEmployeeId === 'all'
              ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
              : 'hover:bg-surface-hover text-dark'
          }`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs truncate font-semibold">All Team Members</div>
            <div className="text-[10px] text-light truncate">Combined Organization Calendar</div>
          </div>
        </button>

        {employees.map((emp) => {
          const isSelected = emp.id === selectedEmployeeId;
          const initials = getInitials(emp.name);
          const roleBadge = getRoleBadgeStyle(emp.role);

          return (
            <button
              key={emp.id}
              type="button"
              onClick={() => onSelectEmployee(emp.id)}
              disabled={isLoading}
              className={`w-full text-left p-2.5 rounded transition-colors flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelected
                  ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                  : 'hover:bg-surface-hover text-dark'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 border ${
                  isSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface-subtle text-dark border-border'
                }`}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold truncate flex items-center justify-between gap-1">
                  <span className="truncate">{emp.name}</span>
                  <span
                    className={`inline-flex items-center rounded border px-1 py-0.2 text-[9px] font-semibold shrink-0 ${roleBadge}`}
                  >
                    {emp.role}
                  </span>
                </div>
                <div className="text-[10px] text-light truncate font-mono">{emp.email}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
