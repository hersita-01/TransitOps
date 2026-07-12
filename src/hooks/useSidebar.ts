import { useState, useCallback } from 'react';
import { usePreferences } from '@/context/PreferencesContext';

interface UseSidebarReturn {
  isOpen: boolean;
  isCollapsed: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleCollapse: () => void;
}

export function useSidebar(): UseSidebarReturn {
  // Mobile: sidebar open/close
  const [isOpen, setIsOpen] = useState(false);
  // Desktop: sidebar collapsed/expanded from context
  const { sidebarCollapsed: isCollapsed, setSidebarCollapsed } = usePreferences();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const toggleCollapse = useCallback(() => setSidebarCollapsed(!isCollapsed), [isCollapsed, setSidebarCollapsed]);

  return { isOpen, isCollapsed, open, close, toggle, toggleCollapse };
}
