import React from 'react';
import {
  Bell,
  Menu,
  Search,
  Settings,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Info as InfoIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/utils';

interface HeaderProps {
  onMenuClick: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps): React.JSX.Element {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 lg:left-[260px]',
        'h-16 flex items-center justify-between px-4 lg:px-6 gap-4',
        'bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/60 z-30',
        className
      )}
      role="banner"
    >
      {/* Left: Mobile menu + search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile hamburger */}
        <button
          id="mobile-menu-btn"
          type="button"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        {/* Search */}
        <div className="relative hidden sm:flex items-center max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
          <input
            id="global-search"
            type="search"
            placeholder="Search or press Ctrl+K…"
            aria-label="Global search"
            className="w-full pl-9 pr-14 py-2 rounded-lg text-sm input-premium"
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-600 font-medium font-mono pointer-events-none">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700/60">⌃</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700/60">K</kbd>
          </div>
        </div>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <div className="relative">
          <button
            id="notifications-btn"
            type="button"
            aria-label="Notifications (3 unread)"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-150 text-slate-500 hover:text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 btn-base"
            style={{ background: 'rgba(15, 23, 42, 0.4)' }}
          >
            <Bell className="w-4 h-4" />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-200">Notifications</span>
                <span className="text-xs text-blue-400">3 unread</span>
              </div>
              {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} className="px-4 py-3 hover:bg-slate-700/50 transition-colors border-b border-slate-700/40 last:border-0 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-200">{n.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2 border-t border-slate-700 flex justify-between">
                <button className="text-xs font-medium text-slate-400 hover:text-slate-200">Mark all read</button>
                <button className="text-xs font-medium text-slate-400 hover:text-slate-200">Clear all</button>
              </div>
            </div>
          )}
        </div>

        {/* Settings shortcut */}
        <Link
          to="/settings"
          id="settings-link"
          aria-label="Settings"
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <Settings className="w-4.5 h-4.5" />
        </Link>

        {/* User menu */}
        <div className="relative ml-1">
          <button
            id="user-menu-btn"
            type="button"
            aria-haspopup="true"
            aria-expanded={showUserMenu}
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-800 transition-colors group"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user ? getInitials(user.firstName, user.lastName) : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-none">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{user?.role ?? 'Admin'}</p>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-slate-500 hidden md:block transition-transform duration-150',
                showUserMenu && 'rotate-180'
              )}
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-11 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden py-1">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </Link>
              <button
                type="button"
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 transition-colors text-left"
                onClick={() => {
                  setShowUserMenu(false);
                  setShowNotifications(true);
                }}
              >
                <Bell className="w-4 h-4 text-slate-400" />
                Notifications
              </button>
              <Link
                to="/settings"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <InfoIcon className="w-4 h-4 text-slate-400" />
                Help
              </Link>
              <div className="border-t border-slate-700 my-1" />
              <button
                type="button"
                id="logout-btn"
                onClick={logout}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click-outside overlay for dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          aria-hidden
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
}

// ── Mock notifications ───────────────────────────────────────

const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Vehicle TX-5500-D requires maintenance', time: '5 minutes ago' },
  { id: 'n2', title: 'Driver James Carter completed trip #TRP-001', time: '32 minutes ago' },
  { id: 'n3', title: 'Fuel level low on TX-1144-F (10%)', time: '1 hour ago' },
];
