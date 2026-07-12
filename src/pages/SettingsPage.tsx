import React, { useState } from 'react';
import { Save, User, Bell, Shield, Palette } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance';

const TABS: Array<{ id: SettingsTab; label: string; icon: React.ReactNode }> = [
  { id: 'profile',       label: 'Profile',       icon: <User className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications',  icon: <Bell className="w-4 h-4" /> },
  { id: 'security',      label: 'Security',       icon: <Shield className="w-4 h-4" /> },
  { id: 'appearance',    label: 'Appearance',     icon: <Palette className="w-4 h-4" /> },
];

export function SettingsPage(): React.JSX.Element {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);

  function handleSave(): void {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <PageTitle
        title="Settings"
        subtitle="Manage your account and platform preferences"
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Settings' }]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-52 shrink-0">
          <nav className="space-y-1" aria-label="Settings navigation">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-2xl bg-slate-800/60 border border-slate-700/60 p-6">
          {activeTab === 'profile' && (
            <div id="settings-profile-panel">
              <h2 className="text-base font-semibold text-slate-200 mb-5">Profile Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { id: 'first-name', label: 'First Name', defaultValue: user?.firstName ?? '' },
                  { id: 'last-name',  label: 'Last Name',  defaultValue: user?.lastName ?? '' },
                  { id: 'email',      label: 'Email',      defaultValue: user?.email ?? '',    type: 'email', span: true },
                ].map((field) => (
                  <div key={field.id} className={field.span ? 'sm:col-span-2' : ''}>
                    <label htmlFor={`settings-${field.id}`} className="block text-xs font-medium text-slate-400 mb-1.5">
                      {field.label}
                    </label>
                    <input
                      id={`settings-${field.id}`}
                      type={field.type ?? 'text'}
                      defaultValue={field.defaultValue}
                      className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-400 mb-1.5">Role</p>
                <div className="px-3 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-sm text-slate-300 capitalize">
                  {user?.role ?? 'admin'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div id="settings-notifications-panel">
              <h2 className="text-base font-semibold text-slate-200 mb-5">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { id: 'notif-maintenance', label: 'Maintenance Alerts', description: 'Get notified when a vehicle is due for service or overdue', defaultChecked: true },
                  { id: 'notif-trips',       label: 'Trip Updates',       description: 'Notifications when trips start, end, or are cancelled', defaultChecked: true },
                  { id: 'notif-fuel',        label: 'Low Fuel Alerts',    description: 'Alert when a vehicle fuel level drops below 20%', defaultChecked: true },
                  { id: 'notif-driver',      label: 'Driver Status',      description: 'Updates when a driver goes on/off duty', defaultChecked: false },
                ].map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-700/40 border border-slate-700/60">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                      <input id={item.id} type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                      <div className="w-10 h-5.5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div id="settings-security-panel">
              <h2 className="text-base font-semibold text-slate-200 mb-5">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="settings-current-password" className="block text-xs font-medium text-slate-400 mb-1.5">Current Password</label>
                  <input id="settings-current-password" type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="settings-new-password" className="block text-xs font-medium text-slate-400 mb-1.5">New Password</label>
                  <input id="settings-new-password" type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="settings-confirm-password" className="block text-xs font-medium text-slate-400 mb-1.5">Confirm New Password</label>
                  <input id="settings-confirm-password" type="password" placeholder="••••••••" className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-700 border border-slate-600 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <p className="text-xs text-blue-300">Two-factor authentication is not yet configured. Enable it for enhanced security once backend integration is complete.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div id="settings-appearance-panel">
              <h2 className="text-base font-semibold text-slate-200 mb-5">Appearance</h2>
              <p className="text-sm text-slate-400 mb-6">TransitOps is designed for a dark enterprise interface. Additional themes will be available in a future release.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'theme-dark',  label: 'Dark (Default)', active: true,  bg: 'bg-slate-900' },
                  { id: 'theme-light', label: 'Light',          active: false, bg: 'bg-slate-100' },
                  { id: 'theme-auto',  label: 'System Auto',    active: false, bg: 'bg-gradient-to-r from-slate-900 to-slate-100' },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    id={theme.id}
                    type="button"
                    className={cn(
                      'rounded-xl border-2 p-3 text-left transition-colors',
                      theme.active
                        ? 'border-blue-500'
                        : 'border-slate-700 hover:border-slate-500'
                    )}
                  >
                    <div className={cn('w-full h-12 rounded-lg mb-2', theme.bg)} />
                    <p className="text-xs font-medium text-slate-300">{theme.label}</p>
                    {theme.active && <p className="text-[10px] text-blue-400 mt-0.5">Currently active</p>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="mt-6 pt-5 border-t border-slate-700/60 flex justify-end">
            <button
              id="settings-save-btn"
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/25"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
