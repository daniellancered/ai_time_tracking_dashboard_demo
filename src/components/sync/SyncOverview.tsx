'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Employee, SyncMetadata } from '@/types';
import { exportEventsToCSV } from '@/utils';
import SyncSummaryCards from './SyncSummaryCards';
import SyncTriggerForm from './SyncTriggerForm';
import SyncLogsList from './SyncLogsList';
import SyncCacheManager from './SyncCacheManager';

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
  const [isProcessingPending, setIsProcessingPending] = useState<boolean>(false);
  const [categorizeProgress, setCategorizeProgress] = useState<{
    percent: number;
    step: string;
  } | null>(null);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<{
    percent: number;
    step: string;
  } | null>(null);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

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

  const handleCategorizePending = async () => {
    let timer1: NodeJS.Timeout | undefined;
    let timer2: NodeJS.Timeout | undefined;
    let timer3: NodeJS.Timeout | undefined;

    try {
      setIsProcessingPending(true);
      setStatusMessage(null);
      setCategorizeProgress({ percent: 18, step: 'Loading pending raw events...' });

      timer1 = setTimeout(() => {
        setCategorizeProgress({ percent: 52, step: 'Classifying events with AI proxy...' });
      }, 1200);

      timer2 = setTimeout(() => {
        setCategorizeProgress({ percent: 84, step: 'Matching client domains and entities...' });
      }, 3500);

      timer3 = setTimeout(() => {
        setCategorizeProgress({ percent: 94, step: 'Persisting categorized records...' });
      }, 6500);

      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to categorize pending events');
      }

      const data = await res.json();
      setCategorizeProgress({ percent: 100, step: 'Categorization complete!' });

      if (data.metadata) {
        setMetadata(data.metadata);
        setStoredCount(data.metadata.eventsProcessed);
      }

      setStatusMessage({
        type: 'success',
        text: `Successfully categorized ${data.categorizedCount || 0} pending events with AI!`,
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Categorization failed',
      });
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setTimeout(() => {
        setIsProcessingPending(false);
        setCategorizeProgress(null);
      }, 600);
    }
  };

  const handleStartSync = async () => {
    let t1: NodeJS.Timeout | undefined;
    let t2: NodeJS.Timeout | undefined;
    let t3: NodeJS.Timeout | undefined;
    let t4: NodeJS.Timeout | undefined;

    try {
      setIsSyncing(true);
      setStatusMessage(null);
      setSyncProgress({ percent: 15, step: 'Connecting to Google Calendar feeds...' });

      t1 = setTimeout(() => {
        setSyncProgress({ percent: 38, step: 'Ingesting & deduplicating calendar events...' });
      }, 1200);

      t2 = setTimeout(() => {
        setSyncProgress({ percent: 64, step: 'Running OpenAI structured categorization...' });
      }, 3600);

      t3 = setTimeout(() => {
        setSyncProgress({ percent: 85, step: 'Synthesizing client entities & work taxonomy...' });
      }, 7000);

      t4 = setTimeout(() => {
        setSyncProgress({ percent: 95, step: 'Persisting single source of truth...' });
      }, 11000);

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
      setSyncProgress({ percent: 100, step: 'Sync completed successfully!' });

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
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgress(null);
      }, 700);
    }
  };

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
          text: `Exported ${data.items.length} fully processed events across all employees to CSV.`,
        });

        const syncRes = await fetch('/api/sync').catch(() => null);
        if (syncRes && syncRes.ok) {
          const syncData = await syncRes.json();
          if (syncData.metadata) {
            setMetadata(syncData.metadata);
          }
          if (typeof syncData.eventsProcessed === 'number') {
            setStoredCount(syncData.eventsProcessed);
          }
        }
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

  const handleClearCache = async () => {
    if (
      !window.confirm(
        'Are you sure you want to clear all cached categorizations and reset sync metadata?',
      )
    ) {
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
            Calendar Sync & Data Export
          </h1>
          <p className="text-xs text-light mt-0.5">
            Trigger on-demand calendar synchronization, run AI categorization pipelines, and export
            complete datasets.
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

      <SyncSummaryCards
        metadata={metadata}
        isExporting={isExporting}
        isSyncing={isSyncing}
        isProcessingPending={isProcessingPending}
        categorizeProgress={categorizeProgress}
        onExportAll={handleExportAll}
        onCategorizePending={handleCategorizePending}
      />

      <SyncTriggerForm
        employees={employees}
        syncTarget={syncTarget}
        forceAICategorize={forceAICategorize}
        isSyncing={isSyncing}
        syncProgress={syncProgress}
        onSyncTargetChange={setSyncTarget}
        onForceAICategorizeChange={setForceAICategorize}
        onStartSync={handleStartSync}
      />

      <SyncLogsList
        logs={metadata.logs || []}
        isSyncing={isSyncing}
        isClearingLogs={isClearingLogs}
        onClearLogs={handleClearLogs}
      />

      <SyncCacheManager
        storedCount={storedCount}
        isClearing={isClearing}
        isSyncing={isSyncing}
        onClearCache={handleClearCache}
      />
    </div>
  );
}
