'use client';

import React from 'react';
import type { ProcessedEvent } from '@/types';
import { getCategoryBadgeStyle, formatTimeOnly } from '@/utils';

export type CalendarDayItem = {
  date: Date;
  isCurrentMonth: boolean;
  dayNumber: number;
  events: ProcessedEvent[];
};

type CalendarGridProps = {
  calendarDays: CalendarDayItem[];
  isLoading: boolean;
  onSelectEvent: (event: ProcessedEvent) => void;
  onOpenDayEvents: (day: { date: Date; events: ProcessedEvent[] }) => void;
};

export default function CalendarGrid({
  calendarDays,
  isLoading,
  onSelectEvent,
  onOpenDayEvents,
}: CalendarGridProps) {
  return (
    <>
      <div className="grid grid-cols-7 border-b border-border bg-surface text-center text-[11px] font-semibold text-light uppercase tracking-wider py-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div
        className={`grid grid-cols-7 divide-x divide-y divide-border bg-surface-subtle transition-opacity duration-200 ${
          isLoading ? 'opacity-40 grayscale-[30%]' : 'opacity-100'
        }`}
      >
        {calendarDays.map((day, idx) => (
          <div
            key={idx}
            className={`min-h-[105px] p-1.5 flex flex-col justify-between transition-colors ${
              day.isCurrentMonth ? 'bg-surface' : 'bg-surface-subtle/50 text-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-semibold inline-flex h-5 w-5 items-center justify-center rounded-full ${
                  day.isCurrentMonth ? 'text-dark' : 'text-slate-400'
                }`}
              >
                {day.dayNumber}
              </span>
              {day.events.length > 0 && (
                <button
                  type="button"
                  onClick={() => onOpenDayEvents({ date: day.date, events: day.events })}
                  className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                >
                  {day.events.length} {day.events.length === 1 ? 'event' : 'events'}
                </button>
              )}
            </div>

            <div className="space-y-1 mt-1 flex-1 overflow-hidden">
              {day.events.slice(0, 3).map((ev) => {
                const catBadge = getCategoryBadgeStyle(ev.category);

                return (
                  <button
                    key={ev.event.id}
                    type="button"
                    onClick={() => onSelectEvent(ev)}
                    title={`${ev.event.summary || 'Untitled'} (${ev.category || 'Uncategorized'})`}
                    className={`w-full text-left truncate rounded px-1.5 py-0.5 text-[10px] font-medium border transition-transform hover:scale-[1.02] cursor-pointer block ${catBadge}`}
                  >
                    <span className="font-semibold mr-1">
                      {formatTimeOnly(ev.event.start?.dateTime || '')}
                    </span>
                    <span>{ev.event.summary || 'Untitled'}</span>
                  </button>
                );
              })}

              {day.events.length > 3 && (
                <button
                  type="button"
                  onClick={() => onOpenDayEvents({ date: day.date, events: day.events })}
                  className="text-[10px] font-semibold text-primary hover:underline pl-1 cursor-pointer block text-left"
                >
                  +{day.events.length - 3} more
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
