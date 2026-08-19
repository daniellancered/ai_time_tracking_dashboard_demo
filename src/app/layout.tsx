import type { Metadata } from 'next';
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'AI Time Tracking Dashboard',
  description: 'Internal AI Time Tracking & Operations MVP',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-app-bg text-dark antialiased">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
