import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { ToastMessage } from '@/context/ToastContext';

interface ToastProps {
  message: ToastMessage;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps): React.JSX.Element {
  
  const getStyles = () => {
    switch (message.type) {
      case 'success': return { bg: 'bg-emerald-950 border-emerald-800 text-emerald-400', icon: CheckCircle };
      case 'error': return { bg: 'bg-red-950 border-red-800 text-red-400', icon: AlertCircle };
      case 'warning': return { bg: 'bg-amber-950 border-amber-800 text-amber-400', icon: AlertTriangle };
      case 'info': return { bg: 'bg-blue-950 border-blue-800 text-blue-400', icon: Info };
    }
  };

  const { bg, icon: Icon } = getStyles();

  return (
    <div className={`pointer-events-auto flex items-start gap-3 w-full max-w-sm p-4 rounded-xl shadow-2xl border ${bg} animate-in slide-in-from-right-8 duration-300`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-100">{message.title}</h4>
        {message.description && <p className="text-xs text-slate-300 mt-1">{message.description}</p>}
      </div>
      <button onClick={onClose} className="shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors">
        <X className="w-4 h-4 text-slate-400 hover:text-white" />
      </button>
    </div>
  );
}
