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
  resolvedTheme: 'dark' | 'light';
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

/** Determine if system prefers dark */
function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

/** Apply resolved theme to <html> element */
function applyTheme(theme: Theme): 'dark' | 'light' {
  const resolved: 'dark' | 'light' = theme === 'system'
    ? (systemPrefersDark() ? 'dark' : 'light')
    : theme;

  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
  return resolved;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [theme, _setTheme] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [tableDensity, setTableDensity] = useState<Density>('comfortable');
  const [dashboardConfig, setDashboardConfig] = useState<DashboardWidgetConfig[]>(DEFAULT_WIDGETS);

  const setTheme = (t: Theme) => {
    _setTheme(t);
    const resolved = applyTheme(t);
    setResolvedTheme(resolved);
  };

  // Load from localStorage on mount — apply theme before first paint
  useEffect(() => {
    const saved = localStorage.getItem('transitops_preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedTheme: Theme = parsed.theme ?? 'dark';
        _setTheme(savedTheme);
        const resolved = applyTheme(savedTheme);
        setResolvedTheme(resolved);
        if (parsed.sidebarCollapsed !== undefined) setSidebarCollapsed(parsed.sidebarCollapsed);
        if (parsed.tableDensity) setTableDensity(parsed.tableDensity);
        if (parsed.dashboardConfig) setDashboardConfig(parsed.dashboardConfig);
      } catch {
        // Fallback to dark
        applyTheme('dark');
      }
    } else {
      // Default: dark
      applyTheme('dark');
    }
  }, []);

  // Listen for system preference changes when theme === 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const resolved = applyTheme('system');
      setResolvedTheme(resolved);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

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
      theme, setTheme, resolvedTheme,
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
