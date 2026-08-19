import { NextResponse } from 'next/server';
import type { CalendarEvent, Company, ProcessedEvent } from '@/types';
import { categorizeEvents } from '@/lib/categorize';
import { fetchCompanies } from '@/lib/api/resources';
import { saveCategorizedEvents } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      events?: CalendarEvent[];
      companies?: Company[];
    };

    if (!body.events || !Array.isArray(body.events) || body.events.length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty events array in request body.' },
        { status: 400 },
      );
    }

    let companies = body.companies;
    if (!companies || companies.length === 0) {
      companies = await fetchCompanies().catch(() => []);
    }

    const results: ProcessedEvent[] = await categorizeEvents(body.events, companies);

    await saveCategorizedEvents(results);

    return NextResponse.json({ items: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Categorization failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
