'use client';

import { useState, useRef, useEffect } from 'react';

interface SourceChip {
  id: string;
  label: string;
  kind?: 'source' | 'dashboard';
}

interface Props {
  selectedSources?: SourceChip[];
  availableSources?: SourceChip[];
  availableDashboards?: SourceChip[];
  onRemoveSource?: (id: string) => void;
  onAddSource?: (source: SourceChip) => void;
  placeholder?: string;
  inputValue?: string;
  ctaLabel?: string;
  ctaEnabled?: boolean;
  onSubmit?: (value: string) => void;
  onValueChange?: (value: string) => void;
}

const MAX_VISIBLE_SOURCE_CHIPS = 3;
const MAX_MENTION_RESULTS = 5;

function SourceGlyph({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={`${className} text-slate-400 flex-shrink-0`} viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="8" width="3" height="7" rx="0.5"/>
      <rect x="6" y="5" width="3" height="10" rx="0.5"/>
      <rect x="11" y="2" width="3" height="13" rx="0.5"/>
    </svg>
  );
}

function DashboardGlyph({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={`${className} text-slate-400 flex-shrink-0`} viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1"/>
      <rect x="9" y="1" width="6" height="6" rx="1"/>
      <rect x="1" y="9" width="6" height="6" rx="1"/>
      <rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>
  );
}

function SourceChip({ label, kind, onRemove }: { label: string; kind?: 'source' | 'dashboard'; onRemove?: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600"
      style={{
        padding: '4px 8px 4px 10px',
        borderRadius: 9999,
        border: '1px solid #e2e8f0',
        background: '#f8fafc',
      }}
    >
      {kind === 'dashboard' ? <DashboardGlyph /> : <SourceGlyph />}
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M4 4l8 8M12 4l-8 8"/>
          </svg>
        </button>
      )}
    </span>
  );
}

function SourceOverflowPopover({
  sources,
  onRemove,
  onClose,
  anchor,
  triggerRef,
}: {
  sources: SourceChip[];
  onRemove?: (id: string) => void;
  onClose: () => void;
  anchor: { top: number; left: number };
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, triggerRef]);

  return (
    <div
      ref={ref}
      className="fixed z-[9999] bg-white rounded-xl shadow-lg overflow-hidden"
      style={{ top: anchor.top, left: anchor.left, minWidth: 260, maxHeight: 320, border: '1px solid #e2e8f0' }}
    >
      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
          All selected — {sources.length} sources
        </p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Close"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-2 flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
        {sources.map((source) => (
          <SourceChip
            key={source.id}
            label={source.label}
            kind={source.kind}
            onRemove={onRemove ? () => onRemove(source.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
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
          <SourceGlyph className="w-3.5 h-3.5" />
          {s.label}
        </button>
      ))}
    </div>
  );
}

interface MentionItem {
  id: string;
  label: string;
  kind: 'source' | 'dashboard';
}

function getActiveMention(text: string, cursorPos: number): { start: number; query: string } | null {
  const uptoCursor = text.slice(0, cursorPos);
  const atIndex = uptoCursor.lastIndexOf('@');
  if (atIndex === -1) return null;
  const charBefore = atIndex > 0 ? uptoCursor[atIndex - 1] : '';
  if (charBefore && !/\s/.test(charBefore)) return null;
  const query = uptoCursor.slice(atIndex + 1);
  if (/\s/.test(query)) return null;
  return { start: atIndex, query };
}

function MentionRow({
  item,
  active,
  onSelect,
}: {
  item: MentionItem;
  active: boolean;
  onSelect: (item: MentionItem) => void;
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onSelect(item); }}
      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors"
      style={{ color: '#374151', background: active ? '#EFF1F7' : 'transparent' }}
    >
      {item.kind === 'dashboard' ? <DashboardGlyph className="w-3.5 h-3.5" /> : <SourceGlyph className="w-3.5 h-3.5" />}
      {item.label}
    </button>
  );
}

