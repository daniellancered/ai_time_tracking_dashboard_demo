'use client';

import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';
import type { SyncLogEntry } from '@/types';
import { formatDateTime } from '@/utils';

type SyncLogsListProps = {
  logs: SyncLogEntry[];
  isSyncing: boolean;
  isClearingLogs: boolean;
  onClearLogs: () => void;
};

export default function SyncLogsList({
  logs,
  isSyncing,
  isClearingLogs,
  onClearLogs,
}: SyncLogsListProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-dark font-semibold text-sm">
          <Layers className="h-4 w-4 text-primary" />
          <span>Recent Sync Logs</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-light font-medium">
            {logs && logs.length > 0 ? `${logs.length} logged events` : 'No recent logs'}
          </span>
          {logs && logs.length > 0 && (
            <button
              type="button"
              onClick={onClearLogs}
              disabled={isClearingLogs || isSyncing}
              className="text-[11px] font-medium text-light hover:text-red-600 transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-red-50 border border-border"
              title="Clear sync activity logs"
            >
              {isClearingLogs ? 'Clearing...' : 'Clear Logs'}
            </button>
          )}
        </div>
      </div>

      {logs && logs.length > 0 ? (
        <div className="divide-y divide-border max-h-64 overflow-y-auto pr-1">
          {logs.map((log) => (
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
  );
}
