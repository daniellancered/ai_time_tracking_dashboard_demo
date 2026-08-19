import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function SyncLoading() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-slate-200" />
          <div className="h-6 w-56 rounded bg-slate-200" />
        </div>
        <div className="h-3 w-80 rounded bg-slate-100 mt-1" />
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="h-4 w-48 rounded bg-slate-200" />
          <div className="h-5 w-16 rounded-full bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3.5 rounded-lg bg-surface-subtle border border-border space-y-2">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-6 w-16 rounded bg-slate-300" />
              <div className="h-2.5 w-28 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 shadow-xs space-y-4">
        <div className="h-4 w-44 rounded bg-slate-200" />
        <div className="space-y-2">
          <div className="h-9 w-64 rounded-lg bg-slate-100" />
          <div className="h-10 w-full rounded-lg bg-slate-50" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-primary/20" />
      </div>

      <div className="flex items-center justify-center py-6 text-xs text-light gap-2">
        <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
        <span>Loading sync configuration...</span>
      </div>
    </div>
  );
}
