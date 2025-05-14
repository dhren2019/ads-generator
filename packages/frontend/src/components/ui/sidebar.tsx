'use client';

import * as React from 'react';

export function SidebarInset({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      {children}
    </div>
  );
}

