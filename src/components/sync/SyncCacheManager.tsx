'use client';

import React from 'react';
import { Database, Trash2 } from 'lucide-react';

type SyncCacheManagerProps = {
  storedCount: number;
  isClearing: boolean;
  isSyncing: boolean;
  onClearCache: () => void;
};

export default function SyncCacheManager({
  storedCount,
  isClearing,
  isSyncing,
  onClearCache,
}: SyncCacheManagerProps) {
  return (
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
        onClick={onClearCache}
        disabled={isClearing || isSyncing}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>{isClearing ? 'Clearing...' : 'Clear Cache'}</span>
      </button>
    </div>
  );
}
