'use client';

import { useState, useRef, useEffect } from 'react';
import { Token } from '@astryxdesign/core/Token';
import { Popover } from '@astryxdesign/core/Popover';
import { Button } from '@astryxdesign/core/Button';
import { IconButton } from '@astryxdesign/core/IconButton';
import { List, ListItem } from '@astryxdesign/core/List';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Icon } from '@astryxdesign/core/Icon';

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

function PlusGlyph() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" d="M6 2v8M2 6h8"/>
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  );
}

function SourceOverflowButton({
  sources,
  overflowCount,
  onRemove,
}: {
  sources: SourceChip[];
  overflowCount: number;
  onRemove?: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      placement="below"
      alignment="start"
      label={`All selected — ${sources.length} sources`}
      width={280}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      content={
        <div>
          <p className="px-1 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            All selected — {sources.length} sources
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
            {sources.map((source) => (
              <Token
                key={source.id}
                label={source.label}
                size="sm"
                icon={source.kind === 'dashboard' ? <DashboardGlyph /> : <SourceGlyph />}
                onRemove={onRemove ? () => onRemove(source.id) : undefined}
              />
            ))}
          </div>
        </div>
      }
    >
      <Button label={`+${overflowCount} more`} variant="ghost" size="sm" />
    </Popover>
  );
}

function AddSourceButton({
  sources,
  onAdd,
}: {
  sources: SourceChip[];
  onAdd: (s: SourceChip) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  if (sources.length === 0) return null;

  const filteredSources = query.trim()
    ? sources.filter(s => s.label.toLowerCase().includes(query.trim().toLowerCase()))
    : sources;

  return (
    <Popover
      placement="below"
      alignment="end"
      label="Add data source"
      width={280}
      isOpen={isOpen}
      onOpenChange={(open) => { setIsOpen(open); if (!open) setQuery(''); }}
      content={
        <div>
          <div className="px-1 pb-2">
            <TextInput
              label="Search data sources"
              isLabelHidden
              placeholder="Search data sources…"
              startIcon={<Icon icon="search" size="sm" />}
              size="sm"
              value={query}
              onChange={setQuery}
              hasClear
              hasAutoFocus
            />
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {filteredSources.length === 0 ? (
              <p className="px-3 py-4 text-sm text-slate-400 text-center">No matches</p>
            ) : (
              <List density="compact">
                {filteredSources.map((s) => (
                  <ListItem
                    key={s.id}
                    label={s.label}
                    startContent={<SourceGlyph className="w-3.5 h-3.5" />}
                    onClick={() => { onAdd(s); setIsOpen(false); setQuery(''); }}
                  />
                ))}
              </List>
            )}
          </div>
        </div>
      }
    >
      <IconButton icon={<PlusGlyph />} label="Add data source" tooltip="Add data source" variant="secondary" size="sm" />
    </Popover>
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
      className="fixed z-[9999] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
      style={{ top: anchor.top, left: anchor.left, width: anchor.width, maxHeight: 320 }}
    >
      {combined.length === 0 ? (
        <p className="px-4 py-3 text-sm text-slate-400">No matches</p>
      ) : (
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {sourceItems.length > 0 && (
            <List
              density="compact"
              header={
                <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                  Data sources
                </p>
              }
            >
              {sourceItems.map((item) => (
                <ListItem
                  key={`s-${item.id}`}
                  label={item.label}
                  startContent={<SourceGlyph className="w-3.5 h-3.5" />}
                  isSelected={combined.indexOf(item) === activeIndex}
                  onClick={() => onSelect(item)}
                />
              ))}
            </List>
          )}
          {dashboardItems.length > 0 && (
            <List
              density="compact"
              header={
                <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                  Dashboards
                </p>
              }
            >
              {dashboardItems.map((item) => (
                <ListItem
                  key={`d-${item.id}`}
                  label={item.label}
                  startContent={<DashboardGlyph className="w-3.5 h-3.5" />}
                  isSelected={combined.indexOf(item) === activeIndex}
                  onClick={() => onSelect(item)}
                />
              ))}
            </List>
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
  const [mention, setMention] = useState<{ start: number; query: string } | null>(null);
  const [mentionAnchor, setMentionAnchor] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mentionActiveIndex, setMentionActiveIndex] = useState(0);
  const inputRowRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Sync externally controlled value
  useEffect(() => {
    if (inputValue !== undefined) setValue(inputValue);
  }, [inputValue]);

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
    if (m && inputRowRef.current) {
      const rect = inputRowRef.current.getBoundingClientRect();
      setMentionAnchor({ top: rect.bottom + 6, left: rect.left, width: rect.width });
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
                <Token
                  key={source.id}
                  label={source.label}
                  size="sm"
                  icon={source.kind === 'dashboard' ? <DashboardGlyph /> : <SourceGlyph />}
                  onRemove={onRemoveSource ? () => onRemoveSource(source.id) : undefined}
                />
              ))}

              {overflowCount > 0 && (
                <SourceOverflowButton
                  key={selectedSources.length}
                  sources={selectedSources}
                  overflowCount={overflowCount}
                  onRemove={onRemoveSource}
                />
              )}
            </div>

            {/* + button — pinned to right edge */}
            {availableSources.length > 0 && (
              <div className="flex-shrink-0 mt-0.5">
                <AddSourceButton sources={availableSources} onAdd={(s) => onAddSource?.(s)} />
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
            className="flex-1 bg-transparent text-base text-slate-700 placeholder:text-slate-400 outline-none"
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
            <Button
              label={ctaLabel}
              variant="primary"
              onClick={handleSubmit}
              isDisabled={!isCtaEnabled}
            />
          ) : (
            <IconButton
              icon={<ArrowGlyph />}
              label="Submit"
              variant="primary"
              onClick={handleSubmit}
              isDisabled={!isCtaEnabled}
            />
          )}
        </div>
      </div>

    </div>
  );
}
