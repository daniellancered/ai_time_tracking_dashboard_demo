'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Globe, DollarSign, UserCheck, Calendar, ChevronDown } from 'lucide-react';
import type { Company, Employee } from '@/types';
import { formatCurrency, getCustomerTierBadgeStyle } from '@/utils';

type CompanyTableProps = {
  companies: Company[];
  employees: Employee[];
};

export default function CompanyTable({ companies, employees }: CompanyTableProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const ownerMap = useMemo(() => {
    const map = new Map<string, Employee>();
    for (const emp of employees) {
      map.set(emp.id, emp);
    }
    return map;
  }, [employees]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const q = searchQuery.toLowerCase();
      const owner = ownerMap.get(company.account_owner_id);
      const matchesSearch =
        !q ||
        company.name.toLowerCase().includes(q) ||
        company.email_domain.toLowerCase().includes(q) ||
        (owner && owner.name.toLowerCase().includes(q));

      const matchesTier =
        selectedTier === 'all' || company.customer_tier.toString() === selectedTier;

      return matchesSearch && matchesTier;
    });
  }, [companies, searchQuery, selectedTier, ownerMap]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, domain, or owner..."
              className="w-full h-9 pl-9 pr-3 rounded border border-border bg-surface text-xs text-dark placeholder:text-light/70 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="h-9 pl-3 pr-8 rounded border border-border bg-surface text-xs text-dark focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
            >
              <option value="all">All Tiers</option>
              <option value="1">Tier 1 (Enterprise)</option>
              <option value="2">Tier 2 (Mid-Market)</option>
              <option value="3">Tier 3 (Growth)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-light" />
          </div>
        </div>

        <div className="text-xs text-light">
          Showing <span className="font-medium text-dark">{filteredCompanies.length}</span> of{' '}
          <span className="font-medium text-dark">{companies.length}</span> companies
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-subtle border-b border-border text-light font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Company
                </th>
                <th scope="col" className="py-3 px-4">
                  Email Domain
                </th>
                <th scope="col" className="py-3 px-4">
                  Customer Tier
                </th>
                <th scope="col" className="py-3 px-4">
                  Annual Revenue (ARR)
                </th>
                <th scope="col" className="py-3 px-4">
                  Account Owner
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => {
                  const tierBadgeClass = getCustomerTierBadgeStyle(company.customer_tier);
                  const owner = ownerMap.get(company.account_owner_id);

                  return (
                    <tr key={company.id} className="hover:bg-surface-hover/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-dark text-sm">{company.name}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-subtle px-2 py-1 text-xs text-dark font-mono">
                          <Globe className="h-3 w-3 text-muted" />
                          <span>{company.email_domain}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${tierBadgeClass}`}
                        >
                          Tier {company.customer_tier}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-dark">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted" />
                          <span>{formatCurrency(company.annual_revenue)}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {owner ? (
                          <div className="flex items-center gap-1.5 text-dark">
                            <UserCheck className="h-3.5 w-3.5 text-primary" />
                            <span>{owner.name}</span>
                          </div>
                        ) : (
                          <span className="text-light italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/events?q=${encodeURIComponent(company.name)}`}
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
                  <td colSpan={6} className="py-8 text-center text-light text-xs">
                    No companies matching your search criteria.
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
