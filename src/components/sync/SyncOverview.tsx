'use client';

import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CalendarCheck,
  Sparkles,
  Database,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Users,
  Download,
} from 'lucide-react';
import type { Employee, SyncMetadata } from '@/types';
import { formatDateTime, exportEventsToCSV } from '@/utils';

type SyncOverviewProps = {
  employees: Employee[];
  initialMetadata: SyncMetadata;
  initialStoredCount: number;
};

export default function SyncOverview({
  employees,
  initialMetadata,
  initialStoredCount,
}: SyncOverviewProps) {
  const [metadata, setMetadata] = useState<SyncMetadata>(initialMetadata);
  const [storedCount, setStoredCount] = useState<number>(initialStoredCount);
  const [syncTarget, setSyncTarget] = useState<string>('all');
  const [forceAICategorize, setForceAICategorize] = useState<boolean>(false);
  const [isClearingLogs, setIsClearingLogs] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/sync')
      .then((res) => res.json())
      .then((data) => {
        if (data.metadata) {
          setMetadata(data.metadata);
        }
        if (typeof data.storedCount === 'number') {
          setStoredCount(data.storedCount);
        }
      })
      .catch(() => {});
  }, []);

  const handleExportAll = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/sync/export');
      if (!res.ok) throw new Error('Failed to export all organization events');
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        exportEventsToCSV(data.items, 'all_employees');
        setStatusMessage({
          type: 'success',
          text: `Exported ${data.items.length} events across all employees to CSV. Ready to paste into Google Sheets.`,
        });
      } else {
        throw new Error('No events found to export.');
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Export failed',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      setIsClearingLogs(true);
      const res = await fetch('/api/sync?type=logs', {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to clear logs');
      const data = await res.json();
      if (data.metadata) {
        setMetadata(data.metadata);
      }
      setStatusMessage({
        type: 'success',
        text: 'Sync logs cleared successfully.',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to clear logs',
      });
    } finally {
      setIsClearingLogs(false);
    }
  };

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleStartSync = async () => {
    try {
      setIsSyncing(true);
      setStatusMessage(null);

      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: syncTarget,
          forceAICategorize,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to complete synchronization');
      }

      const data = await res.json();
      if (data.metadata) {
        setMetadata(data.metadata);
        setStoredCount(data.eventsProcessed);
      }

      setStatusMessage({
        type: 'success',
        text: `Sync completed successfully! Fetched ${data.eventsFetched} events and processed ${data.eventsProcessed} categorizations.`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Synchronization failed',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm('Are you sure you want to clear all cached categorizations and reset sync metadata?')) {
      return;
    }

    try {
      setIsClearing(true);
      setStatusMessage(null);

      const res = await fetch('/api/sync', {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to clear cache');

      const data = await res.json();
      if (data.metadata) {
        setMetadata(data.metadata);
      }
      setStoredCount(0);

      setStatusMessage({
        type: 'success',
        text: 'Cache and sync metadata cleared successfully.',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to clear cache',
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-dark flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Calendar & AI Sync Settings
          </h1>
          <p className="text-xs text-light mt-0.5">
            Trigger on-demand calendar synchronization, run AI categorization pipelines, and manage cache.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`rounded-lg border p-4 text-xs flex items-start gap-3 transition-all ${
            statusMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{statusMessage.text}</div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-2 text-dark font-semibold text-sm">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <span>Organization Ingestion & Sync Summary</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportAll}
              disabled={isExporting || isSyncing || (metadata.eventsFetched === 0 && storedCount === 0)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-dark hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              title="Export all organization events across all employees for Google Sheets evaluation"
            >
              <Download className={`h-3.5 w-3.5 ${isExporting ? 'animate-bounce text-primary' : 'text-light'}`} />
              <span>{isExporting ? 'Exporting...' : 'Export All Events (CSV)'}</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="text-sm font-semibold text-dark flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            <span>Trigger Manual Synchronization</span>
          </h2>
          <p className="text-xs text-light mt-0.5">
            Select the sync target scope and configure AI categorization parameters.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-2 w-fit">
            <label className="text-xs font-semibold text-dark flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-light" />
              <span>Sync Scope</span>
            </label>
            <select
              value={syncTarget}
              onChange={(e) => setSyncTarget(e.target.value)}
              disabled={isSyncing}
              className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-xs text-dark font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-60"
            >
              <option value="all">All Team Members ({employees.length} employees)</option>
              <optgroup label="Individual Employee">
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="space-y-2 w-fit">
            <label className="text-xs font-semibold text-dark flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>AI Processing Mode</span>
            </label>
            <div className="p-2.5 rounded-lg border border-border bg-surface-subtle flex items-start gap-2.5">
              <input
                type="checkbox"
                id="forceAICategorize"
                checked={forceAICategorize}
                onChange={(e) => setForceAICategorize(e.target.checked)}
                disabled={isSyncing}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="forceAICategorize" className="text-xs cursor-pointer select-none">
                <span className="font-semibold text-dark block">Force AI Re-categorization</span>
                <span className="text-[11px] text-light block mt-0.5">
                  Bypasses existing cached classifications and re-runs the AI prompt on all events.
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleStartSync}
            disabled={isSyncing}
            className="inline-flex items-center w-fit justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : 'Start Calendar Sync'}</span>
          </button>

          <div className="text-xs text-light">
            {isSyncing && (
              <span className="inline-flex items-center gap-2 text-primary font-medium">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Running calendar sync and AI categorization...</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-dark font-semibold text-sm">
            <Layers className="h-4 w-4 text-primary" />
            <span>Recent Sync Logs</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-light font-medium">
              {metadata.logs && metadata.logs.length > 0
                ? `${metadata.logs.length} logged events`
                : 'No recent logs'}
            </span>
            {metadata.logs && metadata.logs.length > 0 && (
              <button
                type="button"
                onClick={handleClearLogs}
                disabled={isClearingLogs || isSyncing}
                className="text-[11px] font-medium text-light hover:text-red-600 transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-red-50 border border-border"
                title="Clear sync activity logs"
              >
                {isClearingLogs ? 'Clearing...' : 'Clear Logs'}
              </button>
            )}
          </div>
        </div>

        {isSyncing && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 animate-pulse space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Synchronizing with Google Calendar and running AI pipeline...</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-2.5 bg-primary/15 rounded w-3/4" />
              <div className="h-2.5 bg-primary/10 rounded w-1/2" />
            </div>
          </div>
        )}

        {metadata.logs && metadata.logs.length > 0 ? (
          <div className="divide-y divide-border max-h-64 overflow-y-auto pr-1">
            {metadata.logs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-dark truncate">{log.message}</div>
                    <div className="text-[11px] text-light flex items-center gap-2 mt-0.5">
                      <span>Target: {log.target}</span>
                      <span>·</span>
                      <span>{log.eventsFetched} events</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-light font-mono shrink-0">
                  {formatDateTime(log.timestamp)}
                </div>
              </div>
            ))}
          </div>
        ) : !isSyncing ? (
          <div className="py-6 text-center text-xs text-light">
            No sync activity recorded yet. Trigger a sync above or browse employee calendars to generate logs.
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-light shrink-0">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-dark">Data Cache & Storage</h3>
            <p className="text-[11px] text-light mt-0.5">
              {storedCount} cached AI event classifications stored in local store.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearCache}
          disabled={isClearing || isSyncing}
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{isClearing ? 'Clearing...' : 'Clear Cache'}</span>
        </button>
      </div>
    </div>
  );
}
