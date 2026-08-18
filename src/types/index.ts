export type ClientWorkCategory =
  | 'Client-facing meetings and comms'
  | 'Strategic meetings / QBRs'
  | 'Contract / commercial work'
  | 'Onboarding and training'
  | 'Analysis and insights'
  | 'Campaign support (beyond scope)'
  | 'Internal client work'
  | 'Partner meetings'
  | 'Travel & socials'
  | 'Troubleshooting (feeds)'
  | 'Troubleshooting (Smartly)';

export type InternalWorkCategory = 'Learning' | 'Team/company calls' | 'Other internal tasks';

export type TimeOffCategory = 'PTO';

export type EventCategory = ClientWorkCategory | InternalWorkCategory | TimeOffCategory;

export type CategoryGroup = 'Client Work' | 'Internal Work' | 'Time Off';

export const CLIENT_WORK_CATEGORIES: readonly ClientWorkCategory[] = [
  'Client-facing meetings and comms',
  'Strategic meetings / QBRs',
  'Contract / commercial work',
  'Onboarding and training',
  'Analysis and insights',
  'Campaign support (beyond scope)',
  'Internal client work',
  'Partner meetings',
  'Travel & socials',
  'Troubleshooting (feeds)',
  'Troubleshooting (Smartly)',
] as const;

export const INTERNAL_WORK_CATEGORIES: readonly InternalWorkCategory[] = [
  'Learning',
  'Team/company calls',
  'Other internal tasks',
] as const;

export const TIME_OFF_CATEGORIES: readonly TimeOffCategory[] = ['PTO'] as const;

export const ALL_CATEGORIES: readonly EventCategory[] = [
  ...CLIENT_WORK_CATEGORIES,
  ...INTERNAL_WORK_CATEGORIES,
  ...TIME_OFF_CATEGORIES,
] as const;

export function getCategoryGroup(category: EventCategory): CategoryGroup {
  if (CLIENT_WORK_CATEGORIES.includes(category as ClientWorkCategory)) {
    return 'Client Work';
  }
  if (INTERNAL_WORK_CATEGORIES.includes(category as InternalWorkCategory)) {
    return 'Internal Work';
  }
  return 'Time Off';
}

export type ResourceType = 'employees' | 'companies' | 'events' | 'apikey';

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type EmployeesApiResponse = {
  kind: string;
  items: Employee[];
  nextPageToken?: string;
};

export type Company = {
  id: string;
  name: string;
  email_domain: string;
  annual_revenue: number;
  customer_tier: number;
  account_owner_id: string;
};

export type CompaniesApiResponse = {
  kind: string;
  items: Company[];
  nextPageToken?: string;
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
};

export type EventsApiResponse = {
  kind: string;
  items: CalendarEvent[];
  nextPageToken?: string;
};

export type ProcessedEvent = CalendarEvent & {
  category: EventCategory;
  categoryGroup: CategoryGroup;
  clientName: string | null;
  clientId: string | null;
  durationMinutes: number;
  durationHours: number;
  confidence?: number;
  reasoning?: string;
  processedAt: string;
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

export type AICategorizationOutput = {
  category: EventCategory;
  client_name: string | null;
  confidence: number;
  reasoning: string;
};

export type CategoryBreakdown = {
  category: EventCategory;
  categoryGroup: CategoryGroup;
  totalMinutes: number;
  totalHours: number;
  eventCount: number;
  percentage: number;
};

export type ClientBreakdown = {
  clientId: string | null;
  clientName: string;
  tier?: number;
  annualRevenue?: number;
  totalMinutes: number;
  totalHours: number;
  eventCount: number;
  percentage: number;
};

export type EmployeeAnalytics = {
  employee: Employee;
  totalHours: number;
  clientWorkHours: number;
  internalWorkHours: number;
  ptoHours: number;
  categoryBreakdown: CategoryBreakdown[];
  clientBreakdown: ClientBreakdown[];
  events: ProcessedEvent[];
};
