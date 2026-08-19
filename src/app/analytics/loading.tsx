import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="h-6 w-64 bg-slate-200 rounded flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary opacity-50 ml-1" />
          </div>
          <div className="h-4 w-96 bg-slate-100 rounded mt-2" />
        </div>
        <div className="h-8 w-36 bg-slate-200 rounded" />
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="h-9 w-52 bg-slate-100 rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-7 w-7 rounded bg-slate-100" />
            </div>
            <div className="h-7 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-36 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-surface p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="h-4 w-36 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-1">
                  <div className="flex justify-between">
                    <div className="h-4 w-1/3 bg-slate-200 rounded" />
                    <div className="h-4 w-12 bg-slate-100 rounded" />
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
