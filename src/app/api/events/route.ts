import { NextResponse } from 'next/server';
import { fetchEvents } from '@/lib/api/resources';
import { getStoredCategorizations } from '@/lib/storage';
import type { CalendarEvent, ProcessedEvent } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Missing email query parameter.' },
        { status: 400 },
      );
    }

    const [created, attended] = await Promise.all([
      fetchEvents({ creator: email }).catch(() => []),
      fetchEvents({ attendee: email }).catch(() => []),
    ]);

    const eventMap = new Map<string, CalendarEvent>();
    for (const ev of [...created, ...attended]) {
      if (ev.id && !eventMap.has(ev.id)) {
        eventMap.set(ev.id, ev);
      }
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

    return NextResponse.json(processedEvents);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch calendar events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
