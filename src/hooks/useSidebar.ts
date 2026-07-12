import { useState, useCallback } from 'react';

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
  // Desktop: sidebar collapsed/expanded
  const [isCollapsed, setIsCollapsed] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const toggleCollapse = useCallback(() => setIsCollapsed((prev) => !prev), []);

  return { isOpen, isCollapsed, open, close, toggle, toggleCollapse };
}
