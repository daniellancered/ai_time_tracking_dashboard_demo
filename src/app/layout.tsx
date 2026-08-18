import type { Metadata } from 'next';
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AI Time Tracking Dashboard',
  description: 'Track and analyze time spent using AI tools, models, and agents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <main className="flex-1 p-6">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
