'use client';

import React, { useMemo } from 'react';
import { Tag, Building2, HelpCircle } from 'lucide-react';
import type { ProcessedEvent, Company, EventCategory } from '@/types';
import { getCategoryBadgeStyle, getCustomerTierBadgeStyle } from '@/utils';

type OverviewBreakdownProps = {
  events: ProcessedEvent[];
  companies: Company[];
  isLoading?: boolean;
};

export default function OverviewBreakdown({
  events,
  companies,
  isLoading = false,
}: OverviewBreakdownProps) {
  const categoryStats = useMemo(() => {
    let totalMinutes = 0;
    const map = new Map<string, { minutes: number; count: number }>();

    for (const ev of events) {
      totalMinutes += ev.minutesDuration;
      const key = ev.category || 'Uncategorized';
      const existing = map.get(key) || { minutes: 0, count: 0 };
      map.set(key, {
        minutes: existing.minutes + ev.minutesDuration,
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

    for (const ev of events) {
      totalMinutes += ev.minutesDuration;
      const key = ev.clientName || 'Internal / Non-Client';
      const existing = map.get(key) || { minutes: 0, count: 0 };

      let matchedCompany: Company | undefined = existing.company;
      if (!matchedCompany && ev.clientName) {
        matchedCompany = companies.find(
          (c) => c.name.toLowerCase() === ev.clientName?.toLowerCase(),
        );
      }

      map.set(key, {
        minutes: existing.minutes + ev.minutesDuration,
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
      };
    });

    items.sort((a, b) => b.hours - a.hours);

    return {
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      items,
    };
  }, [events, companies]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="rounded-lg border border-border bg-surface p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2 text-dark font-semibold text-sm">
              <Tag className="h-4 w-4 text-primary" />
              <span>Time by Category (15 Categories)</span>
            </div>
            <span className="text-xs text-light font-medium">
              {categoryStats.items.length}{' '}
              {categoryStats.items.length === 1 ? 'category' : 'categories'} active
            </span>
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
          ) : categoryStats.items.length > 0 ? (
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {categoryStats.items.map((item) => {
                const isUncategorized = item.category === 'Uncategorized';
                const badgeStyle = getCategoryBadgeStyle(
                  isUncategorized ? null : (item.category as EventCategory),
                );

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
                        className={`h-full rounded-full transition-all duration-300 ${
                          isUncategorized ? 'bg-amber-400' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.max(item.percentage, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-light flex flex-col items-center gap-1.5">
              <HelpCircle className="h-6 w-6 text-muted" />
              <span>No categorized events found for this period.</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2 text-dark font-semibold text-sm">
              <Building2 className="h-4 w-4 text-secondary" />
              <span>Time by Client Account</span>
            </div>
            <span className="text-xs text-light font-medium">
              {clientStats.items.filter((i) => !i.isInternal).length} clients attributed
            </span>
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
          ) : clientStats.items.length > 0 ? (
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {clientStats.items.map((item) => {
                const tierBadge = item.company
                  ? getCustomerTierBadgeStyle(item.company.customer_tier)
                  : '';

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
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.isInternal ? 'bg-slate-400' : 'bg-secondary'
                        }`}
                        style={{ width: `${Math.max(item.percentage, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-light flex flex-col items-center gap-1.5">
              <HelpCircle className="h-6 w-6 text-muted" />
              <span>No client attribution data available.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
