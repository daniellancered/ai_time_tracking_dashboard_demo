'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AnalyticsHeader() {
  return (
    <div className="border-b border-border pb-4">
      <h1 className="text-xl font-bold tracking-tight text-dark flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Time Tracking & Analytics
      </h1>
      <p className="text-xs text-light mt-0.5">
        Real-time work categorization, client time attribution, and granular calendar logs.
      </p>
    </div>
  );
}
