'use client';

import React from 'react';
import { BarChart3, Sparkles, Briefcase, Building2, CalendarOff } from 'lucide-react';

export type SummaryMetrics = {
  totalHours: number;
  clientHours: number;
  internalHours: number;
  ptoHours: number;
  clientPercentage: number;
  internalPercentage: number;
  ptoPercentage: number;
  clientCount: number;
  internalCount: number;
  ptoCount: number;
  hasCategorized: boolean;
  eventCount: number;
};

export type BarItem = {
  id: string;
  label: string;
  badge?: string;
  badgeStyle?: string;
  count: number;
  hours: number;
  percentage: number;
  color: string;
};

type BarChartProps = {
  metrics?: SummaryMetrics;
  items?: BarItem[];
  maxHeight?: string;
};

export default function BarChart({ metrics, items, maxHeight = 'max-h-72' }: BarChartProps) {
  if (metrics) {
    return (
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
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3.5 ${maxHeight} overflow-y-auto pr-1`}>
      {items.map((item) => (
        <div key={item.id} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              {item.badgeStyle ? (
                <span
                  className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold truncate ${item.badgeStyle}`}
                >
                  {item.label}
                </span>
              ) : (
                <span className="font-semibold text-dark truncate">{item.label}</span>
              )}

              {item.badge && (
                <span
                  className={`inline-flex items-center rounded border px-1.5 py-0.2 text-[10px] font-semibold shrink-0 ${
                    item.badgeStyle || 'border-border bg-surface-subtle text-light'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              <span className="text-light text-[11px] shrink-0">
                ({item.count} {item.count === 1 ? 'event' : 'events'})
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 font-mono font-medium">
              <span className="text-dark">{item.hours}h</span>
              <span className="text-light text-[11px] w-8 text-right">{item.percentage}%</span>
            </div>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(item.percentage, 3)}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
