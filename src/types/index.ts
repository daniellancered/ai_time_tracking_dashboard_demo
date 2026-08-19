import type { ALL_CATEGORIES } from '@/constants';

export * from './storage';

export type EventCategory = (typeof ALL_CATEGORIES)[number];

export type ResourceType = 'employees' | 'companies' | 'events' | 'apikey';

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Company = {
  id: string;
  name: string;
  email_domain: string;
  annual_revenue: number;
  customer_tier: number;
  account_owner_id: string;
};

export type EventAttendee = {
  email: string;
  displayName?: string;
  responseStatus?: string;
};

export type CalendarEvent = {
  id: string;
  kind?: string;
  summary: string;
  description?: string;
  creator: {
    email: string;
  };
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  attendees?: EventAttendee[];
  minutesDuration: number;
};

export type ProcessedEvent = {
  event: CalendarEvent;
  category: EventCategory | null;
  clientName: string | null;
  clientId: string | null;
  reason?: string;
};

export type AIProxyRequestPayload<TInput = Record<string, unknown>> = {
  prompt: string;
  input?: TInput;
  output_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
};

export type AIProxyResponsePayload<TOutput = Record<string, unknown>> = {
  status: 'success' | 'error';
  parsed_output?: TOutput;
  raw_content?: string;
  error?: string;
};
