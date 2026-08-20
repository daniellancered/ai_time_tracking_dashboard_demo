'use client';

import React from 'react';
import { RefreshCw, Users, Sparkles } from 'lucide-react';
import type { Employee } from '@/types';

type SyncTriggerFormProps = {
  employees: Employee[];
  syncTarget: string;
  forceAICategorize: boolean;
  isSyncing: boolean;
  syncProgress: { percent: number; step: string } | null;
  onSyncTargetChange: (target: string) => void;
  onForceAICategorizeChange: (force: boolean) => void;
  onStartSync: () => void;
};

export default function SyncTriggerForm({
  employees,
  syncTarget,
  forceAICategorize,
  isSyncing,
  syncProgress,
  onSyncTargetChange,
  onForceAICategorizeChange,
  onStartSync,
}: SyncTriggerFormProps) {
  return (
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
            onChange={(e) => onSyncTargetChange(e.target.value)}
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
              onChange={(e) => onForceAICategorizeChange(e.target.checked)}
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

      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
        <button
          type="button"
          onClick={onStartSync}
          disabled={isSyncing}
          className="inline-flex items-center shrink-0 justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60 shadow-xs cursor-pointer h-10"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronizing...' : 'Start Calendar Sync'}</span>
        </button>

        {isSyncing && syncProgress && (
          <div className="flex-1 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 space-y-1.5 min-w-0">
            <div className="flex items-center justify-between text-xs font-semibold text-primary">
              <div className="flex items-center gap-2 truncate min-w-0">
                <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
                <span className="truncate">{syncProgress.step}</span>
              </div>
              <span className="font-mono text-xs shrink-0 pl-2">{syncProgress.percent}%</span>
            </div>
            <div className="w-full bg-primary/15 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${syncProgress.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
