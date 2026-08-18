import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 p-4 text-center text-xs text-slate-500">
      &copy; {new Date().getFullYear()} AI Time Tracking Dashboard. All rights reserved.
    </footer>
  );
}
