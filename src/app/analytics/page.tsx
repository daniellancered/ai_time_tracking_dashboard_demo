import React from 'react';
import { fetchCompanies, fetchEmployees } from '@/lib/api/resources';
import AnalyticsView from '@/components/analytics/AnalyticsView';
import type { Company, Employee } from '@/types';

type AnalyticsPageProps = {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
};

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  let employees: Employee[] = [];
  let companies: Company[] = [];
  let errorMsg: string | null = null;

  try {
    employees = await fetchEmployees();
    companies = await fetchCompanies();
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : 'Failed to fetch base directory data';
  }

  const { id } = (await searchParams) ?? {};
  const initialEmployeeId = id && employees.some((emp) => emp.id === id) ? id : undefined;

  return (
    <AnalyticsView
      employees={employees}
      companies={companies}
      initialEmployeeId={initialEmployeeId}
      errorMsg={errorMsg}
    />
  );
}
