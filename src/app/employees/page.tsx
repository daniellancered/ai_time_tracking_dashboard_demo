import React from 'react';
import { fetchEmployees } from '@/lib/api/resources';
import EmployeeOverview from '@/components/employees/EmployeeOverview';
import type { Employee } from '@/types';

export default async function EmployeesPage() {
  let employees: Employee[] = [];
  let errorMsg: string | null = null;

  try {
    const res = await fetchEmployees();
    employees = res.items || [];
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : 'Failed to fetch employees';
  }

  return <EmployeeOverview employees={employees} errorMsg={errorMsg} />;
}
