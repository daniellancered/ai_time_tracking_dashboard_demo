import { NextResponse } from 'next/server';
import { fetchEmployees, fetchCompanies, fetchEvents } from '@/lib/api/resources';
import { categorizeEvents } from '@/lib/categorize';
import {
  getSyncMetadata,
  recordSyncActivity,
  clearStoredData,
  clearSyncLogs,
  saveRawEvents,
  saveCategorizedEvents,
  getStoredCategorizations,
} from '@/lib/storage';
import type { CalendarEvent, ProcessedEvent } from '@/types';

export async function GET() {
  try {
    const metadata = await getSyncMetadata();
    return NextResponse.json({
      metadata,
      storedCount: metadata.eventsProcessed,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve sync status';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      target?: string;
      forceAICategorize?: boolean;
    };

    const target = body.target || 'all';
    const forceAICategorize = Boolean(body.forceAICategorize);

    const [employees, companies] = await Promise.all([
      fetchEmployees(),
      fetchCompanies(),
    ]);

    const targetEmployees =
      target === 'all'
        ? employees
        : employees.filter((emp) => emp.id === target || emp.email === target);

    if (targetEmployees.length === 0) {
      return NextResponse.json({ error: 'No matching employees found for sync.' }, { status: 400 });
    }

    const eventMap = new Map<string, CalendarEvent>();

    for (const emp of targetEmployees) {
      const created = await fetchEvents({ creator: emp.email }).catch(() => []);
      const attended = await fetchEvents({ attendee: emp.email }).catch(() => []);
      for (const ev of [...created, ...attended]) {
        if (ev.id && !eventMap.has(ev.id)) {
          eventMap.set(ev.id, ev);
        }
      }
    }

    const rawEvents = Array.from(eventMap.values());
    await saveRawEvents(rawEvents);

    const storedCategorizations = await getStoredCategorizations();

    let processedEvents: ProcessedEvent[] = [];

    if (forceAICategorize) {
      processedEvents = await categorizeEvents(rawEvents, companies);
      await saveCategorizedEvents(processedEvents);
    } else {
      const uncategorized = rawEvents.filter((ev) => !storedCategorizations[ev.id]?.category);
      let newlyCategorized: ProcessedEvent[] = [];

      if (uncategorized.length > 0) {
        newlyCategorized = await categorizeEvents(uncategorized, companies);
        await saveCategorizedEvents(newlyCategorized);
      }

      const updatedStore = await getStoredCategorizations();
      processedEvents = rawEvents.map((ev) => ({
        event: ev,
        category: updatedStore[ev.id]?.category ?? null,
        clientName: updatedStore[ev.id]?.clientName ?? null,
        clientId: updatedStore[ev.id]?.clientId ?? null,
        reason: updatedStore[ev.id]?.reason ?? '',
      }));
    }

    const processedCount = processedEvents.filter((e) => Boolean(e.category)).length;
    const isAll = target === 'all';
    const targetEmail = isAll ? 'all' : targetEmployees[0]?.email?.toLowerCase() || target.toLowerCase();
    const message = isAll
      ? `Synced ${rawEvents.length} events across all employees (${processedCount} categorized)`
      : `Synced ${rawEvents.length} events for ${targetEmail} (${processedCount} categorized)`;

    await recordSyncActivity({
      target: isAll ? 'All Employees' : targetEmail,
      eventsFetched: rawEvents.length,
      eventsProcessed: processedCount,
      message,
    });

    const updatedMetadata = await getSyncMetadata();

    return NextResponse.json({
      success: true,
      metadata: updatedMetadata,
      eventsFetched: rawEvents.length,
      eventsProcessed: processedCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync execution failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isLogsOnly = searchParams.get('type') === 'logs';

    if (isLogsOnly) {
      await clearSyncLogs();
      const metadata = await getSyncMetadata();
      return NextResponse.json({
        success: true,
        message: 'Sync logs cleared successfully.',
        metadata,
      });
    }

    await clearStoredData();
    return NextResponse.json({
      success: true,
      message: 'Stored data and cache cleared successfully.',
      metadata: {
        lastSyncTimestamp: null,
        eventsFetched: 0,
        eventsProcessed: 0,
        lastTarget: 'None',
        logs: [],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to clear data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
