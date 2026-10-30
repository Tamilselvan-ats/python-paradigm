'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import ThemeProvider from './ThemeProvider';
import { useAppStore } from '@/lib/store';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppStore();

  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div
          className="flex-1 flex flex-col transition-all duration-300"
          style={{ marginLeft: sidebarOpen ? 256 : 72 }}
        >
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!bg-card !text-foreground !border !border-card-border',
          duration: 3000,
        }}
      />
    </ThemeProvider>
  );
}
