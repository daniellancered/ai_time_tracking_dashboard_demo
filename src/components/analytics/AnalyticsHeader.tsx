'use client';

import React from 'react';
import { Sparkles, Download } from 'lucide-react';

type AnalyticsHeaderProps = {
  onExportCSV: () => void;
  isExportDisabled?: boolean;
};

export default function AnalyticsHeader({
  onExportCSV,
  isExportDisabled = false,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-dark flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Time Tracking & Analytics
        </h1>
        <p className="text-xs text-light mt-0.5">
          Real-time work categorization, client time attribution, and granular calendar logs.
        </p>
      </div>

      <button
        type="button"
        onClick={onExportCSV}
        disabled={isExportDisabled}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-dark hover:bg-surface-hover transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
      >
        <Download className="h-3.5 w-3.5 text-light" />
        <span>Export CSV</span>
      </button>
    </div>
  );
}
