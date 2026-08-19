'use client';

import React from 'react';
import { BarChart3, Calendar, RefreshCw } from 'lucide-react';

type AnalyticsPanelTabsProps = {
  activeTab: 'overview' | 'events';
  onTabChange: (tab: 'overview' | 'events') => void;
  eventCount: number;
  pendingCount: number;
  totalHours: number;
  isLoading?: boolean;
  children: React.ReactNode;
};

export default function AnalyticsPanelTabs({
  activeTab,
  onTabChange,
  eventCount,
  pendingCount,
  totalHours,
  isLoading = false,
  children,
}: AnalyticsPanelTabsProps) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
      {/* Seamless Connected Tab Bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface-subtle/80 px-3 pt-2">
        <div className="flex items-center gap-1.5 -mb-[1px]">
          <button
            type="button"
            onClick={() => onTabChange('overview')}
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
            onClick={() => onTabChange('events')}
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
                  {eventCount}
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
            `${totalHours} hrs logged across ${eventCount} events`
          )}
        </div>
      </div>

      {/* Connected Tab Body */}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
