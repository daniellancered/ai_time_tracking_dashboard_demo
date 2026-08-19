'use client';

import React from 'react';
import { X, Building2, Info } from 'lucide-react';
import type { ProcessedEvent } from '@/types';
import { formatDateTime, formatDuration, getCategoryBadgeStyle } from '@/utils';

type DayEventsModalProps = {
  dayData: {
    date: Date;
    events: ProcessedEvent[];
  } | null;
  onClose: () => void;
  onSelectEvent: (event: ProcessedEvent) => void;
};

export default function DayEventsModal({ dayData, onClose, onSelectEvent }: DayEventsModalProps) {
  if (!dayData) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-border p-4 bg-surface-subtle">
          <div>
            <h3 className="text-base font-bold text-dark">
              Events on{' '}
              {dayData.date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </h3>
            <p className="text-xs text-light">{dayData.events.length} calendar events scheduled</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-light hover:bg-surface-hover hover:text-dark transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-border">
          {dayData.events.map((ev) => {
            const catBadge = getCategoryBadgeStyle(ev.category);

            return (
              <div
                key={ev.event.id}
                onClick={() => {
                  onClose();
                  onSelectEvent(ev);
                }}
                className="pt-2.5 first:pt-0 flex items-start justify-between gap-3 hover:bg-surface-hover/50 p-2 rounded transition-colors cursor-pointer"
              >
                <div className="space-y-1 flex-1">
                  <div className="text-xs font-semibold text-dark">
                    {ev.event.summary || 'Untitled Event'}
                  </div>
                  <div className="text-[11px] text-light flex items-center gap-2">
                    <span className="font-mono">{formatDateTime(ev.event.start?.dateTime)}</span>
                    <span>•</span>
                    <span>{formatDuration(ev.event.minutesDuration)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span
                      className={`inline-flex items-center rounded border px-1.5 py-0.2 text-[10px] font-semibold ${catBadge}`}
                    >
                      {ev.category || 'Uncategorized'}
                    </span>
                    {ev.clientName && (
                      <span className="inline-flex items-center gap-1 rounded border border-border bg-surface-subtle px-1.5 py-0.2 text-[10px] text-dark font-medium">
                        <Building2 className="h-3 w-3 text-primary" />
                        <span>{ev.clientName}</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-secondary font-medium hover:underline shrink-0 pt-1"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>Details</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
