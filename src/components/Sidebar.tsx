import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 min-h-screen">
      <div className="text-xl font-bold tracking-tight text-white mb-6">AI Time Tracker</div>
      <nav className="space-y-2">
        <div className="text-sm font-medium text-slate-400">Navigation</div>
      </nav>
    </aside>
  );
}
