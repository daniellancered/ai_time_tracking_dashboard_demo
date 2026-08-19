import type { CalendarEvent, ProcessedEvent } from './index';

export type StoredCategorization = {
  category: ProcessedEvent['category'];
  clientName: ProcessedEvent['clientName'];
  clientId: ProcessedEvent['clientId'];
  reason?: string;
  updatedAt: string;
};

export type CategorizedEventsStore = Record<string, StoredCategorization>;

export type RawEventsStore = Record<string, CalendarEvent>;

export type SyncLogEntry = {
  id: string;
  timestamp: string;
  target: string;
  eventsFetched: number;
  eventsProcessed: number;
  message: string;
};

export type SyncMetadata = {
  lastSyncTimestamp: string | null;
  eventsFetched: number;
  eventsProcessed: number;
  lastTarget: string;
  logs: SyncLogEntry[];
};
