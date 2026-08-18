import React from 'react';
import { fetchCompanies, fetchEmployees } from '@/lib/api/resources';
import CompanyOverview from '@/components/companies/CompanyOverview';
import type { Company, Employee } from '@/types';

export default async function CompaniesPage() {
  let companies: Company[] = [];
  let employees: Employee[] = [];
  let errorMsg: string | null = null;

  try {
    const [companiesRes, employeesRes] = await Promise.all([fetchCompanies(), fetchEmployees()]);
    companies = companiesRes.items || [];
    employees = employeesRes.items || [];
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : 'Failed to fetch companies';
  }

  return <CompanyOverview companies={companies} employees={employees} errorMsg={errorMsg} />;
}
