import { NextResponse } from 'next/server';
import { fetchEmployees, fetchEvents } from '@/lib/api/resources';
import { getStoredCategorizations, getStoredRawEvents, saveRawEvents } from '@/lib/storage';
import type { CalendarEvent, ProcessedEvent } from '@/types';

export async function GET() {
  try {
    const eventMap = new Map<string, CalendarEvent>();
    const storedRaw = await getStoredRawEvents();

    for (const [id, ev] of Object.entries(storedRaw)) {
      eventMap.set(id, ev);
    }

    if (eventMap.size === 0) {
      const employees = await fetchEmployees();
      for (const emp of employees) {
        const created = await fetchEvents({ creator: emp.email }).catch(() => []);
        const attended = await fetchEvents({ attendee: emp.email }).catch(() => []);
        for (const ev of [...created, ...attended]) {
          if (ev.id && !eventMap.has(ev.id)) {
            eventMap.set(ev.id, ev);
          }
        }
      }
      await saveRawEvents(Array.from(eventMap.values()));
    }

    const rawEvents = Array.from(eventMap.values());
    rawEvents.sort((a, b) => {
      const timeA = new Date(a.start?.dateTime || 0).getTime();
      const timeB = new Date(b.start?.dateTime || 0).getTime();
      return timeA - timeB;
    });

    const storedCategorizations = await getStoredCategorizations();

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
    const message = error instanceof Error ? error.message : 'Failed to export all events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
