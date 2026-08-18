import React from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import type { Company, Employee } from '@/types';
import CompanyTable from './CompanyTable';

type CompanyOverviewProps = {
  companies: Company[];
  employees: Employee[];
  errorMsg: string | null;
};

export default function CompanyOverview({ companies, employees, errorMsg }: CompanyOverviewProps) {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2 border-b border-border pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-dark flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            CRM Companies
          </h1>
          <p className="text-sm text-light mt-0.5">
            Client accounts, email domain bindings, ARR tiers, and assigned Customer Success owners.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <div>
            <div className="font-semibold">Failed to load CRM data</div>
            <div className="text-xs text-red-600 mt-0.5">{errorMsg}</div>
          </div>
        </div>
      )}

      <CompanyTable companies={companies} employees={employees} />
    </div>
  );
}
