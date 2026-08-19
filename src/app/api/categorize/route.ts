import { NextResponse } from 'next/server';
import type { CalendarEvent, Company, ProcessedEvent } from '@/types';
import { categorizeEvents } from '@/lib/categorize';
import { fetchCompanies } from '@/lib/api/resources';
import {
  saveCategorizedEvents,
  getStoredRawEvents,
  getStoredCategorizations,
  getSyncMetadata,
} from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      events?: CalendarEvent[];
      companies?: Company[];
    };

    let eventsToCategorize = body.events;

    if (!eventsToCategorize || !Array.isArray(eventsToCategorize) || eventsToCategorize.length === 0) {
      const storedRaw = await getStoredRawEvents();
      const storedCategorizations = await getStoredCategorizations();
      eventsToCategorize = Object.values(storedRaw).filter(
        (ev) => !storedCategorizations[ev.id]?.category,
      );
    }

    if (eventsToCategorize.length === 0) {
      const metadata = await getSyncMetadata();
      return NextResponse.json({
        items: [],
        message: 'No pending events to categorize.',
        metadata,
      });
    }

    let companies = body.companies;
    if (!companies || companies.length === 0) {
      companies = await fetchCompanies().catch(() => []);
    }

    const results: ProcessedEvent[] = await categorizeEvents(eventsToCategorize, companies);

    await saveCategorizedEvents(results);

    const metadata = await getSyncMetadata();

    return NextResponse.json({
      items: results,
      categorizedCount: results.length,
      metadata,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Categorization failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
