'use client';

import React from 'react';
import { PieChart, Sparkles } from 'lucide-react';
import type { SummaryMetrics } from './BarChart';

export type DonutSlice = {
  id: string;
  label: string;
  value: number; // in hours
  percentage: number;
  color: string;
  count?: number;
};

type DonutChartProps = {
  metrics?: SummaryMetrics;
  items?: DonutSlice[];
  totalValue?: number | string;
  totalLabel?: string;
  size?: 'sm' | 'md';
  maxLegendHeight?: string;
};

export default function DonutChart({
  metrics,
  items,
  totalValue,
  totalLabel = 'Total',
  size = 'md',
  maxLegendHeight = 'max-h-56',
}: DonutChartProps) {
  if (metrics) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;

    const clientDash = (metrics.clientPercentage / 100) * circumference;
    const internalDash = (metrics.internalPercentage / 100) * circumference;
    const ptoDash = (metrics.ptoPercentage / 100) * circumference;

    const clientOffset = 0;
    const internalOffset = -clientDash;
    const ptoOffset = -(clientDash + internalDash);

    return (
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-dark flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              <span>Time Allocation Breakdown (Donut Chart)</span>
            </h3>
            <p className="text-xs text-light mt-0.5">
              Proportionate distribution of work categories and leave.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-light">Total Logged:</span>{' '}
            <span className="text-sm font-bold text-dark">{metrics.totalHours} hrs</span>
          </div>
        </div>

        {!metrics.hasCategorized ? (
          <div className="py-8 text-center text-xs text-light flex flex-col items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-muted" />
            <div className="font-semibold text-dark text-sm">Categorization Pending</div>
            <p className="text-xs text-light">
              Run AI Categorization in the meeting log below to view the interactive pie chart.
            </p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
            <div className="relative flex items-center justify-center shrink-0">
              <svg
                className="h-44 w-44 -rotate-90 transform"
                viewBox="0 0 140 140"
                aria-hidden="true"
              >
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className="stroke-slate-100"
                  strokeWidth="16"
                  fill="none"
                />

                {clientDash > 0 && (
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    className="stroke-secondary transition-all duration-500"
                    strokeWidth="16"
                    strokeDasharray={`${clientDash} ${circumference}`}
                    strokeDashoffset={clientOffset}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}

                {internalDash > 0 && (
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    className="stroke-accent-3 transition-all duration-500"
                    strokeWidth="16"
                    strokeDasharray={`${internalDash} ${circumference}`}
                    strokeDashoffset={internalOffset}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}

                {ptoDash > 0 && (
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    className="stroke-amber-500 transition-all duration-500"
                    strokeWidth="16"
                    strokeDasharray={`${ptoDash} ${circumference}`}
                    strokeDashoffset={ptoOffset}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xl font-bold text-dark">{metrics.totalHours}</span>
                <span className="text-[10px] font-medium text-light uppercase tracking-wider">
                  Hours Total
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1 max-w-sm">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-subtle/40">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-secondary shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-dark">Client Work</div>
                    <div className="text-[11px] text-light">{metrics.clientCount} events</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-secondary">{metrics.clientHours} hrs</div>
                  <div className="text-[11px] text-light">{metrics.clientPercentage}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-subtle/40">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-accent-3 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-dark">Internal Work</div>
                    <div className="text-[11px] text-light">{metrics.internalCount} events</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-accent-3">{metrics.internalHours} hrs</div>
                  <div className="text-[11px] text-light">{metrics.internalPercentage}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-subtle/40">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-amber-500 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-dark">Time Off</div>
                    <div className="text-[11px] text-light">{metrics.ptoCount} leave events</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-amber-600">{metrics.ptoHours} hrs</div>
                  <div className="text-[11px] text-light">{metrics.ptoPercentage}%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  const isSmall = size === 'sm';
  const radius = isSmall ? 46 : 54;
  const circumference = 2 * Math.PI * radius;
  const svgSize = isSmall ? 'h-36 w-36' : 'h-44 w-44';
  const viewBox = isSmall ? '0 0 120 120' : '0 0 140 140';
  const center = isSmall ? 60 : 70;
  const strokeWidth = isSmall ? '14' : '16';

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-5 py-2">
      <div className="relative flex items-center justify-center shrink-0">
        <svg className={`${svgSize} -rotate-90 transform`} viewBox={viewBox} aria-hidden="true">
          <circle
            cx={center}
            cy={center}
            r={radius}
            className="stroke-slate-100"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {items.map((item) => {
            const dash = (item.percentage / 100) * circumference;
            const offset = -(accumulatedPercent / 100) * circumference;
            accumulatedPercent += item.percentage;

            if (dash <= 0) return null;

            return (
              <circle
                key={item.id}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={offset}
                fill="none"
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className={`${isSmall ? 'text-lg' : 'text-xl'} font-bold text-dark`}>
            {totalValue}
          </span>
          <span className="text-[10px] text-light uppercase tracking-wider">{totalLabel}</span>
        </div>
      </div>

      <div className={`space-y-2 ${maxLegendHeight} overflow-y-auto flex-1 w-full text-xs`}>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-1.5 rounded hover:bg-surface-hover/50 text-[11px]"
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-dark truncate font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-2 font-mono shrink-0">
              <span className="text-dark">{item.value}h</span>
              <span className="text-light w-7 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
