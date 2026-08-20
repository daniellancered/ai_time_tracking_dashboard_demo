'use client';

import React from 'react';
import { CalendarCheck, Download, Clock, Layers, Sparkles, AlertCircle } from 'lucide-react';
import type { SyncMetadata } from '@/types';
import { formatDateTime } from '@/utils';

type SyncSummaryCardsProps = {
  metadata: SyncMetadata;
  isExporting: boolean;
  isSyncing: boolean;
  isProcessingPending: boolean;
  categorizeProgress: { percent: number; step: string } | null;
  onExportAll: () => void;
  onCategorizePending: () => void;
};

export default function SyncSummaryCards({
  metadata,
  isExporting,
  isSyncing,
  isProcessingPending,
  categorizeProgress,
  onExportAll,
  onCategorizePending,
}: SyncSummaryCardsProps) {
  const unprocessedCount = Math.max(0, metadata.eventsFetched - metadata.eventsProcessed);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3 mb-4">
        <div className="flex items-center gap-2 text-dark font-semibold text-sm">
          <CalendarCheck className="h-4 w-4 text-primary" />
          <span>Organization Ingestion & Sync Summary</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportAll}
            disabled={isExporting || isSyncing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-dark hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            title="Fetch latest events from Google feeds and export all organization events across all employees for Google Sheets evaluation"
          >
            <Download
              className={`h-3.5 w-3.5 ${isExporting ? 'animate-bounce text-primary' : 'text-light'}`}
            />
            <span>{isExporting ? 'Fetching & Exporting...' : 'Export All Events (CSV)'}</span>
          </button>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              metadata.lastSyncTimestamp
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-light border border-slate-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                metadata.lastSyncTimestamp ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            {metadata.lastSyncTimestamp ? 'Synced' : 'Not Synced Yet'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-lg bg-surface-subtle border border-border">
          <div className="flex items-center gap-1.5 text-light text-xs mb-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Last Sync</span>
          </div>
          <div className="text-sm font-bold text-dark">
            {metadata.lastSyncTimestamp ? formatDateTime(metadata.lastSyncTimestamp) : 'Never'}
          </div>
          <div className="text-[11px] text-light mt-0.5">Target: {metadata.lastTarget}</div>
        </div>

        <div className="p-3.5 rounded-lg bg-surface-subtle border border-border">
          <div className="flex items-center gap-1.5 text-light text-xs mb-1">
            <Layers className="h-3.5 w-3.5 text-secondary" />
            <span>Total Events Ingested</span>
          </div>
          <div className="text-2xl font-bold text-dark">{metadata.eventsFetched}</div>
          <div className="text-[11px] text-light mt-0.5">Overall across team members</div>
        </div>

        <div className="p-3.5 rounded-lg bg-surface-subtle border border-border">
          <div className="flex items-center gap-1.5 text-light text-xs mb-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Total Events Processed</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{metadata.eventsProcessed}</div>
          <div className="text-[11px] text-light mt-0.5">Categorized & stored</div>
        </div>

        <div className="p-3.5 rounded-lg bg-surface-subtle border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-light text-xs mb-1">
              <AlertCircle
                className={`h-3.5 w-3.5 ${
                  unprocessedCount > 0 ? 'text-amber-500' : 'text-slate-400'
                }`}
              />
              <span>Unprocessed Events</span>
            </div>
            <div
              className={`text-2xl font-bold ${
                unprocessedCount > 0 ? 'text-amber-600' : 'text-slate-400'
              }`}
            >
              {unprocessedCount}
            </div>
            <div className="text-[11px] text-light mt-0.5">
              {unprocessedCount > 0
                ? 'Awaiting AI classification'
                : 'All events categorized'}
            </div>
          </div>

          {isProcessingPending && categorizeProgress ? (
            <div className="mt-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-medium text-amber-700">
                <span className="truncate max-w-[130px]">{categorizeProgress.step}</span>
                <span className="font-bold shrink-0">{categorizeProgress.percent}%</span>
              </div>
              <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${categorizeProgress.percent}%` }}
                />
              </div>
            </div>
          ) : (
            unprocessedCount > 0 && (
              <button
                type="button"
                onClick={onCategorizePending}
                disabled={isProcessingPending || isSyncing}
                className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-md bg-amber-600 hover:bg-amber-700 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                title="Run AI categorization on all pending unprocessed events"
              >
                <Sparkles className="h-3 w-3" />
                <span>Categorize with AI</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
