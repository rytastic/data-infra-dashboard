'use client';

import { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  'Build me a basketball stats dashboard for Iowa State Cyclones showing the last 5 seasons',
  'Show me a player comparison view for this season with scoring leaders',
  'Create a season-over-season trend dashboard with team and individual stats',
];

export default function StepWelcome({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSubmit(value.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl animate-fade-up">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-cardinal/10 border border-cardinal/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-2 h-2 rounded-full bg-cardinal animate-pulse" />
          <span className="text-cardinal text-xs font-semibold uppercase tracking-widest">AI Dashboard Builder</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
          What would you like<br />
          <span className="text-gold">to build today?</span>
        </h1>
        <p className="text-slate-400 text-base">
          Describe your dashboard in plain English. Our AI will design and build it for you.
        </p>
      </div>

      {/* Input card */}
      <div
        className={`bg-slate-800 rounded-2xl border-2 transition-all duration-200 ${
          focused ? 'border-cardinal shadow-lg shadow-cardinal/10' : 'border-slate-700'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Build me a basketball stats dashboard for Iowa State Cyclones showing the last 5 seasons..."
          rows={4}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 p-5 text-base resize-none outline-none leading-relaxed"
        />
        <div className="flex items-center justify-between px-5 pb-4">
          <span className="text-slate-600 text-xs">Press Enter to continue · Shift+Enter for new line</span>
          <button
            onClick={() => value.trim() && onSubmit(value.trim())}
            disabled={!value.trim()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              value.trim()
                ? 'bg-cardinal text-white hover:bg-cardinal-dark shadow-md shadow-cardinal/25 hover:shadow-lg hover:shadow-cardinal/30'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Generate Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="mt-6">
        <p className="text-slate-600 text-xs uppercase tracking-wider mb-3 text-center">Try one of these</p>
        <div className="flex flex-col gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setValue(s); textareaRef.current?.focus(); }}
              className="text-left px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 text-sm hover:border-slate-600 hover:text-slate-300 hover:bg-slate-800 transition-all duration-150 group"
            >
              <span className="text-cardinal mr-2 group-hover:mr-3 transition-all duration-150">→</span>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
