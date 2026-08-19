'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  BarChart3,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Employees',
    href: '/employees',
    icon: Users,
  },
  {
    name: 'Companies',
    href: '/companies',
    icon: Building2,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: CalendarDays,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`shrink-0 border-r border-border bg-surface flex flex-col justify-between transition-all duration-200 ease-in-out ${
        isExpanded ? 'w-60' : 'w-16'
      }`}
    >
      <div>
        <div
          className={`h-16 flex items-center border-b border-border px-3.5 ${
            isExpanded ? 'justify-between' : 'justify-center'
          }`}
        >
          {isExpanded ? (
            <>
              <div className="flex items-center gap-2.5 overflow-hidden pl-1">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-white font-bold text-sm">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-sm tracking-tight text-dark leading-none">
                    Smartly
                  </div>
                  <div className="text-[11px] text-light mt-0.5">Time Tracking</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="flex h-7 w-7 items-center justify-center rounded text-light hover:bg-surface-hover hover:text-dark transition-colors"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <Clock className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className={`py-4 space-y-1 ${isExpanded ? 'px-3' : 'px-2'}`}>
          {isExpanded && (
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-light">
              Main Menu
            </div>
          )}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isExpanded ? item.name : undefined}
                className={`flex items-center rounded transition-colors ${
                  isExpanded
                    ? 'gap-3 px-3 py-2 text-sm font-medium'
                    : 'h-10 w-10 justify-center mx-auto'
                } ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-light hover:bg-surface-hover hover:text-dark'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'text-light'}`} />
                {isExpanded && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border p-3">
        {isExpanded ? (
          <div className="text-center text-[11px] text-light">
            &copy; {new Date().getFullYear()} AI Time Tracking
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="flex h-8 w-8 items-center justify-center rounded text-light hover:bg-surface-hover hover:text-dark transition-colors"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
