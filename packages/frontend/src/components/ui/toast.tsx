'use client';

import * as React from 'react';
import { createContext, useContext, useState } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...props, id }]);

    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, props.duration || 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ease-in-out ${
              toast.variant === 'destructive'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-900 border border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                {toast.title && <h3 className="font-medium">{toast.title}</h3>}
                {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

