import type {
  CalendarEvent,
  Company,
  ProcessedEvent,
  AICategorizationOutput,
  EventCategory,
} from '@/types';
import { ALL_CATEGORIES } from '@/constants';
import { calculateDuration } from './formatters';

export function processEvent(
  event: CalendarEvent,
  companies: Company[] = [],
  categorization?: AICategorizationOutput,
): ProcessedEvent {
  const minutesDuration = calculateDuration(event.start?.dateTime, event.end?.dateTime);

  let category: EventCategory | null = null;
  let clientName: string | null = null;
  let clientId: string | null = null;

  if (categorization?.client_name) {
    clientName = categorization.client_name;
    const matchedCompany = companies.find(
      (company) => company.name.toLowerCase() === categorization.client_name?.toLowerCase(),
    );
    if (matchedCompany) {
      clientId = matchedCompany.id;
    }
  }

  if (categorization?.category) {
    const matchedCategory = ALL_CATEGORIES.find(
      (category) => category.toLowerCase() === categorization.category.toLowerCase(),
    );
    category = matchedCategory ?? 'Other internal tasks';
  }

  return {
    event,
    category,
    clientName,
    clientId,
    minutesDuration,
    reason: categorization?.reason ?? '',
  };
}
