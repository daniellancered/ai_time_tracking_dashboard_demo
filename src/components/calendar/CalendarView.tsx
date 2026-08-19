'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, AlertCircle, RefreshCw } from 'lucide-react';
import type { ProcessedEvent, Employee } from '@/types';
import useEmployeeCalendar from '@/hooks/useEmployeeCalendar';
import CalendarSidebar from './CalendarSidebar';
import CalendarToolbar from './CalendarToolbar';
import CalendarGrid from './CalendarGrid';
import DayEventsModal from './DayEventsModal';
import EventDetailModal from '@/components/events/EventDetailModal';

type CalendarViewProps = {
  employees: Employee[];
};

export default function CalendarView({ employees }: CalendarViewProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    () => employees[0]?.id || '',
  );

  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{
    date: Date;
    events: ProcessedEvent[];
  } | null>(null);

  const [currentDate, setCurrentDate] = useState(() => new Date());

  const currentEmployee: Employee =
    selectedEmployeeId === 'all'
      ? {
          id: 'all',
          name: 'All Employees',
          email: 'all',
          role: 'Organization Overview',
        }
      : employees.find((emp) => emp.id === selectedEmployeeId) || employees[0];

  const filteredEmployees = useMemo(() => {
    const q = searchEmployeeQuery.toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (emp) => emp.name.toLowerCase().includes(q) || emp.email.toLowerCase().includes(q),
    );
  }, [employees, searchEmployeeQuery]);

  const { events, isLoading, errorMsg } = useEmployeeCalendar({
    email: selectedEmployeeId === 'all' ? 'all' : currentEmployee?.email,
  });

  useEffect(() => {
    if (events.length > 0 && events[0].event.start?.dateTime) {
      const firstDate = new Date(events[0].event.start.dateTime);
      if (!isNaN(firstDate.getTime())) {
        setCurrentDate(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
      }
    }
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      dayNumber: number;
      events: ProcessedEvent[];
    }> = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        dayNumber: prevMonthDays - i,
        events: [],
      });
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      const matchedEvents = events.filter((ev) => {
        const evStart = ev.event.start?.dateTime;
        if (!evStart) return false;
        return evStart.startsWith(dateStr);
      });

      days.push({
        date: dateObj,
        isCurrentMonth: true,
        dayNumber: d,
        events: matchedEvents,
      });
    }

    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        dayNumber: i,
        events: [],
      });
    }

    return days;
  }, [year, month, events]);

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-dark flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Visual Calendar Schedule
          </h1>
          <p className="text-sm text-light mt-0.5">
            Interactive Google Calendar view with color-coded categories and team member switcher.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <CalendarSidebar
          employees={filteredEmployees}
          selectedEmployeeId={selectedEmployeeId}
          onSelectEmployee={setSelectedEmployeeId}
          searchQuery={searchEmployeeQuery}
          onSearchChange={setSearchEmployeeQuery}
          isLoading={isLoading}
        />

        <div className="lg:col-span-9 rounded-lg border border-border bg-surface overflow-hidden flex flex-col relative min-h-[480px]">
          {isLoading && (
            <div className="absolute inset-0 bg-surface/75 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2.5 z-20 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface border border-border shadow-md text-primary">
                <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              </div>
              <div className="text-xs font-semibold text-dark bg-surface px-3 py-1">
                Loading calendar events...
              </div>
            </div>
          )}

          <CalendarToolbar
            monthName={monthName}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            currentEmployee={currentEmployee}
            isLoading={isLoading}
          />

          {errorMsg && (
            <div className="m-4 p-3 rounded border border-red-200 bg-red-50 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <CalendarGrid
            calendarDays={calendarDays}
            isLoading={isLoading}
            onSelectEvent={setSelectedEvent}
            onOpenDayEvents={setSelectedDayEvents}
          />
        </div>
      </div>

      <DayEventsModal
        dayData={selectedDayEvents}
        onClose={() => setSelectedDayEvents(null)}
        onSelectEvent={setSelectedEvent}
      />

      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
