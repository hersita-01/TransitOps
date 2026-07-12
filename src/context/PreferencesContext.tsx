import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'system';
type Density = 'compact' | 'comfortable';

export interface DashboardWidgetConfig {
  id: string;
  visible: boolean;
  order: number;
}

interface PreferencesContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  tableDensity: Density;
  setTableDensity: (d: Density) => void;
  dashboardConfig: DashboardWidgetConfig[];
  setDashboardConfig: (cfg: DashboardWidgetConfig[]) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

const DEFAULT_WIDGETS: DashboardWidgetConfig[] = [
  { id: 'summary', visible: true, order: 0 },
  { id: 'fleet-health', visible: true, order: 1 },
  { id: 'active-alerts', visible: true, order: 2 },
  { id: 'recent-timeline', visible: true, order: 3 },
  { id: 'trip-map', visible: true, order: 4 },
];

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [tableDensity, setTableDensity] = useState<Density>('comfortable');
  const [dashboardConfig, setDashboardConfig] = useState<DashboardWidgetConfig[]>(DEFAULT_WIDGETS);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('transitops_preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.sidebarCollapsed !== undefined) setSidebarCollapsed(parsed.sidebarCollapsed);
        if (parsed.tableDensity) setTableDensity(parsed.tableDensity);
        if (parsed.dashboardConfig) setDashboardConfig(parsed.dashboardConfig);
      } catch {
        console.error('Failed to parse preferences');
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('transitops_preferences', JSON.stringify({
      theme,
      sidebarCollapsed,
      tableDensity,
      dashboardConfig
    }));
  }, [theme, sidebarCollapsed, tableDensity, dashboardConfig]);

  return (
    <PreferencesContext.Provider value={{
      theme, setTheme,
      sidebarCollapsed, setSidebarCollapsed,
      tableDensity, setTableDensity,
      dashboardConfig, setDashboardConfig
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
