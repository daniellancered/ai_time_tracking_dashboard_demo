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
    Your task is to categorize a batch of ${events.length} Calendar events into EXACTLY ONE of the 15 predefined categories and deduce the client name if applicable.

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


    Categorization Guidelines:
    1. If its Personal work block, focus time, Deep Work etc, don't mark it as PTO
    2. If its an appointment outside work, like medical, dental etc, and doesn't mention any work, mark it as PTO
    3. Learning: training, courses, workshops
    4. Troubleshooting (feeds): resolving issues with data feeds/integrations that send data between systems, usually for a client.
    5. Troubleshooting (Smartly): troubleshooting issues within Smartly.
    6. Team/company calls: standups, all-hands, team syncs, company meetings, general updates
    7. Other internal tasks: design work, bug bash prep, internal documentation, internal planning, implementation, deliverables, working sessions, quiet work, etc
    8. Internal client work: Launch supports. And if it mentions any clients in the title or description, but no client participants. ex. Internal: Veloura
    9. Strategic meetings / QBRs: (Always with clients) Long-term planning, quarterly business reviews, strategy alignment
    10. Contract / commercial work: (Always with clients) Negotiations, proposals, legal, procurement discussions
    11. Analysis and insights: (Always with clients) Data analysis, reporting, insights generation and NOT User research
    12. Campaign support (beyond scope): Extra client work not covered by standard scope
    13. Partner meetings: External partners, agencies, technology vendors, other companies
    14. Travel & socials: Conferences, travel-related, team social events
    15. Onboarding & Training: (Always with clients) Onboarding clients (Not applicable for internal tasks)

    Instructions for each event:
    1. Return a result item for EVERY event in the batch, matching its "event_id".
    2. Choose the single best category from the 15 choices above based on the guidelines.
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
