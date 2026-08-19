import React from 'react';
import { fetchEmployees } from '@/lib/api/resources';
import { getSyncMetadata, getStoredCategorizations } from '@/lib/storage';
import SyncOverview from '@/components/sync/SyncOverview';
import type { Employee } from '@/types';

export default async function SyncPage() {
  let employees: Employee[] = [];

  try {
    employees = await fetchEmployees();
  } catch (err) {
    console.error('Failed to load employees for sync page:', err);
  }

  const initialMetadata = await getSyncMetadata();
  const storedCategorizations = await getStoredCategorizations();
  const initialStoredCount = Object.keys(storedCategorizations).length;

  return (
    <SyncOverview
      employees={employees}
      initialMetadata={initialMetadata}
      initialStoredCount={initialStoredCount}
    />
  );
}
