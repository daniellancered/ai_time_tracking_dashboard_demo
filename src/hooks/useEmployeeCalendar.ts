import { useState, useEffect } from 'react';
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

        const data: ProcessedEvent[] = await res.json();
        if (isMounted) {
          setEvents(data);
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
  }, [email]);

  return {
    events,
    setEvents,
    isLoading,
    errorMsg,
    setErrorMsg,
  };
}
