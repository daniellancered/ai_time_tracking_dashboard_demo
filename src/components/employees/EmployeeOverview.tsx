import React from 'react';
import { Users, AlertCircle } from 'lucide-react';
import type { Employee } from '@/types';
import EmployeeTable from './EmployeeTable';

type EmployeeOverviewProps = {
  employees: Employee[];
  errorMsg: string | null;
};

export default function EmployeeOverview({ employees, errorMsg }: EmployeeOverviewProps) {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-2 border-b border-border pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-dark flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Employees Directory
          </h1>
          <p className="text-sm text-light mt-0.5">
            Internal team members available for calendar event tracking and AI time allocation.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <div>
            <div className="font-semibold">Failed to load directory data</div>
            <div className="text-xs text-red-600 mt-0.5">{errorMsg}</div>
          </div>
        </div>
      )}

      <EmployeeTable employees={employees} />
    </div>
  );
}