function MentionDropdown({
  sourceItems,
  dashboardItems,
  activeIndex,
  onSelect,
  onClose,
  anchor,
  excludeRef,
}: {
  sourceItems: MentionItem[];
  dashboardItems: MentionItem[];
  activeIndex: number;
  onSelect: (item: MentionItem) => void;
  onClose: () => void;
  anchor: { top: number; left: number; width: number };
  excludeRef: React.RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const combined = [...sourceItems, ...dashboardItems];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (excludeRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, excludeRef]);

  return (
    <div
      ref={ref}
      data-testid="mention-dropdown"
      className="fixed z-[9999] bg-white rounded-xl shadow-lg overflow-hidden"
      style={{ top: anchor.top, left: anchor.left, width: anchor.width, maxHeight: 320, border: '1px solid #e2e8f0' }}
    >
      {combined.length === 0 ? (
        <p className="px-4 py-3 text-sm text-slate-400">No matches</p>
      ) : (
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {sourceItems.length > 0 && (
            <div>
              <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Data sources
              </p>
              {sourceItems.map((item) => (
                <MentionRow key={`s-${item.id}`} item={item} active={combined.indexOf(item) === activeIndex} onSelect={onSelect} />
              ))}
            </div>
          )}
          {dashboardItems.length > 0 && (
            <div>
              <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Dashboards
              </p>
              {dashboardItems.map((item) => (
                <MentionRow key={`d-${item.id}`} item={item} active={combined.indexOf(item) === activeIndex} onSelect={onSelect} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PromptInput({
  selectedSources = [],
  availableSources = [],
  availableDashboards = [],
  onRemoveSource,
  onAddSource,
  placeholder = 'What data question can I answer?',
  inputValue,
  ctaLabel,
  ctaEnabled,
  onSubmit,
  onValueChange,
}: Props) {
  const [value, setValue] = useState(inputValue ?? '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sourceOverflowOpen, setSourceOverflowOpen] = useState(false);
  const [overflowAnchor, setOverflowAnchor] = useState<{ top: number; left: number } | null>(null);
  const overflowBtnRef = useRef<HTMLButtonElement>(null);
  const [mention, setMention] = useState<{ start: number; query: string } | null>(null);
  const [mentionAnchor, setMentionAnchor] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mentionActiveIndex, setMentionActiveIndex] = useState(0);
  const inputRowRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Sync externally controlled value
  useEffect(() => {
    if (inputValue !== undefined) setValue(inputValue);
  }, [inputValue]);

  // Close overflow popover when the selection changes
  useEffect(() => {
    setSourceOverflowOpen(false);
  }, [selectedSources.length]);

  const handleChange = (v: string) => {
    setValue(v);
    onValueChange?.(v);
  };

  const isCtaEnabled = ctaEnabled !== undefined ? ctaEnabled : !!value.trim();

  const handleSubmit = () => {
    if (isCtaEnabled) onSubmit?.(value.trim());
  };

  const updateMentionFromCursor = (text: string, cursorPos: number) => {
    const m = getActiveMention(text, cursorPos);
    setMention(m);
    setMentionActiveIndex(0);
    if (m) {
      setDropdownOpen(false);
      setSourceOverflowOpen(false);
      if (inputRowRef.current) {
        const rect = inputRowRef.current.getBoundingClientRect();
        setMentionAnchor({ top: rect.bottom + 6, left: rect.left, width: rect.width });
      }
    }
  };

  const mentionQuery = mention?.query.toLowerCase() ?? '';
  const filteredSourceMentions: MentionItem[] = mention
    ? availableSources
        .filter(s => s.label.toLowerCase().includes(mentionQuery))
        .slice(0, MAX_MENTION_RESULTS)
        .map(s => ({ id: s.id, label: s.label, kind: 'source' as const }))
    : [];
  const filteredDashboardMentions: MentionItem[] = mention
    ? availableDashboards
        .filter(d => d.label.toLowerCase().includes(mentionQuery))
        .slice(0, MAX_MENTION_RESULTS)
        .map(d => ({ id: d.id, label: d.label, kind: 'dashboard' as const }))
    : [];
  const mentionItems = [...filteredSourceMentions, ...filteredDashboardMentions];

  const selectMention = (item: MentionItem) => {
    if (!mention) return;
    const spanEnd = mention.start + 1 + mention.query.length;
    const before = value.slice(0, mention.start);
    const after = value.slice(spanEnd);
    const nextValue = `${before}${after}`.replace(/[ \t]{2,}/g, ' ');
    handleChange(nextValue);
    setMention(null);
    onAddSource?.({ id: item.id, label: item.label, kind: item.kind });
    requestAnimationFrame(() => {
      textInputRef.current?.focus();
      textInputRef.current?.setSelectionRange(before.length, before.length);
    });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mention) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionActiveIndex(i => Math.min(i + 1, Math.max(mentionItems.length - 1, 0)));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionActiveIndex(i => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const item = mentionItems[mentionActiveIndex];
        if (item) selectMention(item);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMention(null);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const showChipRow = selectedSources.length > 0;
  const visibleSources = selectedSources.slice(0, MAX_VISIBLE_SOURCE_CHIPS);
  const overflowCount = Math.max(0, selectedSources.length - MAX_VISIBLE_SOURCE_CHIPS);

  return (
    <div className="w-full">
      {/* Input card */}
      <div
        className="bg-white overflow-visible"
      >
        {/* Selected source chips + add button */}
        {showChipRow && (
          <div className="flex items-start px-4 pt-3 pb-2 gap-2">
            {/* Chips — max 3 visible, rest collapse into an overflow toggle */}
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              {visibleSources.map((source) => (
                <SourceChip
                  key={source.id}
                  label={source.label}
                  kind={source.kind}
                  onRemove={onRemoveSource ? () => onRemoveSource(source.id) : undefined}
                />
              ))}

              {overflowCount > 0 && (
                <div>
                  <button
                    ref={overflowBtnRef}
                    onClick={() => {
                      if (!sourceOverflowOpen && overflowBtnRef.current) {
                        const rect = overflowBtnRef.current.getBoundingClientRect();
                        setOverflowAnchor({ top: rect.bottom + 6, left: rect.left });
                      }
                      setSourceOverflowOpen(o => !o);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    style={{ padding: '4px 10px', borderRadius: 9999 }}
                  >
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${sourceOverflowOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7" />
                    </svg>
                    +{overflowCount} more
                  </button>

                  {sourceOverflowOpen && overflowAnchor && (
                    <SourceOverflowPopover
                      sources={selectedSources}
                      onRemove={onRemoveSource}
                      onClose={() => setSourceOverflowOpen(false)}
                      anchor={overflowAnchor}
                      triggerRef={overflowBtnRef}
                    />
                  )}
                </div>
              )}
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
        <div ref={inputRowRef} className="flex items-center gap-2 px-4 py-3 relative">
          <input
            ref={textInputRef}
            value={value}
            onChange={(e) => {
              handleChange(e.target.value);
              updateMentionFromCursor(e.target.value, e.target.selectionStart ?? e.target.value.length);
            }}
            onClick={(e) => updateMentionFromCursor(value, e.currentTarget.selectionStart ?? value.length)}
            onKeyUp={(e) => {
              if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                updateMentionFromCursor(value, e.currentTarget.selectionStart ?? value.length);
              }
            }}
            onKeyDown={handleKey}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          />

          {mention && mentionAnchor && (
            <MentionDropdown
              sourceItems={filteredSourceMentions}
              dashboardItems={filteredDashboardMentions}
              activeIndex={mentionActiveIndex}
              onSelect={selectMention}
              onClose={() => setMention(null)}
              anchor={mentionAnchor}
              excludeRef={textInputRef}
            />
          )}
          {ctaLabel ? (
            <button
              onClick={handleSubmit}
              className="flex-shrink-0 text-sm font-medium transition-opacity"
              style={{
                padding: '8px 20px',
                borderRadius: 9999,
                background: 'var(--md-primary)',
                color: 'var(--md-on-primary)',
                opacity: isCtaEnabled ? 1 : 0.35,
                cursor: isCtaEnabled ? 'pointer' : 'not-allowed',
                pointerEvents: isCtaEnabled ? 'auto' : 'none',
              }}
            >
              {ctaLabel}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-9 h-9 flex items-center justify-center flex-shrink-0 transition-opacity"
              style={{
                borderRadius: 9999,
                background: '#334155',
                color: '#f1f5f9',
                opacity: isCtaEnabled ? 1 : 0.35,
                cursor: isCtaEnabled ? 'pointer' : 'not-allowed',
                pointerEvents: isCtaEnabled ? 'auto' : 'none',
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

    </div>
  );
}
