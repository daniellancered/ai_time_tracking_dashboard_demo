import { useState, useEffect } from 'react';
import type { CalendarEvent, Company, ProcessedEvent } from '@/types';
import { processEvent } from '@/utils';

export type UseEmployeeCalendarOptions = {
  email?: string;
  companies?: Company[];
  initialError?: string | null;
};

export default function useEmployeeCalendar({
  email,
  companies = [],
  initialError = null,
}: UseEmployeeCalendarOptions) {
  const [events, setEvents] = useState<ProcessedEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError);

  useEffect(() => {
    if (!email) {
      setEvents([]);
      return;
    }

    const creator = email;
    let isMounted = true;

    async function loadEvents() {
      try {
        setIsLoading(true);
        setEvents([]);
        setErrorMsg(null);

        const res = await fetch(`/api/events?creator=${encodeURIComponent(creator)}`);
        if (!res.ok) {
          throw new Error('Failed to load calendar events for the selected employee');
        }

        const data: CalendarEvent[] = await res.json();
        if (isMounted) {
          setEvents(data.map((event) => processEvent(event, companies)));
        }
      } catch (err) {
        if (isMounted) {
          setErrorMsg(err instanceof Error ? err.message : 'Failed to fetch calendar events');
          setEvents([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [email, companies]);

  return {
    events,
    setEvents,
    isLoading,
    errorMsg,
    setErrorMsg,
  };
}
