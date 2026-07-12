import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageTitle } from '@/components/common/PageTitle';
import { useToast } from '@/context/ToastContext';
import { User, Mail, Phone, MapPin, Building, Hash, Calendar, Camera, Shield } from 'lucide-react';
import { getInitials } from '@/utils';

export function ProfilePage(): React.JSX.Element {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    department: 'Operations',
    address: '123 Transit Way, Transport City, TC 12345',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast('success', 'Profile updated', 'Your profile information has been successfully updated.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageTitle title="My Profile" subtitle="Manage your personal information and account settings" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Avatar & Quick Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-600/20 to-violet-600/20" />
            <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/20 border-4 border-slate-900 mb-4 group cursor-pointer">
              <span className="text-3xl font-bold text-white">{user ? getInitials(user.firstName, user.lastName) : 'U'}</span>
              <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white mb-1" />
                <span className="text-[10px] text-white font-medium">Upload</span>
              </div>
            </div>
            
            <h2 className="text-lg font-bold text-slate-100">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-blue-400 font-medium capitalize mt-1">{user?.role}</p>

            <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Hash className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Employee ID</p>
                  <p>EMP-2024-089</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Calendar className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Joining Date</p>
                  <p>March 15, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Details Form */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-100">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField icon={User} label="First Name" value={formData.firstName} disabled={!isEditing} onChange={(v: string) => setFormData({ ...formData, firstName: v })} />
              <InputField icon={User} label="Last Name" value={formData.lastName} disabled={!isEditing} onChange={(v: string) => setFormData({ ...formData, lastName: v })} />
              <InputField icon={Mail} label="Email Address" type="email" value={formData.email} disabled={!isEditing} onChange={(v: string) => setFormData({ ...formData, email: v })} />
              <InputField icon={Phone} label="Phone Number" value={formData.phone} disabled={!isEditing} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
              <InputField icon={Building} label="Department" value={formData.department} disabled={!isEditing} onChange={(v: string) => setFormData({ ...formData, department: v })} />
              <InputField icon={MapPin} label="Address" value={formData.address} disabled={!isEditing} onChange={(v: string) => setFormData({ ...formData, address: v })} className="sm:col-span-2" />
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Password & Security</h4>
                <p className="text-xs text-slate-400 mt-0.5">Last changed 3 months ago</p>
              </div>
            </div>
            <button 
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
              onClick={() => toast('info', 'Password Reset', 'A password reset link has been sent to your email.')}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps {
  icon: React.ElementType;
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  onChange: (value: string) => void;
}

function InputField({ icon: Icon, label, value, type = 'text', disabled, className = '', onChange }: InputFieldProps) {
  const id = label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[11px] font-semibold text-slate-500 uppercase mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          id={id}
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm transition-colors ${
            disabled 
              ? 'bg-transparent border border-slate-700/50 text-slate-300 opacity-70 cursor-not-allowed' 
              : 'bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
      </div>
    </div>
  );
}
