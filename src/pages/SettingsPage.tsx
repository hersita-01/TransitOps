import React, { useState } from 'react';
import { Save, Building, Bell, Shield, Palette, Users, Check, Sun, Moon, Monitor } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { useToast } from '@/context/ToastContext';
import { usePreferences } from '@/context/PreferencesContext';
import { cn } from '@/utils';


type SettingsTab = 'general' | 'appearance' | 'notifications' | 'security' | 'roles';

const TABS: Array<{ id: SettingsTab; label: string; icon: React.ReactNode }> = [
  { id: 'general',       label: 'General',        icon: <Building className="w-4 h-4" /> },
  { id: 'appearance',    label: 'Appearance',     icon: <Palette className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications',  icon: <Bell className="w-4 h-4" /> },
  { id: 'security',      label: 'Security',       icon: <Shield className="w-4 h-4" /> },
  { id: 'roles',         label: 'Role Management', icon: <Users className="w-4 h-4" /> },
];

export function SettingsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const { toast } = useToast();
  const { theme, setTheme, tableDensity, setTableDensity } = usePreferences();

  function handleSave(): void {
    toast('success', 'Settings Saved', 'Your preferences have been successfully updated.');
  }

  return (
    <div>
      <PageTitle
        title="Settings"
        subtitle="Manage your organization and platform preferences"
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Settings' }]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 shrink-0">
          <nav className="space-y-1" aria-label="Settings navigation">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-150 border',
                  activeTab === tab.id
                    ? 'border-cyan-500/30 text-cyan-400'
                    : 'text-slate-500 hover:text-slate-200 border-transparent hover:border-slate-700/50'
                )}
                style={activeTab === tab.id ? { background: 'rgba(34,211,238,0.08)' } : undefined}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-2xl border p-6 min-h-[500px]" style={{ background: 'var(--surface-card)', borderColor: 'var(--border-base)' }}>
          
          {activeTab === 'general' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-base font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Organization Name</label>
                  <input type="text" defaultValue="TransitOps Global" className="w-full px-3 py-2.5 rounded-lg text-sm input-premium" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Organization Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg border flex items-center justify-center font-bold text-cyan-400" style={{ background: 'var(--surface-elevated)', borderColor: 'var(--border-base)' }}>TO</div>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors btn-base btn-secondary">Change Logo</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Timezone</label>
                  <select className="w-full px-3 py-2.5 rounded-lg text-sm input-premium">
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>EST (Eastern Standard Time)</option>
                    <option>PST (Pacific Standard Time)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Date Format</label>
                  <select className="w-full px-3 py-2.5 rounded-lg text-sm input-premium">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Currency</label>
                  <select className="w-full px-3 py-2.5 rounded-lg text-sm input-premium">
                    <option>INR (₹)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Language</label>
                  <select className="w-full px-3 py-2.5 rounded-lg text-sm input-premium">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-base font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
              
              {/* Theme Selector — FUNCTIONAL */}
              <div className="mb-8">
                <label className="block text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: 'dark'   as const, label: 'Dark',   icon: <Moon className="w-5 h-5" />,    preview: 'linear-gradient(135deg, #020817 0%, #0a1628 100%)' },
                    { id: 'light'  as const, label: 'Light',  icon: <Sun className="w-5 h-5" />,     preview: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' },
                    { id: 'system' as const, label: 'System', icon: <Monitor className="w-5 h-5" />, preview: 'linear-gradient(135deg, #020817 50%, #f8fafc 50%)' },
                  ]).map(t => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={theme === t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        'rounded-xl border-2 p-3 text-left transition-all duration-150',
                        theme === t.id
                          ? 'border-cyan-500'
                          : 'border-transparent hover:border-slate-600'
                      )}
                      style={theme === t.id ? { background: 'rgba(34,211,238,0.06)' } : { background: 'var(--surface-elevated)' }}
                    >
                      <div className="w-full h-14 rounded-lg mb-3 border" style={{ background: t.preview, borderColor: 'var(--border-subtle)' }} />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span style={{ color: theme === t.id ? '#22d3ee' : 'var(--text-muted)' }}>{t.icon}</span>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t.label}</span>
                        </div>
                        {theme === t.id && <Check className="w-4 h-4 text-cyan-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Accent Color</label>
                  <div className="flex gap-3">
                    {['bg-cyan-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'].map((color, i) => (
                      <button key={color} className={cn('w-8 h-8 rounded-full ring-2 ring-offset-2 transition-all', color, i === 0 ? 'ring-cyan-500' : 'ring-transparent hover:scale-110')}
                        style={{ '--tw-ring-offset-color': 'var(--surface-card)' } as React.CSSProperties} />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tableDensity === 'compact'}
                      onChange={e => setTableDensity(e.target.checked ? 'compact' : 'comfortable')}
                      className="w-4 h-4 rounded accent-cyan-500"
                    />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Compact tables and lists</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-slate-100 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                {[
                  { title: "Email Notifications", desc: "Receive daily summaries and critical alerts via email.", active: true },
                  { title: "Push Notifications", desc: "Receive real-time alerts in the browser.", active: true },
                  { title: "Maintenance Alerts", desc: "Notify when vehicles are due for service.", active: true },
                  { title: "Trip Alerts", desc: "Notify when a trip starts, delays, or completes.", active: false },
                  { title: "Expense Alerts", desc: "Notify when a high-value expense is logged.", active: true },
                  { title: "Reminder Preferences", desc: "Send reminders for expiring driver licenses.", active: true },
                ].map(item => (
                  <div key={item.title} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" defaultChecked={item.active} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border border-slate-600 peer-checked:border-blue-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-lg font-bold text-slate-100 mb-6">Security & Authentication</h2>
              
              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-slate-200 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input type="password" placeholder="Current Password" className="px-3 py-2 rounded-lg text-sm bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500" />
                    <input type="password" placeholder="New Password" className="px-3 py-2 rounded-lg text-sm bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500" />
                    <input type="password" placeholder="Confirm Password" className="px-3 py-2 rounded-lg text-sm bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500" />
                  </div>
                  <button className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors">Update Password</button>
                </div>

                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">Two-Factor Authentication (2FA)</h3>
                    <p className="text-xs text-slate-400 mt-1">Add an extra layer of security to your account using an authenticator app.</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0">Enable 2FA</button>
                </div>

                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-slate-200 mb-4">Session & Login History</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm text-slate-300">Session Timeout (minutes)</label>
                    <input type="number" defaultValue={60} className="w-20 px-3 py-1.5 rounded-lg text-sm bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500 text-center" />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-900/50">
                        <tr>
                          <th className="px-4 py-2 rounded-tl-lg">Date</th>
                          <th className="px-4 py-2">IP Address</th>
                          <th className="px-4 py-2">Device/Browser</th>
                          <th className="px-4 py-2 rounded-tr-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        <tr><td className="px-4 py-3">Today, 10:42 AM</td><td className="px-4 py-3 font-mono text-xs">192.168.1.42</td><td className="px-4 py-3">Windows / Chrome</td><td className="px-4 py-3 text-emerald-400">Success</td></tr>
                        <tr><td className="px-4 py-3">Yesterday, 08:15 PM</td><td className="px-4 py-3 font-mono text-xs">192.168.1.105</td><td className="px-4 py-3">iOS / Safari</td><td className="px-4 py-3 text-emerald-400">Success</td></tr>
                        <tr><td className="px-4 py-3">Oct 12, 02:30 AM</td><td className="px-4 py-3 font-mono text-xs">45.22.19.8</td><td className="px-4 py-3">Unknown / Firefox</td><td className="px-4 py-3 text-red-400">Failed</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-100">Role Management</h2>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors">
                  Create Custom Role
                </button>
              </div>
              
              <div className="overflow-x-auto border border-slate-700/60 rounded-xl bg-slate-800/30">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700/60">
                    <tr>
                      <th className="px-4 py-3">Role Name</th>
                      <th className="px-4 py-3 text-center">Read</th>
                      <th className="px-4 py-3 text-center">Write</th>
                      <th className="px-4 py-3 text-center">Delete</th>
                      <th className="px-4 py-3 text-center">Export</th>
                      <th className="px-4 py-3 text-center">Manage Users</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {[
                      { role: 'Admin', p: [1, 1, 1, 1, 1] },
                      { role: 'Fleet Manager', p: [1, 1, 0, 1, 0] },
                      { role: 'Dispatcher', p: [1, 1, 0, 0, 0] },
                      { role: 'Driver Manager', p: [1, 1, 0, 1, 0] },
                      { role: 'Finance Officer', p: [1, 0, 0, 1, 0] },
                      { role: 'Viewer', p: [1, 0, 0, 0, 0] },
                    ].map(row => (
                      <tr key={row.role} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-200">{row.role}</td>
                        {row.p.map((val, i) => (
                          <td key={i} className="px-4 py-3 text-center">
                            {val ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-slate-600">-</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-8 pt-5 border-t border-slate-700/60 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/25"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
