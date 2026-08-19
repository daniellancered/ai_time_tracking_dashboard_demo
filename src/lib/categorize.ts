import type { CalendarEvent, Company, ProcessedEvent, EventCategory } from '@/types';
import { ALL_CATEGORIES } from '@/constants';
import { callAIProxy } from './api/ai-proxy';

type AIBatchEventResult = {
  event_id: string;
  category: EventCategory;
  client_name: string | null;
  reason: string;
};

type AIBatchResponse = {
  results: AIBatchEventResult[];
};

const BATCH_SIZE = 10;

async function categorizeChunk(
  events: CalendarEvent[],
  companies: Company[],
): Promise<ProcessedEvent[]> {
  const prompt = `You are an AI assistant for a team that works with clients.
    Your task is to categorize a batch of ${events.length} Google Calendar events into EXACTLY ONE of the 15 predefined categories and deduce the client name if applicable.

    Here are the 15 valid categories:
    ${ALL_CATEGORIES.map((category, i) => `${i + 1}. ${category}`).join('\n')}

    Known Client Accounts:
    ${companies.map((company) => `- ${company.name}`).join('\n')}

    Events to Categorize:
    ${events
      .map(
        (event, idx) => `---
    Event Index: ${idx + 1}
    Event ID: ${event.id}
    Title: ${event.summary || 'Untitled'}
    Description: ${event.description || 'None'}
    Creator: ${event.creator?.email || 'Unknown'}
    Attendees: ${
          (event.attendees || []).map((a) => `${a.displayName || ''} <${a.email}>`).join(', ') || 'None'
        }`,
      )
      .join('\n\n')}

    Instructions for each event:
    1. Return a result item for EVERY event in the batch, matching its "event_id".
    2. Choose the single best category from the 15 choices above.
    3. Deduce the client_name from attendee email domains, event title, or description. If it's an internal meeting or PTO, return null for client_name.
    4. Provide a brief reason (1-2 sentences).`;

  const response = await callAIProxy<AIBatchResponse>({
    prompt,
    output_schema: {
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              event_id: {
                type: 'string',
              },
              category: {
                type: 'string',
                enum: ALL_CATEGORIES,
              },
              client_name: {
                type: ['string', 'null'],
              },
              reason: {
                type: 'string',
              },
            },
            required: ['event_id', 'category', 'reason'],
          },
        },
      },
      required: ['results'],
    },
  });

  const resultMap = new Map<string, AIBatchEventResult>();
  for (const res of response.results || []) {
    resultMap.set(res.event_id, res);
  }

  return events.map((event, idx) => {
    const aiResult = resultMap.get(event.id) || response.results?.[idx];

    const matchedCategory = ALL_CATEGORIES.find(
      (c) => c.toLowerCase() === aiResult?.category?.toLowerCase(),
    );

    const matchedCompany = aiResult?.client_name
      ? companies.find(
          (company) => company.name.toLowerCase() === aiResult.client_name?.toLowerCase(),
        )
      : null;

    return {
      event,
      category: matchedCategory || 'Other internal tasks',
      clientName: matchedCompany?.name ?? null,
      clientId: matchedCompany?.id ?? null,
      reason: aiResult?.reason || 'Categorized by AI',
    };
  });
}

export async function categorizeEvents(
  events: CalendarEvent[],
  companies: Company[],
  batchSize: number = BATCH_SIZE,
): Promise<ProcessedEvent[]> {
  const chunks: CalendarEvent[][] = [];
  for (let i = 0; i < events.length; i += batchSize) {
    chunks.push(events.slice(i, i + batchSize));
  }

  const chunkResults = await Promise.all(
    chunks.map((chunk) => categorizeChunk(chunk, companies)),
  );

  return chunkResults.flat();
}
