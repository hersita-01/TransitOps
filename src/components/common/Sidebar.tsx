import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bus,
  Users,
  Route,
  Wrench,
  Receipt,
  BarChart3,
  Settings,
  X,
  ChevronLeft,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/utils';

// ── Navigation config ────────────────────────────────────────

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard',   href: '/dashboard',   icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
  { id: 'nav-fleet',     label: 'Fleet',        href: '/fleet',       icon: <Bus className="w-4.5 h-4.5" /> },
  { id: 'nav-drivers',   label: 'Drivers',      href: '/drivers',     icon: <Users className="w-4.5 h-4.5" /> },
  { id: 'nav-trips',     label: 'Trips',        href: '/trips',       icon: <Route className="w-4.5 h-4.5" /> },
  { id: 'nav-maintenance',label: 'Maintenance', href: '/maintenance', icon: <Wrench className="w-4.5 h-4.5" />, badge: '2' },
  { id: 'nav-expenses',  label: 'Expenses',     href: '/expenses',    icon: <Receipt className="w-4.5 h-4.5" /> },
  { id: 'nav-analytics', label: 'Analytics',    href: '/analytics',   icon: <BarChart3 className="w-4.5 h-4.5" /> },
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: 'nav-settings', label: 'Settings', href: '/settings', icon: <Settings className="w-4.5 h-4.5" /> },
  { id: 'nav-help', label: 'Help Center', href: '/help', icon: <HelpCircle className="w-4.5 h-4.5" /> },
];

// ── Props ────────────────────────────────────────────────────

interface SidebarProps {
  isOpen: boolean;        // mobile open
  isCollapsed: boolean;   // desktop collapsed
  onClose: () => void;
  onToggleCollapse: () => void;
}

// ── Component ────────────────────────────────────────────────

export function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps): React.JSX.Element {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        id="sidebar"
        aria-label="Main navigation"
        className={cn(
          // Base
          'fixed top-0 left-0 h-full z-50 flex flex-col',
          'bg-slate-900 border-r border-slate-700/60',
          'transition-all duration-250 ease-in-out',
          // Desktop: always visible, collapsible width
          'lg:translate-x-0',
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full w-[260px] lg:translate-x-0',
          'print:hidden'
        )}
      >
        {/* Logo / Brand */}
        <div className={cn(
          'flex items-center gap-3 px-4 border-b border-slate-700/60 shrink-0',
          'h-16 transition-all duration-200'
        )}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shrink-0 shadow-lg shadow-blue-500/25">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="text-base font-bold text-white tracking-tight">TransitOps</span>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">Fleet Operations</p>
            </div>
          )}

          {/* Mobile close */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="lg:hidden ml-auto flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Primary navigation">
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Operations
            </p>
          )}

          {NAV_ITEMS.map((item) => (
            <SidebarLink
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.href}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Bottom items */}
        <div className="px-3 py-3 border-t border-slate-700/60 space-y-0.5 shrink-0">
          {BOTTOM_ITEMS.map((item) => (
            <SidebarLink
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.href}
              onClick={onClose}
            />
          ))}

          {/* Collapse toggle (desktop only) */}
          <button
            type="button"
            id="sidebar-collapse-btn"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleCollapse}
            className={cn(
              'hidden lg:flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg',
              'text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-150 text-sm',
              isCollapsed && 'justify-center'
            )}
          >
            <ChevronLeft className={cn('w-4 h-4 shrink-0 transition-transform duration-200', isCollapsed && 'rotate-180')} />
            {!isCollapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Sidebar link ─────────────────────────────────────────────

interface SidebarLinkProps {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

function SidebarLink({ item, isCollapsed, isActive, onClick }: SidebarLinkProps): React.JSX.Element {
  return (
    <NavLink
      id={item.id}
      to={item.href}
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 group relative',
        'text-sm font-medium',
        isActive
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
        isCollapsed && 'justify-center px-2'
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full"
          aria-hidden
        />
      )}

      <span className="shrink-0">{item.icon}</span>

      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Tooltip on collapsed */}
      {isCollapsed && (
        <div
          className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 shadow-lg whitespace-nowrap
                     opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50"
          aria-hidden
        >
          {item.label}
          {item.badge && <span className="ml-1.5 text-red-400">({item.badge})</span>}
        </div>
      )}
    </NavLink>
  );
}
