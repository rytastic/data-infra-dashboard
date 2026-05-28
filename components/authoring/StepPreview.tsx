'use client';

import { useState } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';

export default function StepPreview({ onPublish }: { onPublish: () => void }) {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(onPublish, 800);
  };

  return (
    <div className="w-full h-full flex flex-col animate-fade-up" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Preview banner */}
      <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-slate-300 text-sm font-medium">Preview Mode</span>
          <span className="text-slate-600 text-xs">· Not yet published</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview only
          </div>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              publishing
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-cardinal text-white hover:bg-cardinal-dark shadow-md shadow-cardinal/25'
            }`}
          >
            {publishing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-emerald-400/50 border-t-emerald-400 rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Publish Dashboard
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dashboard preview */}
      <div className="flex-1 rounded-xl overflow-hidden border border-slate-700 shadow-2xl shadow-black/50">
        <Dashboard isPreview />
      </div>
    </div>
  );
}
