import { NextResponse } from 'next/server';
import { fetchEvents } from '@/lib/api/resources';
import { getStoredCategorizations } from '@/lib/storage';
import type { ProcessedEvent } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const creator = searchParams.get('creator');
    const attendee = searchParams.get('attendee');

    if (!creator && !attendee) {
      return NextResponse.json(
        { error: 'Missing creator or attendee query parameter.' },
        { status: 400 },
      );
    }

    const events = await fetchEvents({
      creator: creator || undefined,
      attendee: attendee || undefined,
    });

    const storedCategorizations = await getStoredCategorizations();

    const processedEvents: ProcessedEvent[] = events.map((event) => {
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
