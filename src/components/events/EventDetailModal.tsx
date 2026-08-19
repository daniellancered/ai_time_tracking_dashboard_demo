'use client';

import React from 'react';
import { X, Calendar, Timer, User, Users, Building2, Sparkles, FileText } from 'lucide-react';
import type { ProcessedEvent } from '@/types';
import { formatDateTime, formatDuration, getCategoryBadgeStyle } from '@/utils';

type EventDetailModalProps = {
  event: ProcessedEvent | null;
  onClose: () => void;
};

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  if (!event) return null;

  const categoryStyle = getCategoryBadgeStyle(event.category);
  const rawEvent = event.event;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl rounded-lg border border-border bg-surface shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between border-b border-border p-5 bg-surface-subtle">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${categoryStyle}`}
              >
                {event.category || 'Uncategorized'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-dark">{rawEvent.summary || 'Untitled Event'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-light hover:bg-surface-hover hover:text-dark transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5 text-xs">
          {(event.reason || event.clientName) && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
              {event.reason && (
                <>
                  <div className="flex items-center gap-1.5 font-semibold text-primary text-sm">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>AI Categorization Reason</span>
                  </div>
                  <p className="text-dark leading-relaxed">{event.reason}</p>
                </>
              )}
              {event.clientName && (
                <div
                  className={`flex items-center gap-2 text-dark font-medium ${
                    event.reason ? 'pt-2 border-t border-primary/10' : ''
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>
                    Attributed Client: <strong>{event.clientName}</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded border border-border bg-surface-subtle p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-light font-medium text-[11px]">
                <Calendar className="h-3.5 w-3.5 text-muted" />
                <span>Start Time</span>
              </div>
              <div className="font-semibold text-dark text-xs">
                {formatDateTime(rawEvent.start?.dateTime)}
              </div>
            </div>

            <div className="rounded border border-border bg-surface-subtle p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-light font-medium text-[11px]">
                <Calendar className="h-3.5 w-3.5 text-muted" />
                <span>End Time</span>
              </div>
              <div className="font-semibold text-dark text-xs">
                {formatDateTime(rawEvent.end?.dateTime)}
              </div>
            </div>

            <div className="rounded border border-border bg-surface-subtle p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-light font-medium text-[11px]">
                <Timer className="h-3.5 w-3.5 text-muted" />
                <span>Duration</span>
              </div>
              <div className="font-semibold text-dark text-xs">
                {formatDuration(rawEvent.minutesDuration)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-light font-semibold uppercase tracking-wider text-[11px]">
              <User className="h-3.5 w-3.5 text-muted" />
              <span>Organizer / Creator</span>
            </div>
            <div className="rounded border border-border bg-surface p-2.5 font-mono text-dark text-xs">
              {rawEvent.creator?.email || 'Unknown'}
            </div>
          </div>

          {/* Attendees List */}
          {rawEvent.attendees && rawEvent.attendees.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-light font-semibold uppercase tracking-wider text-[11px]">
                <Users className="h-3.5 w-3.5 text-muted" />
                <span>Attendees ({rawEvent.attendees.length})</span>
              </div>
              <div className="max-h-40 overflow-y-auto rounded border border-border divide-y divide-border">
                {rawEvent.attendees.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-2 flex items-center justify-between text-xs hover:bg-surface-subtle"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {att.displayName && (
                        <span className="font-semibold text-dark truncate">{att.displayName}</span>
                      )}
                      <span className="font-mono text-light truncate text-[11px]">{att.email}</span>
                    </div>
                    {att.responseStatus && (
                      <span className="text-[10px] uppercase font-semibold text-light px-1.5 py-0.5 rounded bg-surface-subtle border border-border">
                        {att.responseStatus}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {rawEvent.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-light font-semibold uppercase tracking-wider text-[11px]">
                <FileText className="h-3.5 w-3.5 text-muted" />
                <span>Event Description</span>
              </div>
              <div className="rounded border border-border bg-surface-subtle p-3 text-xs text-dark whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {rawEvent.description}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4 bg-surface-subtle flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-surface px-4 py-2 text-xs font-medium text-dark border border-border hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
