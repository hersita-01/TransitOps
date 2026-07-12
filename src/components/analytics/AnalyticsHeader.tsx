import React from 'react';
import { Download, Printer } from 'lucide-react';

interface AnalyticsHeaderProps {
  onExportCsv: () => void;
}

export function AnalyticsHeader({ onExportCsv }: AnalyticsHeaderProps): React.JSX.Element {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:mb-2">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Analytics & Reports</h1>
        <p className="text-sm text-slate-400 mt-1">Fleet Performance Dashboard</p>
      </div>
      <div className="flex items-center gap-3 print:hidden">
        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700 shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
        >
          <Printer className="w-4 h-4" />
          Print Report
        </button>
      </div>
    </div>
  );
}
