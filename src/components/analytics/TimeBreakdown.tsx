'use client';

import React, { useState, useMemo } from 'react';
import { Tag, Building2, HelpCircle, Sparkles, BarChart3, PieChart } from 'lucide-react';
import type { ProcessedEvent, Company, EventCategory } from '@/types';
import { CATEGORY_COLORS, CLIENT_COLORS } from '@/constants';
import { getCategoryBadgeStyle, getCustomerTierBadgeStyle } from '@/utils';
import BarChart, { type BarItem } from './BarChart';
import DonutChart, { type DonutSlice } from './DonutChart';

type TimeBreakdownProps = {
  events: ProcessedEvent[];
  companies: Company[];
  isLoading?: boolean;
};

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

  const categoryBarItems = useMemo<BarItem[]>(() => {
    return categoryStats.items.map((item, idx) => {
      const isUncategorized = item.category === 'Uncategorized';
      const badgeStyle = getCategoryBadgeStyle(
        isUncategorized ? null : (item.category as EventCategory),
      );
      const color = isUncategorized
        ? '#F59E0B'
        : CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

      return {
        id: item.category,
        label: item.category,
        badgeStyle,
        count: item.count,
        hours: item.hours,
        percentage: item.percentage,
        color,
      };
    });
  }, [categoryStats.items]);

  const categoryDonutItems = useMemo<DonutSlice[]>(() => {
    return categoryStats.items.map((item, idx) => {
      const isUncategorized = item.category === 'Uncategorized';
      const color = isUncategorized
        ? '#F59E0B'
        : CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

      return {
        id: item.category,
        label: item.category,
        value: item.hours,
        percentage: item.percentage,
        color,
        count: item.count,
      };
    });
  }, [categoryStats.items]);

  const clientBarItems = useMemo<BarItem[]>(() => {
    return clientStats.items.map((item, idx) => {
      const tierBadge = item.company ? `Tier ${item.company.customer_tier}` : undefined;
      const tierBadgeStyle = item.company
        ? getCustomerTierBadgeStyle(item.company.customer_tier)
        : undefined;
      const color = item.isUncategorized
        ? '#F59E0B'
        : item.isInternal
          ? '#94A3B8'
          : CLIENT_COLORS[idx % CLIENT_COLORS.length];

      return {
        id: item.clientName,
        label: item.clientName,
        badge: tierBadge,
        badgeStyle: tierBadgeStyle,
        count: item.count,
        hours: item.hours,
        percentage: item.percentage,
        color,
      };
    });
  }, [clientStats.items]);

  const clientDonutItems = useMemo<DonutSlice[]>(() => {
    return clientStats.items.map((item, idx) => {
      const color = item.isUncategorized
        ? '#F59E0B'
        : item.isInternal
          ? '#94A3B8'
          : CLIENT_COLORS[idx % CLIENT_COLORS.length];

      return {
        id: item.clientName,
        label: item.clientName,
        value: item.hours,
        percentage: item.percentage,
        color,
        count: item.count,
      };
    });
  }, [clientStats.items]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="rounded-lg border border-border bg-surface p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2 text-dark font-semibold text-sm">
              <Tag className="h-4 w-4 text-primary" />
              <span>Time by Category</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-light font-medium hidden sm:inline">
                {isLoading ? (
                  <span className="h-3 w-16 bg-slate-200 rounded animate-pulse inline-block" />
                ) : (
                  `${categoryStats.items.length} ${
                    categoryStats.items.length === 1 ? 'category' : 'categories'
                  }`
                )}
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
            <BarChart items={categoryBarItems} />
          ) : (
            <DonutChart
              items={categoryDonutItems}
              totalValue={`${categoryStats.totalHours}h`}
              size="sm"
            />
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2 text-dark font-semibold text-sm">
              <Building2 className="h-4 w-4 text-secondary" />
              <span>Time by Client</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-light font-medium hidden sm:inline">
                {isLoading ? (
                  <span className="h-3 w-16 bg-slate-200 rounded animate-pulse inline-block" />
                ) : hasCategorizedEvents ? (
                  `${clientStats.items.filter((i) => !i.isInternal && !i.isUncategorized).length} clients`
                ) : (
                  'Pending'
                )}
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
            <BarChart items={clientBarItems} />
          ) : (
            <DonutChart
              items={clientDonutItems}
              totalValue={`${clientStats.totalHours}h`}
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  );
}
