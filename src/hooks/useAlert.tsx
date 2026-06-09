'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Alert } from '@/ui/Alert';
import type { AlertProps } from '@/ui/Alert';

interface AlertContextValue {
  showAlert: (props: Omit<AlertProps, 'onClose'>) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

interface AlertState extends Omit<AlertProps, 'onClose'> {
  id: number;
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  const showAlert = useCallback((props: Omit<AlertProps, 'onClose'>) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { ...props, id }]);
  }, []);

  const closeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      
      {/* Render all alerts stacked */}
      {alerts.map((alert, index) => (
        <div
          key={alert.id}
          style={{
            position: 'fixed',
            top: `${80 + index * 120}px`,
            right: '24px',
            zIndex: 9999,
            // animation: 'slideInFromRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Alert
            {...alert}
            onClose={() => closeAlert(alert.id)}
          />
        </div>
      ))}

      <style jsx global>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
}
