'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Calendar,
  Clock,
  Building2,
  Users,
  Info,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { ProcessedEvent, Company } from '@/types';
import { ALL_CATEGORIES } from '@/constants';
import { formatDateTime, formatDuration, getCategoryBadgeStyle } from '@/utils';
import EventDetailModal from './EventDetailModal';

const ITEMS_PER_PAGE = 10;

type EventTableProps = {
  initialEvents: ProcessedEvent[];
  companies: Company[];
  isLoading?: boolean;
  onEventsChange?: (events: ProcessedEvent[]) => void;
  onRefresh?: () => void | Promise<void>;
};

export default function EventTable({
  initialEvents,
  companies,
  isLoading = false,
  onEventsChange,
  onRefresh,
}: EventTableProps) {
  const [statusTab, setStatusTab] = useState<'processed' | 'pending'>('processed');
  const [events, setEvents] = useState<ProcessedEvent[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCategorizing, setIsCategorizing] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(null);

  const { processedCount, pendingCount } = useMemo(() => {
    let proc = 0;
    let pend = 0;
    for (const ev of events) {
      if (ev.category) {
        proc++;
      } else {
        pend++;
      }
    }
    return { processedCount: proc, pendingCount: pend };
  }, [events]);

  const hasUncategorizedEvents = pendingCount > 0;

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, statusTab, events]);

  const handleBatchCategorize = async () => {
    try {
      setIsCategorizing(true);
      const uncategorized = events.filter((e) => !e.category);
      const targetEvents = uncategorized.length > 0 ? uncategorized : events;

      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: targetEvents.map((data) => data.event),
          companies,
        }),
      });

      if (!res.ok) throw new Error('AI Categorization request failed');
      const data = await res.json();
      if (data.items) {
        const updatedMap = new Map<string, ProcessedEvent>();
        for (const item of data.items) {
          if (item.event?.id) {
            updatedMap.set(item.event.id, item);
          }
        }
        const merged = events.map((ev) => updatedMap.get(ev.event.id) || ev);
        setEvents(merged);
        onEventsChange?.(merged);
      }
    } catch (err) {
      console.error('Error categorizing events:', err);
    } finally {
      setIsCategorizing(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (statusTab === 'processed' && !ev.category) return false;
      if (statusTab === 'pending' && Boolean(ev.category)) return false;

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (ev.event.summary && ev.event.summary.toLowerCase().includes(q)) ||
        (ev.event.description && ev.event.description.toLowerCase().includes(q)) ||
        (ev.clientName && ev.clientName.toLowerCase().includes(q)) ||
        (ev.event.creator?.email && ev.event.creator.email.toLowerCase().includes(q)) ||
        (ev.event.attendees && ev.event.attendees.some((a) => a.email.toLowerCase().includes(q)));

      const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [events, statusTab, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = useMemo(() => {
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, startIndex]);

  const startEntry = filteredEvents.length === 0 ? 0 : startIndex + 1;
  const endEntry = Math.min(startIndex + ITEMS_PER_PAGE, filteredEvents.length);

  const handleTabChange = (tab: 'processed' | 'pending') => {
    setStatusTab(tab);
    if (tab === 'pending') {
      setSelectedCategory('all');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-surface border border-border self-start">
          <button
            type="button"
            onClick={() => handleTabChange('processed')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusTab === 'processed'
                ? 'bg-primary text-white shadow-xs'
                : 'text-light hover:text-dark hover:bg-surface-hover'
            }`}
          >
            <span>Processed</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusTab === 'processed'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-50 text-emerald-700 font-medium'
              }`}
            >
              {processedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('pending')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusTab === 'pending'
                ? 'bg-primary text-white shadow-xs'
                : 'text-light hover:text-dark hover:bg-surface-hover'
            }`}
          >
            <span>Pending</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusTab === 'pending'
                  ? 'bg-white/20 text-white'
                  : pendingCount > 0
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-slate-100 text-light font-normal'
              }`}
            >
              {pendingCount}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading || isCategorizing}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-3 py-1.5 text-xs font-medium text-dark hover:bg-surface-hover transition-colors disabled:opacity-50 cursor-pointer"
              title="Fetch latest events from Google Calendar"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-primary' : 'text-light'}`}
              />
              <span>Fetch Latest Events</span>
            </button>
          )}

          {hasUncategorizedEvents && (
            <button
              type="button"
              onClick={handleBatchCategorize}
              disabled={isCategorizing || isLoading || events.length === 0}
              className="inline-flex items-center gap-1.5 rounded bg-primary px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isCategorizing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>AI Categorizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Auto Categorize with AI ({pendingCount})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
              placeholder="Search by event title, client, or attendee..."
              className="w-full h-9 pl-9 pr-3 rounded border border-border bg-surface text-xs text-dark placeholder:text-light/70 focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
            />
          </div>

          {statusTab !== 'pending' && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isLoading}
              className="h-9 px-3 rounded border border-border bg-surface text-xs text-dark focus:outline-none focus:border-primary transition-colors cursor-pointer max-w-[240px] truncate disabled:opacity-60"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-subtle border-b border-border text-light font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Event
                </th>
                <th scope="col" className="py-3 px-4">
                  Date & Time
                </th>
                <th scope="col" className="py-3 px-4">
                  Duration
                </th>
                <th scope="col" className="py-3 px-4">
                  AI Category
                </th>
                <th scope="col" className="py-3 px-4">
                  Client
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-1.5" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-slate-100 rounded w-28" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-slate-100 rounded w-14" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-5 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-5 bg-slate-100 rounded w-20" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="h-4 bg-slate-100 rounded w-12 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : paginatedEvents.length > 0 ? (
                paginatedEvents.map((ev) => {
                  const catStyle = getCategoryBadgeStyle(ev.category);

                  return (
                    <tr key={ev.event.id} className="hover:bg-surface-hover/60 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div
                          className="font-semibold text-dark text-sm truncate"
                          title={ev.event.summary}
                        >
                          {ev.event.summary || 'Untitled Event'}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-light text-[11px]">
                          <span className="truncate font-mono">{ev.event.creator?.email}</span>
                          {ev.event.attendees && ev.event.attendees.length > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-muted shrink-0">
                              <Users className="h-3 w-3" />
                              {ev.event.attendees.length}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-dark font-medium">
                          <Calendar className="h-3.5 w-3.5 text-muted" />
                          <span>{formatDateTime(ev.event.start?.dateTime)}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono font-medium text-dark">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted" />
                          <span>{formatDuration(ev.event.minutesDuration)}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${catStyle}`}
                        >
                          {ev.category || 'Uncategorized'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {ev.clientName ? (
                          <div className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-subtle px-2 py-1 text-xs text-dark font-medium">
                            <Building2 className="h-3 w-3 text-primary" />
                            <span>{ev.clientName}</span>
                          </div>
                        ) : !ev.category ? (
                          <span className="text-light italic text-[11px]">—</span>
                        ) : (
                          <span className="text-light italic text-[11px]">Internal / None</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(ev)}
                          className="inline-flex items-center gap-1 font-medium text-secondary hover:underline cursor-pointer"
                        >
                          <Info className="h-3.5 w-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-light text-xs">
                    {statusTab === 'pending' && pendingCount === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                        <Sparkles className="h-5 w-5 text-primary opacity-70 mb-0.5" />
                        <span className="font-semibold text-dark text-sm">No pending items</span>
                        <span className="text-light text-xs">All events for this employee have been categorized.</span>
                      </div>
                    ) : statusTab === 'processed' && processedCount === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Sparkles className="h-5 w-5 text-muted mb-0.5" />
                        <span className="font-semibold text-dark text-sm">No processed events yet</span>
                        <span className="text-light text-xs">Switch to the Pending tab and run Auto Categorize with AI.</span>
                      </div>
                    ) : (
                      'No calendar events found matching the selected filters.'
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredEvents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-surface-subtle/50 text-xs text-light">
            <div>
              Showing <span className="font-medium text-dark">{startEntry}</span> to{' '}
              <span className="font-medium text-dark">{endEntry}</span> of{' '}
              <span className="font-medium text-dark">{filteredEvents.length}</span> events
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-border bg-surface text-xs font-medium text-dark hover:bg-surface-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <div className="px-2 font-medium text-dark text-xs">
                Page {currentPage} of {totalPages}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-border bg-surface text-xs font-medium text-dark hover:bg-surface-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
