import type { CalendarEvent, Company, ProcessedEvent, EventCategory } from '@/types';
import {
  ALL_CATEGORIES,
  CLIENT_WORK_CATEGORIES,
  INTERNAL_WORK_CATEGORIES,
  PTO_CATEGORIES,
} from '@/constants';
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

    --- VALID CATEGORIES & TAXONOMY ---

    [CLIENT WORK CATEGORIES]
    ${CLIENT_WORK_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join('\n')}

    [INTERNAL WORK CATEGORIES]
    ${INTERNAL_WORK_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join('\n')}

    [TIME OFF CATEGORY]
    ${PTO_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join('\n')}

    --- KNOWN CLIENT ACCOUNTS ---
    ${companies.map((company) => `- ${company.name} (${company.email_domain || 'no domain'})`).join('\n')}

    --- EVENTS TO CATEGORIZE ---
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

    --- CATEGORIZATION GUIDELINES ---
    1. Client Work:
       - Standing syncs, touchpoints, regular client calls with external attendees.
       - Strategic meetings / QBRs: (Always with clients) Long-term planning, quarterly business reviews, roadmap alignment.
       - Contract / commercial work: (Always with clients) Negotiations, proposals, commercial terms, SOW alignment, legal/procurement.
       - Onboarding and training: (Always with clients) Onboarding client teams, sandbox walkthroughs, training new client marketers (NOT internal training).
       - Analysis and insights: (Always with clients) Client data analysis, performance reports, ROI deep-dives, audience insights (NOT internal user research).
       - Campaign support (beyond scope): Extra client work, urgent campaign execution, or launch support not covered by standard scope.
       - Internal client work: Internal preparation, account strategy, war rooms, or launch support for a specific client when no external client attendees are on the invite (e.g., "Internal: Veloura", "Launch support — Kairo Studio").
       - Partner meetings: External partners, vendors, agencies, joint integrations.
       - Travel & socials: Conferences, travel-related blocks, team dinners/socials.
       - Troubleshooting (feeds): Resolving issues with client catalog feeds, data feeds, or API mappings.
       - Troubleshooting (Smartly): Resolving platform/UI issues within Smartly for a client.

    2. Internal Work:
       - Learning: Training courses, webinars, workshops, lunch & learns, internal user research readouts.
       - Team/company calls: Standups, company all-hands, cross-functional team syncs, general company updates.
       - Other internal tasks: Design work, bug bash prep, spec writing, internal documentation, planning, implementation, deliverables, working sessions, quiet work, personal work blocks, focus time, deep work, inbox zero.

    3. Time Off:
       - PTO: Vacation, annual leave, out of office (OOO), or medical/dental appointments outside of work that do not involve work tasks.

    4. Critical Distinction Rules:
       - Personal work blocks, focus time, and deep work must NEVER be marked as PTO; categorize them as "Other internal tasks".
       - Medical/dental/personal appointments with no work activity should be categorized as "PTO".
       - Internal user research or roadmap slice spikes must be categorized as "Learning" or "Other internal tasks", NOT "Analysis and insights" or "Onboarding and training".

    --- INSTRUCTIONS ---
    1. Return a result item for EVERY event in the batch, matching its exact "event_id".
    2. Choose the single best category from the 15 choices above based on these guidelines.
    3. Deduce the client_name from attendee email domains, event title, or description matching the Known Client Accounts list. If it's internal work or PTO, return null for client_name.
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
