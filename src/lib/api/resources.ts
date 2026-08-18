import type { CalendarEvent, Company, Employee, ResourceType } from '@/types';

type QueryParams = Record<string, string | number | boolean | undefined | null>;

type ApiResponse<T> = {
  kind?: string;
  items?: T[];
  nextPageToken?: string;
};

async function fetchFromResources<T>(resource: ResourceType, params: QueryParams = {}): Promise<T> {
  const baseUrl = process.env.RESOURCES_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error('Required variables (RESOURCES_BASE_URL and API_KEY) are not defined.');
  }

  const url = new URL(baseUrl);
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('resource', resource);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`[${resource}] ${response.status}: ${errorText || response.statusText}`);
  }

  const data = (await response.json()) as T;
  return data;
}

export async function fetchEmployees(): Promise<Employee[]> {
  const data = await fetchFromResources<ApiResponse<Employee>>('employees');
  return data.items || [];
}

export async function fetchCompanies(): Promise<Company[]> {
  const data = await fetchFromResources<ApiResponse<Company>>('companies');
  return data.items || [];
}

export async function fetchEvents(params: {
  creator?: string;
  attendee?: string;
}): Promise<CalendarEvent[]> {
  if (!params.creator && !params.attendee) {
    throw new Error('Events query requires at least one filter: creator or attendee email.');
  }
  const data = await fetchFromResources<ApiResponse<CalendarEvent>>('events', params);
  return data.items || [];
}
