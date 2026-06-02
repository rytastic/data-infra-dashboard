'use client';

import { useState, useRef, useEffect } from 'react';

interface SourceChip {
  id: string;
  label: string;
}

interface Props {
  chips: string[];
  selectedSources?: SourceChip[];
  availableSources?: SourceChip[];
  onRemoveSource?: (id: string) => void;
  onAddSource?: (source: SourceChip) => void;
  placeholder?: string;
  inputValue?: string;
  ctaLabel?: string;
  onSubmit?: (value: string) => void;
}

function AddSourceDropdown({
  sources,
  onAdd,
  onClose,
}: {
  sources: SourceChip[];
  onAdd: (s: SourceChip) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  if (sources.length === 0) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-1.5 z-50 bg-white rounded-xl shadow-lg overflow-hidden"
      style={{ minWidth: 280, maxHeight: 320, overflowY: 'auto', border: '1px solid #e2e8f0' }}
    >
      {sources.map((s) => (
        <button
          key={s.id}
          onClick={() => { onAdd(s); onClose(); }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[#EFF1F7]"
          style={{ color: '#374151' }}
        >
          <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <rect x="1" y="8" width="3" height="7" rx="0.5"/>
            <rect x="6" y="5" width="3" height="10" rx="0.5"/>
            <rect x="11" y="2" width="3" height="13" rx="0.5"/>
          </svg>
          {s.label}
        </button>
      ))}
    </div>
  );
}

export default function PromptInput({
  chips,
  selectedSources = [],
  availableSources = [],
  onRemoveSource,
  onAddSource,
  placeholder = 'What data question can I answer?',
  inputValue,
  ctaLabel,
  onSubmit,
}: Props) {
  const [value, setValue] = useState(inputValue ?? '');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sync externally controlled value
  useEffect(() => {
    if (inputValue !== undefined) setValue(inputValue);
  }, [inputValue]);

  const handleSubmit = () => {
    if (value.trim()) onSubmit?.(value.trim());
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const showChipRow = selectedSources.length > 0 || availableSources.length > 0;

  return (
    <div className="w-full max-w-[600px] mx-auto pb-6">
      {/* Input card */}
      <div
        className="bg-white rounded-2xl shadow-sm overflow-visible"
        style={{ border: '1px solid #e2e8f0' }}
      >
        {/* Selected source chips + add button */}
        {showChipRow && (
          <div className="flex items-start px-4 pt-3 pb-2 gap-2">
            {/* Chips — wrapping, takes remaining space */}
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              {selectedSources.map((source) => (
                <span
                  key={source.id}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600"
                  style={{
                    padding: '4px 8px 4px 10px',
                    borderRadius: 9999,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                  }}
                >
                  <svg className="w-3 h-3 text-slate-400 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1" y="8" width="3" height="7" rx="0.5"/>
                    <rect x="6" y="5" width="3" height="10" rx="0.5"/>
                    <rect x="11" y="2" width="3" height="13" rx="0.5"/>
                  </svg>
                  {source.label}
                  {onRemoveSource && (
                    <button
                      onClick={() => onRemoveSource(source.id)}
                      className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors"
                      aria-label={`Remove ${source.label}`}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" d="M4 4l8 8M12 4l-8 8"/>
                      </svg>
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* + button — pinned to right edge */}
            {availableSources.length > 0 && (
              <div className="relative flex-shrink-0 mt-0.5">
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    border: '1.5px solid #94a3b8',
                    background: dropdownOpen ? '#f1f5f9' : 'transparent',
                    color: '#64748b',
                  }}
                  aria-label="Add data source"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" d="M6 2v8M2 6h8"/>
                  </svg>
                </button>

                {dropdownOpen && (
                  <AddSourceDropdown
                    sources={availableSources}
                    onAdd={(s) => { onAddSource?.(s); }}
                    onClose={() => setDropdownOpen(false)}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        {showChipRow && (
          <div className="mx-4" style={{ height: 1, background: '#f1f5f9' }} />
        )}

        {/* Text input row */}
        <div className="flex items-center gap-2 px-4 py-3">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          />
          {ctaLabel ? (
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="flex-shrink-0 text-sm font-medium transition-opacity"
              style={{
                padding: '8px 20px',
                borderRadius: 9999,
                background: 'var(--md-primary)',
                color: 'var(--md-on-primary)',
                opacity: value.trim() ? 1 : 0.35,
                cursor: value.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {ctaLabel}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="w-9 h-9 flex items-center justify-center flex-shrink-0 transition-opacity"
              style={{
                borderRadius: 9999,
                background: '#334155',
                color: '#f1f5f9',
                opacity: value.trim() ? 1 : 0.35,
                cursor: value.trim() ? 'pointer' : 'not-allowed',
              }}
              aria-label="Submit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Suggested prompts — full-width list, max 3, auto-submits */}
      <div className="mt-3 rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #e2e8f0' }}>
        {chips.slice(0, 3).map((chip, i) => (
          <button
            key={chip}
            onClick={() => { setValue(chip); onSubmit?.(chip); }}
            className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[#EFF1F7]"
            style={{
              borderTop: i > 0 ? '1px solid #f1f5f9' : 'none',
              color: '#475569',
            }}
          >
            <span className="text-sm font-medium">{chip}</span>
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
