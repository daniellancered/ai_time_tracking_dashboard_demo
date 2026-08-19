import fs from 'fs/promises';
import path from 'path';
import type {
  CalendarEvent,
  ProcessedEvent,
  StoredCategorization,
  CategorizedEventsStore,
  RawEventsStore,
  SyncLogEntry,
  SyncMetadata,
} from '@/types';

export type {
  StoredCategorization,
  CategorizedEventsStore,
  RawEventsStore,
  SyncLogEntry,
  SyncMetadata,
};

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const RAW_EVENTS_FILE = path.join(DATA_DIR, 'raw-events.json');
const CATEGORIZED_FILE = path.join(DATA_DIR, 'categorized-events.json');
const SYNC_META_FILE = path.join(DATA_DIR, 'sync-meta.json');

async function ensureFile(filePath: string, defaultContent: string = '{}'): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, defaultContent, 'utf-8');
    }
  } catch (error) {
    console.error(`[storage] Failed to ensure file: ${filePath}`, error);
  }
}

export async function getStoredRawEvents(): Promise<RawEventsStore> {
  await ensureFile(RAW_EVENTS_FILE);
  try {
    const raw = await fs.readFile(RAW_EVENTS_FILE, 'utf-8');
    return JSON.parse(raw) as RawEventsStore;
  } catch (error) {
    console.error('[storage] Failed to read raw events store:', error);
    return {};
  }
}

export async function saveRawEvents(events: CalendarEvent[]): Promise<void> {
  await ensureFile(RAW_EVENTS_FILE);
  try {
    const existing = await getStoredRawEvents();
    let hasChanges = false;

    for (const ev of events) {
      if (ev.id) {
        existing[ev.id] = ev;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await fs.writeFile(RAW_EVENTS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('[storage] Failed to save raw events:', error);
  }
}

export async function getStoredCategorizations(): Promise<CategorizedEventsStore> {
  await ensureFile(CATEGORIZED_FILE);
  try {
    const raw = await fs.readFile(CATEGORIZED_FILE, 'utf-8');
    return JSON.parse(raw) as CategorizedEventsStore;
  } catch (error) {
    console.error('[storage] Failed to read categorized events store:', error);
    return {};
  }
}

export async function saveCategorizedEvents(processedEvents: ProcessedEvent[]): Promise<void> {
  await ensureFile(CATEGORIZED_FILE);
  try {
    const existing = await getStoredCategorizations();
    const now = new Date().toISOString();

    for (const item of processedEvents) {
      if (item.event.id) {
        existing[item.event.id] = {
          category: item.category,
          clientName: item.clientName,
          clientId: item.clientId,
          reason: item.reason,
          updatedAt: now,
        };
      }
    }

    await fs.writeFile(CATEGORIZED_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (error) {
    console.error('[storage] Failed to save categorized events:', error);
  }
}

export async function getSyncMetadata(): Promise<SyncMetadata> {
  await ensureFile(
    SYNC_META_FILE,
    JSON.stringify(
      {
        lastSyncTimestamp: null,
        eventsFetched: 0,
        eventsProcessed: 0,
        lastTarget: 'None',
        logs: [],
      },
      null,
      2,
    ),
  );

  try {
    const raw = await fs.readFile(SYNC_META_FILE, 'utf-8');
    const data = JSON.parse(raw) as Partial<SyncMetadata>;
    const logs = Array.isArray(data.logs) ? data.logs : [];

    const rawEvents = await getStoredRawEvents();
    const categorizations = await getStoredCategorizations();

    const uniqueFetched = Object.keys(rawEvents).length;
    const uniqueProcessed = Object.keys(categorizations).length;
    const overallFetched = Math.max(uniqueFetched, uniqueProcessed);

    return {
      lastSyncTimestamp: data.lastSyncTimestamp ?? null,
      eventsFetched: overallFetched,
      eventsProcessed: uniqueProcessed,
      lastTarget: data.lastTarget ?? 'All Employees',
      logs,
    };
  } catch (error) {
    console.error('[storage] Failed to read sync metadata:', error);
    return {
      lastSyncTimestamp: null,
      eventsFetched: 0,
      eventsProcessed: 0,
      lastTarget: 'All Employees',
      logs: [],
    };
  }
}

export async function recordSyncActivity(entry: {
  target: string;
  eventsFetched: number;
  eventsProcessed: number;
  message: string;
}): Promise<void> {
  await ensureFile(SYNC_META_FILE);
  try {
    const existing = await getSyncMetadata();
    const now = new Date().toISOString();

    const newLog: SyncLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: now,
      target: entry.target,
      eventsFetched: entry.eventsFetched,
      eventsProcessed: entry.eventsProcessed,
      message: entry.message,
    };

    const remainingLogs = (existing.logs || []).filter(
      (log) => log.target.toLowerCase() !== entry.target.toLowerCase(),
    );

    const updatedLogs = [newLog, ...remainingLogs].slice(0, 30);

    const rawEvents = await getStoredRawEvents();
    const categorizations = await getStoredCategorizations();
    const uniqueFetched = Object.keys(rawEvents).length;
    const uniqueProcessed = Object.keys(categorizations).length;
    const overallFetched = Math.max(uniqueFetched, uniqueProcessed);

    const updated: SyncMetadata = {
      lastSyncTimestamp: now,
      eventsFetched: overallFetched,
      eventsProcessed: uniqueProcessed,
      lastTarget: entry.target,
      logs: updatedLogs,
    };

    await fs.writeFile(SYNC_META_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (error) {
    console.error('[storage] Failed to record sync activity:', error);
  }
}

export async function clearStoredData(): Promise<void> {
  try {
    await fs.writeFile(RAW_EVENTS_FILE, JSON.stringify({}, null, 2), 'utf-8');
    await fs.writeFile(CATEGORIZED_FILE, JSON.stringify({}, null, 2), 'utf-8');
    await fs.writeFile(
      SYNC_META_FILE,
      JSON.stringify(
        {
          lastSyncTimestamp: null,
          eventsFetched: 0,
          eventsProcessed: 0,
          lastTarget: 'None',
          logs: [],
        },
        null,
        2,
      ),
      'utf-8',
    );
  } catch (error) {
    console.error('[storage] Failed to clear stored data:', error);
  }
}

export async function clearSyncLogs(): Promise<void> {
  try {
    const existing = await getSyncMetadata();
    const updated: SyncMetadata = { ...existing, logs: [] };
    await fs.writeFile(SYNC_META_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (error) {
    console.error('[storage] Failed to clear sync logs:', error);
  }
}
