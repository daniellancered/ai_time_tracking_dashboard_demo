import { useState, useEffect, useCallback } from 'react';
import type { ProcessedEvent } from '@/types';

export type UseEmployeeCalendarOptions = {
  email?: string;
  initialError?: string | null;
};

export default function useEmployeeCalendar({
  email,
  initialError = null,
}: UseEmployeeCalendarOptions) {
  const [events, setEvents] = useState<ProcessedEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError);

  const loadEvents = useCallback(
    async (forceRefresh = false) => {
      if (!email) {
        setEvents([]);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMsg(null);
        setEvents([]);

        const url = `/api/events?email=${encodeURIComponent(email)}${
          forceRefresh ? '&forceRefresh=true' : ''
        }`;
        const res = await fetch(url, {
          cache: forceRefresh ? 'no-store' : 'default',
        });

        if (!res.ok) {
          throw new Error('Failed to load calendar events for the selected employee');
        }

        const data: ProcessedEvent[] = await res.json();
        setEvents(data);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to fetch calendar events');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    },
    [email],
  );

  useEffect(() => {
    setEvents([]);
    setErrorMsg(null);
    loadEvents();
  }, [loadEvents]);

  const refreshEvents = useCallback(() => {
    return loadEvents(true);
  }, [loadEvents]);

  return {
    events,
    setEvents,
    isLoading,
    errorMsg,
    setErrorMsg,
    refreshEvents,
  };
}
