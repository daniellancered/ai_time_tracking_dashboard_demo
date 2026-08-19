import fs from 'fs/promises';
import path from 'path';
import type { ProcessedEvent } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'categorized-events.json');

export type StoredCategorization = {
  category: ProcessedEvent['category'];
  clientName: ProcessedEvent['clientName'];
  clientId: ProcessedEvent['clientId'];
  reason?: string;
  updatedAt: string;
};

export type CategorizedEventsStore = Record<string, StoredCategorization>;

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify({}, null, 2), 'utf-8');
    }
  } catch {
    // Ignored: fallback handled by caller
  }
}

export async function getStoredCategorizations(): Promise<CategorizedEventsStore> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as CategorizedEventsStore;
  } catch {
    return {};
  }
}

export async function saveCategorizedEvents(processedEvents: ProcessedEvent[]): Promise<void> {
  await ensureDataFile();
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

    await fs.writeFile(DATA_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch {
    // Ignored: persistence failure should not break categorization flow
  }
}
