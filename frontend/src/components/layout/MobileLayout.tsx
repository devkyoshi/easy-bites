
import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="mx-auto max-w-md h-full min-h-screen bg-gray-50 overflow-hidden">
      {children}
    </div>
  );
}
