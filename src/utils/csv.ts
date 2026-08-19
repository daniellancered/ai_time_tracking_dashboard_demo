import type { ProcessedEvent } from '@/types';
import { formatDateTime } from './formatters';

export function exportEventsToCSV(events: ProcessedEvent[], employeeName: string) {
  if (events.length === 0) return;

  const headers = [
    'Event ID',
    'Event Title',
    'Description',
    'Organizer Email',
    'Start Date & Time',
    'Start ISO',
    'End Date & Time',
    'End ISO',
    'Duration (Minutes)',
    'Duration (Hours)',
    'Attendees Count',
    'Attendees (Emails)',
    'AI Category',
    'Client Name',
    'Client ID',
    'AI Categorization Reason',
  ];

  const rows = events.map((ev) => {
    const hours = (Math.round((ev.event.minutesDuration / 60) * 100) / 100).toFixed(2);
    const id = `"${(ev.event.id || '').replace(/"/g, '""')}"`;
    const title = `"${(ev.event.summary || 'Untitled').replace(/"/g, '""')}"`;
    const description = `"${(ev.event.description || '').replace(/"/g, '""')}"`;
    const creator = `"${(ev.event.creator?.email || '').replace(/"/g, '""')}"`;
    const startDate = `"${formatDateTime(ev.event.start?.dateTime)}"`;
    const startIso = `"${(ev.event.start?.dateTime || '').replace(/"/g, '""')}"`;
    const endDate = `"${formatDateTime(ev.event.end?.dateTime)}"`;
    const endIso = `"${(ev.event.end?.dateTime || '').replace(/"/g, '""')}"`;
    const minutes = ev.event.minutesDuration ?? 0;
    const attendees = ev.event.attendees || [];
    const attendeesCount = attendees.length;
    const attendeesEmails = `"${attendees.map((a) => a.email).join(', ').replace(/"/g, '""')}"`;
    const category = `"${(ev.category || 'Uncategorized').replace(/"/g, '""')}"`;
    const client = `"${(ev.clientName || 'None / Internal').replace(/"/g, '""')}"`;
    const clientId = `"${(ev.clientId || '').replace(/"/g, '""')}"`;
    const reason = `"${(ev.reason || '').replace(/"/g, '""')}"`;

    return [
      id,
      title,
      description,
      creator,
      startDate,
      startIso,
      endDate,
      endIso,
      minutes,
      hours,
      attendeesCount,
      attendeesEmails,
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
