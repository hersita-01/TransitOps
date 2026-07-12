import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* 404 display */}
        <div className="relative mb-8">
          <p className="text-[120px] sm:text-[160px] font-black text-slate-800 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 shadow-xl">
              <p className="text-sm font-semibold text-slate-300">Page not found</p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-100 mb-3">Lost in transit?</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved. Head back to the dashboard to get back on route.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            id="back-to-dashboard-btn"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <button
            id="go-back-btn"
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
