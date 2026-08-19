import React from 'react';
import { fetchEmployees } from '@/lib/api/resources';
import CalendarView from '@/components/calendar/CalendarView';
import type { Employee } from '@/types';

export default async function CalendarPage() {
  let employees: Employee[] = [];

  try {
    employees = await fetchEmployees();
  } catch (err) {
    console.error('Failed to load employees:', err);
  }

  return <CalendarView employees={employees} />;
}
