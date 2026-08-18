import React from 'react';
import { UserCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-end">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded border border-border bg-surface-subtle px-3 py-1.5 text-xs text-dark font-medium">
          <UserCheck className="h-3.5 w-3.5 text-secondary" />
          <span className="truncate max-w-[220px]">Daniel Lance Red</span>
        </div>
      </div>
    </header>
  );
}
