import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from './ToastContext';

interface DemoContextValue {
  isDemoMode: boolean;
  enableDemoMode: () => void;
  resetDemoData: () => void;
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  // Demo mode is on by default since we have no backend
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const { toast } = useToast();

  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true);
    toast('info', 'Demo Mode Enabled', 'Using mock data for demonstration purposes.');
  }, [toast]);

  const resetDemoData = useCallback(() => {
    // In a real app, this would clear local stores, reload mock data, etc.
    // For now we just simulate a page reload or state reset
    toast('success', 'Data Reset', 'All demo data has been restored to default state.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, [toast]);

  return (
    <DemoContext.Provider value={{ isDemoMode, enableDemoMode, resetDemoData }}>
      {children}
    </DemoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
