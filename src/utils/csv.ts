import type { ProcessedEvent } from '@/types';
import { formatDateTime } from './formatters';

export function exportEventsToCSV(events: ProcessedEvent[], employeeName: string) {
  if (events.length === 0) return;

  const headers = [
    'Event Title',
    'Organizer / Employee',
    'Start Date & Time',
    'Duration (Minutes)',
    'Duration (Hours)',
    'AI Category',
    'Attributed Client',
    'Client ID',
    'AI Classification Reason',
  ];

  const rows = events.map((ev) => {
    const hours = (Math.round((ev.event.minutesDuration / 60) * 10) / 10).toFixed(1);
    const title = `"${(ev.event.summary || 'Untitled').replace(/"/g, '""')}"`;
    const creator = `"${(ev.event.creator?.email || '').replace(/"/g, '""')}"`;
    const date = `"${formatDateTime(ev.event.start?.dateTime)}"`;
    const category = `"${(ev.category || 'Uncategorized').replace(/"/g, '""')}"`;
    const client = `"${(ev.clientName || 'None / Internal').replace(/"/g, '""')}"`;
    const clientId = `"${(ev.clientId || '').replace(/"/g, '""')}"`;
    const reason = `"${(ev.reason || '').replace(/"/g, '""')}"`;

    return [
      title,
      creator,
      date,
      ev.event.minutesDuration,
      hours,
      category,
      client,
      clientId,
      reason,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const sanitizedName = employeeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `time_tracking_${sanitizedName || 'export'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
