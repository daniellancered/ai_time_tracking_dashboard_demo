import { NextResponse } from 'next/server';
import { fetchEmployees, fetchEvents, fetchCompanies } from '@/lib/api/resources';
import { categorizeEvents } from '@/lib/categorize';
import {
  getStoredCategorizations,
  getStoredRawEvents,
  saveRawEvents,
  saveCategorizedEvents,
  recordSyncActivity,
} from '@/lib/storage';
import type { CalendarEvent, ProcessedEvent } from '@/types';

export async function GET() {
  try {
    const eventMap = new Map<string, CalendarEvent>();

    const storedRaw = await getStoredRawEvents();
    for (const [id, ev] of Object.entries(storedRaw)) {
      eventMap.set(id, ev);
    }

    const [employees, companies] = await Promise.all([
      fetchEmployees().catch(() => []),
      fetchCompanies().catch(() => []),
    ]);

    await Promise.all(
      employees.map(async (emp) => {
        const [created, attended] = await Promise.all([
          fetchEvents({ creator: emp.email }).catch(() => []),
          fetchEvents({ attendee: emp.email }).catch(() => []),
        ]);
        for (const ev of [...created, ...attended]) {
          if (ev.id && !eventMap.has(ev.id)) {
            eventMap.set(ev.id, ev);
          }
        }
      }),
    );

    const rawEvents = Array.from(eventMap.values());
    await saveRawEvents(rawEvents);

    let storedCategorizations = await getStoredCategorizations();
    const uncategorized = rawEvents.filter(
      (ev) => !storedCategorizations[ev.id] || !storedCategorizations[ev.id].category,
    );

    if (uncategorized.length > 0) {
      try {
        const categorizedItems = await categorizeEvents(uncategorized, companies);
        await saveCategorizedEvents(categorizedItems);
        storedCategorizations = await getStoredCategorizations();

        await recordSyncActivity({
          target: 'All Team Members (Export Pipeline)',
          eventsFetched: rawEvents.length,
          eventsProcessed: Object.keys(storedCategorizations).length,
          message: `Export pipeline fetched ${rawEvents.length} events and processed ${categorizedItems.length} new AI categorizations across all employees.`,
        });
      } catch (catErr) {
        console.error('[export] Failed to categorize pending events during export:', catErr);
      }
    }

    rawEvents.sort((a, b) => {
      const timeA = new Date(a.start?.dateTime || 0).getTime();
      const timeB = new Date(b.start?.dateTime || 0).getTime();
      return timeA - timeB;
    });

    const processedEvents: ProcessedEvent[] = rawEvents.map((event) => {
      const stored = storedCategorizations[event.id];
      return {
        event,
        category: stored?.category ?? null,
        clientName: stored?.clientName ?? null,
        clientId: stored?.clientId ?? null,
        reason: stored?.reason ?? '',
      };
    });

    return NextResponse.json({ items: processedEvents });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to export and process all events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
