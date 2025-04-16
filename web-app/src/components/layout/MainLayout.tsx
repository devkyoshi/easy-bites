
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TopBar } from './TopBar';
import { DashboardSidebar } from './DashboardSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 p-3 sm:p-4 md:p-6 bg-gray-50 overflow-auto">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 py-2 px-3 sm:py-4 sm:px-6 text-center text-sm text-gray-500">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <p>© {new Date().getFullYear()} Seth Sri Shipping (Pvt) Ltd. All rights reserved.</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <p className="text-xs sm:text-sm">102 Priestswood Avenue, Bracknell, England, RG42 1XQ</p>
                <p className="text-xs sm:text-sm mt-1">+44 7479 389 689 / +44 7807 551 314</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
