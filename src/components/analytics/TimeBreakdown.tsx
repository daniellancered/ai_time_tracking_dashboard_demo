'use client';

import React, { useState, useMemo } from 'react';
import { Tag, Building2, HelpCircle, Sparkles, BarChart3, PieChart } from 'lucide-react';
import type { ProcessedEvent, Company, EventCategory } from '@/types';
import { getCategoryBadgeStyle, getCustomerTierBadgeStyle } from '@/utils';

type TimeBreakdownProps = {
  events: ProcessedEvent[];
  companies: Company[];
  isLoading?: boolean;
};

const CATEGORY_COLORS = [
  '#6F42C1',
  '#007BFF',
  '#17A2B8',
  '#00CCCC',
  '#10B981',
  '#F59E0B',
  '#F43F5E',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#06B6D4',
  '#84CC16',
  '#64748B',
];

const CLIENT_COLORS = [
  '#007BFF',
  '#17A2B8',
  '#6366F1',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#6F42C1',
  '#14B8A6',
  '#64748B',
];

export default function TimeBreakdown({
  events,
  companies,
  isLoading = false,
}: TimeBreakdownProps) {
  const [categoryView, setCategoryView] = useState<'bar' | 'pie'>('bar');
  const [clientView, setClientView] = useState<'bar' | 'pie'>('bar');

  const hasCategorizedEvents = useMemo(() => {
    return events.some((ev) => Boolean(ev.category));
  }, [events]);

  const categoryStats = useMemo(() => {
    let totalMinutes = 0;
    const map = new Map<string, { minutes: number; count: number }>();

    for (const event of events) {
      totalMinutes += event.event.minutesDuration;
      const key = event.category || 'Uncategorized';
      const existing = map.get(key) || { minutes: 0, count: 0 };
      map.set(key, {
        minutes: existing.minutes + event.event.minutesDuration,
        count: existing.count + 1,
      });
    }

    const items = Array.from(map.entries()).map(([category, data]) => {
      const hours = Math.round((data.minutes / 60) * 10) / 10;
      const percentage = totalMinutes > 0 ? Math.round((data.minutes / totalMinutes) * 100) : 0;
      return {
        category,
        hours,
        count: data.count,
        percentage,
      };
    });

    items.sort((a, b) => b.hours - a.hours);

    return {
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      items,
    };
  }, [events]);

  const clientStats = useMemo(() => {
    let totalMinutes = 0;
    const map = new Map<string, { minutes: number; count: number; company?: Company }>();

    for (const event of events) {
      totalMinutes += event.event.minutesDuration;

      let key: string;
      if (event.clientName) {
        key = event.clientName;
      } else if (event.category) {
        key = 'Internal / Non-Client';
      } else {
        key = 'Uncategorized / Pending AI';
      }

      const existing = map.get(key) || { minutes: 0, count: 0 };

      let matchedCompany: Company | undefined = existing.company;
      if (!matchedCompany && event.clientName) {
        matchedCompany = companies.find(
          (c) => c.name.toLowerCase() === event.clientName?.toLowerCase(),
        );
      }

      map.set(key, {
        minutes: existing.minutes + event.event.minutesDuration,
        count: existing.count + 1,
        company: matchedCompany,
      });
    }

    const items = Array.from(map.entries()).map(([clientName, data]) => {
      const hours = Math.round((data.minutes / 60) * 10) / 10;
      const percentage = totalMinutes > 0 ? Math.round((data.minutes / totalMinutes) * 100) : 0;
      return {
        clientName,
        hours,
        count: data.count,
        percentage,
        company: data.company,
        isInternal: clientName === 'Internal / Non-Client',
        isUncategorized: clientName === 'Uncategorized / Pending AI',
      };
    });

    items.sort((a, b) => b.hours - a.hours);

    return {
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      items,
    };
  }, [events, companies]);

  // Donut chart math: radius = 46, circumference ≈ 289.026
  const donutRadius = 46;
  const donutCircumference = 2 * Math.PI * donutRadius;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. TIME BY CATEGORY CARD */}
      <div className="rounded-lg border border-border bg-surface p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2 text-dark font-semibold text-sm">
              <Tag className="h-4 w-4 text-primary" />
              <span>Time by Category</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-light font-medium hidden sm:inline">
                {categoryStats.items.length}{' '}
                {categoryStats.items.length === 1 ? 'category' : 'categories'}
              </span>

              <div className="flex items-center gap-0.5 p-0.5 rounded bg-surface-subtle border border-border">
                <button
                  type="button"
                  onClick={() => setCategoryView('bar')}
                  className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                    categoryView === 'bar'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-light hover:text-dark'
                  }`}
                  title="Bar view"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryView('pie')}
                  className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                    categoryView === 'pie'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-light hover:text-dark'
                  }`}
                  title="Pie / Donut view"
                >
                  <PieChart className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-2 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 rounded w-16" />
                  </div>
                  <div className="h-2 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : categoryStats.items.length === 0 ? (
            <div className="py-8 text-center text-xs text-light flex flex-col items-center gap-1.5">
              <HelpCircle className="h-6 w-6 text-muted" />
              <span>No categorized events found for this period.</span>
            </div>
          ) : categoryView === 'bar' ? (
            /* BAR VIEW */
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {categoryStats.items.map((item, idx) => {
                const isUncategorized = item.category === 'Uncategorized';
                const badgeStyle = getCategoryBadgeStyle(
                  isUncategorized ? null : (item.category as EventCategory),
                );
                const barColor = isUncategorized
                  ? 'bg-amber-400'
                  : CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

                return (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold truncate ${badgeStyle}`}
                        >
                          {item.category}
                        </span>
                        <span className="text-light text-[11px] shrink-0">
                          ({item.count} {item.count === 1 ? 'event' : 'events'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 font-mono font-medium">
                        <span className="text-dark">{item.hours}h</span>
                        <span className="text-light text-[11px] w-8 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(item.percentage, 3)}%`,
                          backgroundColor: isUncategorized ? '#F59E0B' : barColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* PIE / DONUT VIEW */
            <div className="flex flex-col sm:flex-row items-center justify-around gap-5 py-2">
              <div className="relative flex items-center justify-center shrink-0">
                <svg
                  className="h-36 w-36 -rotate-90 transform"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    className="stroke-slate-100"
                    strokeWidth="14"
                    fill="none"
                  />
                  {(() => {
                    let accumulated = 0;
                    return categoryStats.items.map((item, idx) => {
                      const isUncategorized = item.category === 'Uncategorized';
                      const strokeColor = isUncategorized
                        ? '#F59E0B'
                        : CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                      const dash = (item.percentage / 100) * donutCircumference;
                      const offset = -(accumulated / 100) * donutCircumference;
                      accumulated += item.percentage;

                      if (dash <= 0) return null;

                      return (
                        <circle
                          key={item.category}
                          cx="60"
                          cy="60"
                          r={donutRadius}
                          stroke={strokeColor}
                          strokeWidth="14"
                          strokeDasharray={`${dash} ${donutCircumference}`}
                          strokeDashoffset={offset}
                          fill="none"
                          className="transition-all duration-500"
                        />
                      );
                    });
                  })()}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-lg font-bold text-dark">{categoryStats.totalHours}h</span>
                  <span className="text-[10px] text-light uppercase tracking-wider">Total</span>
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto flex-1 w-full text-xs">
                {categoryStats.items.map((item, idx) => {
                  const isUncategorized = item.category === 'Uncategorized';
                  const color = isUncategorized
                    ? '#F59E0B'
                    : CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

                  return (
                    <div
                      key={item.category}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-surface-hover/50 text-[11px]"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-dark truncate font-medium">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono shrink-0">
                        <span className="text-dark">{item.hours}h</span>
                        <span className="text-light w-7 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. TIME BY CLIENT CARD */}
      <div className="rounded-lg border border-border bg-surface p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2 text-dark font-semibold text-sm">
              <Building2 className="h-4 w-4 text-secondary" />
              <span>Time by Client</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-light font-medium hidden sm:inline">
                {hasCategorizedEvents
                  ? `${clientStats.items.filter((i) => !i.isInternal && !i.isUncategorized).length} clients`
                  : 'Pending AI'}
              </span>

              <div className="flex items-center gap-0.5 p-0.5 rounded bg-surface-subtle border border-border">
                <button
                  type="button"
                  onClick={() => setClientView('bar')}
                  className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                    clientView === 'bar'
                      ? 'bg-secondary text-white shadow-xs'
                      : 'text-light hover:text-dark'
                  }`}
                  title="Bar view"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setClientView('pie')}
                  className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                    clientView === 'pie'
                      ? 'bg-secondary text-white shadow-xs'
                      : 'text-light hover:text-dark'
                  }`}
                  title="Pie / Donut view"
                >
                  <PieChart className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-2 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 rounded w-16" />
                  </div>
                  <div className="h-2 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : !hasCategorizedEvents && events.length > 0 ? (
            <div className="py-8 text-center text-xs text-light flex flex-col items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-1">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="font-semibold text-dark text-sm">Clients Data Not Available</div>
              <p className="max-w-xs text-light leading-relaxed text-[11px]">
                Events for this employee have not been processed with AI yet. Click <strong>Auto Categorize with AI</strong> in the meeting log below to detect client accounts and time allocation.
              </p>
            </div>
          ) : clientStats.items.length === 0 ? (
            <div className="py-8 text-center text-xs text-light flex flex-col items-center gap-1.5">
              <HelpCircle className="h-6 w-6 text-muted" />
              <span>No client data available.</span>
            </div>
          ) : clientView === 'bar' ? (
            /* CLIENT BAR VIEW */
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {clientStats.items.map((item, idx) => {
                const tierBadge = item.company
                  ? getCustomerTierBadgeStyle(item.company.customer_tier)
                  : '';
                const barColor = item.isUncategorized
                  ? '#F59E0B'
                  : item.isInternal
                    ? '#94A3B8'
                    : CLIENT_COLORS[idx % CLIENT_COLORS.length];

                return (
                  <div key={item.clientName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="font-semibold text-dark truncate">{item.clientName}</span>
                        {item.company && (
                          <span
                            className={`inline-flex items-center rounded border px-1.5 py-0.2 text-[10px] font-semibold shrink-0 ${tierBadge}`}
                          >
                            {item.company.customer_tier}
                          </span>
                        )}
                        <span className="text-light text-[11px] shrink-0">
                          ({item.count} {item.count === 1 ? 'event' : 'events'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 font-mono font-medium">
                        <span className="text-dark">{item.hours}h</span>
                        <span className="text-light text-[11px] w-8 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(item.percentage, 3)}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* CLIENT PIE / DONUT VIEW */
            <div className="flex flex-col sm:flex-row items-center justify-around gap-5 py-2">
              <div className="relative flex items-center justify-center shrink-0">
                <svg
                  className="h-36 w-36 -rotate-90 transform"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    className="stroke-slate-100"
                    strokeWidth="14"
                    fill="none"
                  />
                  {(() => {
                    let accumulated = 0;
                    return clientStats.items.map((item, idx) => {
                      const strokeColor = item.isUncategorized
                        ? '#F59E0B'
                        : item.isInternal
                          ? '#94A3B8'
                          : CLIENT_COLORS[idx % CLIENT_COLORS.length];
                      const dash = (item.percentage / 100) * donutCircumference;
                      const offset = -(accumulated / 100) * donutCircumference;
                      accumulated += item.percentage;

                      if (dash <= 0) return null;

                      return (
                        <circle
                          key={item.clientName}
                          cx="60"
                          cy="60"
                          r={donutRadius}
                          stroke={strokeColor}
                          strokeWidth="14"
                          strokeDasharray={`${dash} ${donutCircumference}`}
                          strokeDashoffset={offset}
                          fill="none"
                          className="transition-all duration-500"
                        />
                      );
                    });
                  })()}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-lg font-bold text-dark">{clientStats.totalHours}h</span>
                  <span className="text-[10px] text-light uppercase tracking-wider">Total</span>
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto flex-1 w-full text-xs">
                {clientStats.items.map((item, idx) => {
                  const color = item.isUncategorized
                    ? '#F59E0B'
                    : item.isInternal
                      ? '#94A3B8'
                      : CLIENT_COLORS[idx % CLIENT_COLORS.length];

                  return (
                    <div
                      key={item.clientName}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-surface-hover/50 text-[11px]"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-dark truncate font-medium">{item.clientName}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono shrink-0">
                        <span className="text-dark">{item.hours}h</span>
                        <span className="text-light w-7 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
