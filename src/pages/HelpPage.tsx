import React from 'react';
import { HelpCircle, Book, MessageSquare, Keyboard } from 'lucide-react';

export function HelpPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-800/60 to-slate-900/40 border border-slate-700/60 px-6 py-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Help Center</h1>
            <p className="text-slate-400 mt-1">Get assistance, learn keyboard shortcuts, and find answers to common questions.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Getting Started */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6 flex flex-col hover-card-up">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-slate-200">Getting Started</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4 flex-1">
            Welcome to TransitOps! Begin by checking the <strong>Dashboard</strong> for an overview of your fleet. 
            Use the <strong>Fleet</strong> and <strong>Drivers</strong> tabs to manage your assets, and schedule new operations in the <strong>Trips</strong> module.
          </p>
          <button className="text-sm text-emerald-400 font-medium hover:text-emerald-300 self-start">Read Documentation &rarr;</button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6 flex flex-col hover-card-up">
          <div className="flex items-center gap-3 mb-4">
            <Keyboard className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-slate-200">Keyboard Shortcuts</h2>
          </div>
          <ul className="text-sm text-slate-400 space-y-3 flex-1">
            <li className="flex items-center justify-between">
              <span>Search / Command Palette</span>
              <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600 font-mono">Ctrl + K</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Go to Dashboard</span>
              <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600 font-mono">Alt + D</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Go to Fleet</span>
              <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600 font-mono">Alt + F</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Go to Trips</span>
              <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600 font-mono">Alt + T</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span>Go to Maintenance</span>
              <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600 font-mono">Alt + M</kbd>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How do I add a new vehicle?', a: 'Navigate to the Fleet page and click "Add Vehicle" in the top right corner. Fill out the vehicle details to register it in the system.' },
            { q: 'Can I export reports?', a: 'Yes. In the Analytics and Expenses modules, you can use the "Export" button in the toolbar to download CSV or PDF reports.' },
            { q: 'What does "Demo Mode" mean?', a: 'Demo mode uses local mock data to showcase the application\'s capabilities without requiring a live backend connection. You can reset demo data from the Dashboard customize menu.' },
          ].map((faq, i) => (
            <div key={i} className="pb-4 border-b border-slate-700/50 last:border-0 last:pb-0">
              <h3 className="text-sm font-medium text-slate-300">{faq.q}</h3>
              <p className="text-sm text-slate-500 mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-base font-semibold text-blue-100">Still need help?</h2>
            <p className="text-sm text-blue-300/80">Our support team is available 24/7 to assist you.</p>
          </div>
        </div>
        <button
          onClick={() => alert('Support contact form would open here.')}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
        >
          Contact Support
        </button>
      </div>

    </div>
  );
}
