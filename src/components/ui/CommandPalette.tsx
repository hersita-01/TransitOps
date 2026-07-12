import React, { useEffect, useState, useRef } from 'react';
import { Search, MapPin, Truck, Users, Settings, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_VEHICLES, MOCK_DRIVERS } from '@/services/mockData';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps): React.JSX.Element | null {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const lowerQ = query.toLowerCase();

  // Search through routes
  const routes = [
    { name: 'Dashboard', path: '/dashboard', icon: <MapPin /> },
    { name: 'Fleet Management', path: '/fleet', icon: <Truck /> },
    { name: 'Driver Management', path: '/drivers', icon: <Users /> },
    { name: 'Settings', path: '/settings', icon: <Settings /> },
    { name: 'Analytics', path: '/analytics', icon: <Briefcase /> },
  ].filter(r => r.name.toLowerCase().includes(lowerQ));

  // Search through vehicles
  const vehicles = MOCK_VEHICLES.filter(v => 
    v.plateNumber.toLowerCase().includes(lowerQ) || v.make.toLowerCase().includes(lowerQ)
  ).slice(0, 3);

  // Search through drivers
  const drivers = MOCK_DRIVERS.filter(d => 
    d.firstName.toLowerCase().includes(lowerQ) || d.lastName.toLowerCase().includes(lowerQ)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-slate-200 px-3 py-1 outline-none placeholder:text-slate-500"
            placeholder="Search pages, vehicles, drivers... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-medium text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
          
          {query.length > 0 && routes.length === 0 && vehicles.length === 0 && drivers.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-500">
              No results found for "{query}".
            </div>
          )}

          {routes.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase">Pages</div>
              {routes.map(r => (
                <button
                  key={r.path}
                  onClick={() => handleSelect(r.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600/10 hover:text-blue-400 text-slate-300 text-sm transition-colors text-left"
                >
                  <div className="w-5 h-5 opacity-70">{r.icon}</div>
                  {r.name}
                </button>
              ))}
            </div>
          )}

          {vehicles.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase">Vehicles</div>
              {vehicles.map(v => (
                <button
                  key={v.id}
                  onClick={() => handleSelect('/fleet')}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-sm transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-slate-500" />
                    <span>{v.make} {v.model}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{v.plateNumber}</span>
                </button>
              ))}
            </div>
          )}

          {drivers.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase">Drivers</div>
              {drivers.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleSelect('/drivers')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-sm transition-colors"
                >
                  <Users className="w-4 h-4 text-slate-500" />
                  {d.firstName} {d.lastName}
                </button>
              ))}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
