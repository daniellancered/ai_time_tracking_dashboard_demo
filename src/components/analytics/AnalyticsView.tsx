'use client';

import React, { useState, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import AnalyticsHeader from './AnalyticsHeader';
import EmployeeFilterBanner from './EmployeeFilterBanner';
import AnalyticsPanelTabs from './AnalyticsPanelTabs';
import SummaryCards from './SummaryCards';
import TimeBreakdown from './TimeBreakdown';
import EventTable from '@/components/events/EventTable';
import useEmployeeCalendar from '@/hooks/useEmployeeCalendar';
import type { Employee, Company } from '@/types';
import { exportEventsToCSV, getDateRangeFromPreset, type DateRangePreset } from '@/utils';

type AnalyticsViewProps = {
  employees: Employee[];
  companies: Company[];
  initialEmployeeId?: string;
  errorMsg: string | null;
};

export default function AnalyticsView({
  employees,
  companies,
  initialEmployeeId,
  errorMsg: initialErrorMsg,
}: AnalyticsViewProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    initialEmployeeId || employees[0]?.id || '',
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'events'>('overview');
  const [datePreset, setDatePreset] = useState<DateRangePreset>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const currentEmployee: Employee =
    selectedEmployeeId === 'all'
      ? {
          id: 'all',
          name: 'All Employees',
          email: 'all@smartly.io',
          role: 'Organization Overview',
        }
      : employees.find((emp) => emp.id === selectedEmployeeId) || employees[0];

  const { events, setEvents, isLoading, errorMsg, refreshEvents } = useEmployeeCalendar({
    email: selectedEmployeeId === 'all' ? 'all' : currentEmployee?.email,
    initialError: initialErrorMsg,
  });

  const handleDatePresetChange = (preset: DateRangePreset) => {
    setDatePreset(preset);
    if (preset !== 'custom') {
      const range = getDateRangeFromPreset(preset);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }
  };

  const filteredEvents = useMemo(() => {
    if (!startDate && !endDate) return events;

    return events.filter((ev) => {
      const eventTime = new Date(ev.event.start.dateTime).getTime();
      if (isNaN(eventTime)) return true;

      if (startDate) {
        const startObj = new Date(startDate + 'T00:00:00');
        if (eventTime < startObj.getTime()) return false;
      }

      if (endDate) {
        const endObj = new Date(endDate + 'T23:59:59.999');
        if (eventTime > endObj.getTime()) return false;
      }

      return true;
    });
  }, [events, startDate, endDate]);

  const pendingCount = useMemo(() => {
    return filteredEvents.filter((ev) => !ev.category).length;
  }, [filteredEvents]);

  const totalHours = useMemo(() => {
    const totalMinutes = filteredEvents.reduce((acc, ev) => acc + ev.event.minutesDuration, 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  }, [filteredEvents]);

  const handleExportCSV = () => {
    if (selectedEmployeeId === 'all') {
      exportEventsToCSV(filteredEvents, 'all_employees');
    } else if (currentEmployee) {
      exportEventsToCSV(filteredEvents, currentEmployee.name);
    }
  };

  return (
    <div className="space-y-5 w-full">
      <AnalyticsHeader
        onExportCSV={handleExportCSV}
        isExportDisabled={isLoading || filteredEvents.length === 0}
      />

      <EmployeeFilterBanner
        employees={employees}
        currentEmployee={currentEmployee}
        selectedEmployeeId={selectedEmployeeId}
        onEmployeeSelect={setSelectedEmployeeId}
        datePreset={datePreset}
        onDatePresetChange={handleDatePresetChange}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        isLoading={isLoading}
      />

      {errorMsg && (
        <div className="rounded border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <div>
            <div className="font-semibold">Failed to load calendar events</div>
            <div className="text-red-600 mt-0.5">{errorMsg}</div>
          </div>
        </div>
      )}

      <AnalyticsPanelTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        eventCount={filteredEvents.length}
        pendingCount={pendingCount}
        totalHours={totalHours}
        isLoading={isLoading}
      >
        {activeTab === 'overview' ? (
          <div className="space-y-5">
            <SummaryCards events={filteredEvents} isLoading={isLoading} />
            <TimeBreakdown events={filteredEvents} companies={companies} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-4">
            <EventTable
              initialEvents={filteredEvents}
              companies={companies}
              isLoading={isLoading}
              onEventsChange={setEvents}
              onRefresh={refreshEvents}
            />
          </div>
        )}
      </AnalyticsPanelTabs>
    </div>
  );
}
