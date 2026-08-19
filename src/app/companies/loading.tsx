import React from 'react';

export default function CompaniesLoading() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      <div className="flex justify-between items-center border-b border-border pb-5">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-80 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-6 h-[400px]" />
    </div>
  );
}
