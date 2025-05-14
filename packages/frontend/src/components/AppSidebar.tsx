'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppSidebarContextType {
  isOpen: boolean;
  toggle: () => void;
}

const AppSidebarContext = createContext<AppSidebarContextType | undefined>(undefined);

export function AppSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <AppSidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </AppSidebarContext.Provider>
  );
}

export function useAppSidebar() {
  const context = useContext(AppSidebarContext);
  if (context === undefined) {
    throw new Error('useAppSidebar must be used within an AppSidebarProvider');
  }
  return context;
}

export function AppSidebar() {
  const { isOpen } = useAppSidebar();
  
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0`}>
      <Sidebar />
    </div>
  );
}

export function SidebarInset({ children }: { children: ReactNode }) {
  return (
    <div className="p-4">
      {children}
    </div>
  );
}

