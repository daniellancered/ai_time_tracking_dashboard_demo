'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, Briefcase, Mail } from 'lucide-react';
import type { Employee } from '@/types';
import { getInitials, getRoleBadgeStyle } from '@/utils';

type EmployeeTableProps = {
  employees: Employee[];
};

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q),
    );
  }, [employees, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, role, or ID..."
            className="w-full h-9 pl-9 pr-3 rounded border border-border bg-surface text-xs text-dark placeholder:text-light/70 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="text-xs text-light">
          Showing <span className="font-medium text-dark">{filteredEmployees.length}</span> of{' '}
          <span className="font-medium text-dark">{employees.length}</span> employees
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-subtle border-b border-border text-light font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Employee
                </th>
                <th scope="col" className="py-3 px-4">
                  Role
                </th>
                <th scope="col" className="py-3 px-4">
                  Email
                </th>
                <th scope="col" className="py-3 px-4">
                  Employee ID
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => {
                  const initials = getInitials(emp.name);
                  const badgeClass = getRoleBadgeStyle(emp.role);

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-surface-hover/60 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-100 text-dark font-semibold text-xs border border-border">
                            {initials}
                          </div>
                          <span className="font-semibold text-dark text-sm">
                            {emp.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium ${badgeClass}`}
                        >
                          <Briefcase className="h-3 w-3" />
                          {emp.role}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-light">
                          <Mail className="h-3.5 w-3.5 text-muted" />
                          <span className="font-mono text-dark select-all">
                            {emp.email}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className="font-mono text-light text-[11px]"
                          title={emp.id}
                        >
                          {emp.id.slice(0, 8)}...
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/events?email=${encodeURIComponent(emp.email)}`}
                          className="inline-flex items-center gap-1 font-medium text-secondary hover:underline"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          View Events →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-light text-xs"
                  >
                    No employees matching &ldquo;{searchQuery}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
