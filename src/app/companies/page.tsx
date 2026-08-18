import React from 'react';
import { fetchCompanies, fetchEmployees } from '@/lib/api/resources';
import CompanyOverview from '@/components/companies/CompanyOverview';
import type { Company, Employee } from '@/types';

export default async function CompaniesPage() {
  let companies: Company[] = [];
  let employees: Employee[] = [];
  let errorMsg: string | null = null;

  try {
    [companies, employees] = await Promise.all([fetchCompanies(), fetchEmployees()]);
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : 'Failed to fetch companies';
  }

  return <CompanyOverview companies={companies} employees={employees} errorMsg={errorMsg} />;
}
