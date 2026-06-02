'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChartMetric } from '@/components/dashboard/types';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface ParsedCommand {
  type:
    | 'setMetric'
    | 'highlight'
    | 'clearHighlight'
    | 'setSeason'
    | 'setChartType'
    | 'setSort'
    | 'setLimit'
    | 'setAccentColor'
    | 'setWidgetTitle';
  value?: string;
  widgetId?: string;
}

export interface WidgetContext {
  id: string;
  label: string;
  isChart: boolean;
}

interface Props {
  onCommand: (cmd: ParsedCommand) => void;
  onClose?: () => void;
  chartMetric: ChartMetric;
  highlightedPlayer: string | null;
  selectedWidgets: WidgetContext[];
  onClearWidget: (id: string) => void;
}

// ─── command parsing ──────────────────────────────────────────────────────────

const METRIC_TRIGGERS: { patterns: RegExp[]; metric: ChartMetric; label: string }[] = [
  { patterns: [/\brebound/i, /\brpg\b/i], metric: 'rpg', label: 'Rebounds Per Game' },
  { patterns: [/\bassist/i, /\bapg\b/i], metric: 'apg', label: 'Assists Per Game' },
  { patterns: [/\bsteal/i, /\bspg\b/i, /\bstl\b/i], metric: 'spg', label: 'Steals Per Game' },
  { patterns: [/\bpoints?\b/i, /\bscoring\b/i, /\bppg\b/i], metric: 'ppg', label: 'Points Per Game' },
];

const SORT_TRIGGERS: { patterns: RegExp[]; key: string; label: string }[] = [
  { patterns: [/sort.*\bpoints?\b/i, /sort.*\bppg\b/i, /sort.*\bscor/i], key: 'ppg', label: 'points' },
  { patterns: [/sort.*\brebound/i, /sort.*\brpg\b/i], key: 'rpg', label: 'rebounds' },
  { patterns: [/sort.*\bassist/i, /sort.*\bapg\b/i], key: 'apg', label: 'assists' },
  { patterns: [/sort.*\bsteal/i, /sort.*\bspg\b/i], key: 'spg', label: 'steals' },
  { patterns: [/sort.*\bblock/i, /sort.*\bbpg\b/i], key: 'bpg', label: 'blocks' },
  { patterns: [/sort.*\bminut/i, /sort.*\bmpg\b/i], key: 'mpg', label: 'minutes' },
  { patterns: [/sort.*\bfg%/i, /sort.*\bfield goal/i], key: 'fgPct', label: 'FG%' },
  { patterns: [/sort.*\bname/i, /sort.*\balpha/i], key: 'name', label: 'name' },
];

const COLOR_TRIGGERS: { patterns: RegExp[]; value: string; label: string }[] = [
  { patterns: [/\bred\b/i, /\bisu\b/i, /\bcardinal\b/i], value: '#C8102E', label: 'ISU cardinal red' },
  { patterns: [/\bblue\b/i], value: '#3b82f6', label: 'blue' },
  { patterns: [/\bgreen\b/i], value: '#22c55e', label: 'green' },
  { patterns: [/\bpurple\b/i], value: '#a855f7', label: 'purple' },
  { patterns: [/\bgold\b/i, /\byellow\b/i], value: '#f59e0b', label: 'gold' },
  { patterns: [/\borange\b/i], value: '#f97316', label: 'orange' },
];

const HIGHLIGHT_TRIGGER = /highlight\s+([\w\s]+?)(?:\s+in|\s+on|\s*$)/i;
const TOP_SCORER_TRIGGER = /highlight.*\btop\s+scor/i;
const CLEAR_TRIGGER = /clear|remove|reset\s+highlight/i;

function parseCommand(
  input: string,
  primaryWidget: WidgetContext | null,
): { command: ParsedCommand; response: string } | null {
  if (CLEAR_TRIGGER.test(input)) {
    return { command: { type: 'clearHighlight' }, response: 'Cleared! The player highlight has been removed.' };
  }
  if (TOP_SCORER_TRIGGER.test(input)) {
    return {
      command: { type: 'highlight', value: '__top_scorer__' },
      response: "Done! I've highlighted the top scorer in the leaderboard and player cards.",
    };
  }
  const hlMatch = input.match(HIGHLIGHT_TRIGGER);
  if (hlMatch) {
    const name = hlMatch[1].trim();
    return {
      command: { type: 'highlight', value: name },
      response: `Done! Highlighting **${name}** across the leaderboard and comparison chart.`,
    };
  }

  if (/\bbar\b.*chart|\bbar\b.*graph|switch.*\bbar\b|change.*\bbar\b|as bars?\b|to bar\b/i.test(input)) {
    const widgetId = primaryWidget?.isChart ? primaryWidget.id : 'trend-chart';
    const label = primaryWidget?.isChart ? primaryWidget.label : 'Chart 1 · Scoring Trend';
    return { command: { type: 'setChartType', value: 'bar', widgetId }, response: `Switched **${label}** to a bar chart.` };
  }
  if (/\bline\b.*chart|\bline\b.*graph|switch.*\bline\b|change.*\bline\b|as lines?\b|to line\b/i.test(input)) {
    const widgetId = primaryWidget?.isChart ? primaryWidget.id : 'trend-chart';
    const label = primaryWidget?.isChart ? primaryWidget.label : 'Chart 1 · Scoring Trend';
    return { command: { type: 'setChartType', value: 'line', widgetId }, response: `Switched **${label}** to a line chart.` };
  }

  for (const { patterns, key, label } of SORT_TRIGGERS) {
    if (patterns.some(p => p.test(input))) {
      return { command: { type: 'setSort', value: key }, response: `Sorted the leaderboard by **${label}**.` };
    }
  }

  const topNMatch = input.match(/top\s+(\d+)\s*player|show\s+(\d+)\s*player|show\s+top\s+(\d+)/i);
  if (topNMatch) {
    const n = parseInt(topNMatch[1] ?? topNMatch[2] ?? topNMatch[3]);
    return { command: { type: 'setLimit', value: String(n) }, response: `Showing the top **${n} players** in the leaderboard.` };
  }
  if (/show\s+all|all\s+player|reset\s+(?:limit|filter)|full\s+leaderboard/i.test(input)) {
    return { command: { type: 'setLimit', value: '' }, response: 'Showing all players in the leaderboard.' };
  }

  if (/color|theme|accent/i.test(input)) {
    for (const { patterns, value, label } of COLOR_TRIGGERS) {
      if (patterns.some(p => p.test(input))) {
        return { command: { type: 'setAccentColor', value }, response: `Updated the chart accent to **${label}**.` };
      }
    }
  }

  const renameMatch = input.match(
    /rename.*?to\s+["']?(.+?)["']?\s*$|set.*?title.*?to\s+["']?(.+?)["']?\s*$|call\s+(?:it|this)\s+["']?(.+?)["']?\s*$/i,
  );
  if (renameMatch && primaryWidget) {
    const newTitle = (renameMatch[1] ?? renameMatch[2] ?? renameMatch[3])?.trim();
    if (newTitle) {
      return {
        command: { type: 'setWidgetTitle', value: newTitle, widgetId: primaryWidget.id },
        response: `Renamed **${primaryWidget.label}** to **${newTitle}**.`,
      };
    }
  }

  for (const { patterns, metric, label } of METRIC_TRIGGERS) {
    if (patterns.some(p => p.test(input))) {
      return { command: { type: 'setMetric', value: metric }, response: `Updated both charts to show **${label}**.` };
    }
  }

  return null;
}

// ─── component ────────────────────────────────────────────────────────────────

const MAX_VISIBLE_CHIPS = 3;
let msgIdCounter = 10;

const EMPTY_SUGGESTIONS = [
  'What is the 3-point shooting percentage for conference losses?',
  'What is the assist-to-turnover ratio for wins?',
  'Change charts to line charts',
  'Highlight the top scorer',
];

export default function ChatPane({
  onCommand,
  onClose,
  chartMetric,
  highlightedPlayer,
  selectedWidgets,
  onClearWidget,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: "Hi! Select a widget on the dashboard, then describe how you'd like to edit it.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close overflow popover when selection changes
  useEffect(() => { setOverflowOpen(false); }, [selectedWidgets.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Most-recently-selected widget drives command targeting
  const primaryWidget = selectedWidgets.length > 0 ? selectedWidgets[selectedWidgets.length - 1] : null;

  const visibleChips = selectedWidgets.slice(0, MAX_VISIBLE_CHIPS);
  const overflowCount = Math.max(0, selectedWidgets.length - MAX_VISIBLE_CHIPS);
  const isEmptyState = messages.length === 1 && messages[0].role === 'assistant';

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: ++msgIdCounter, role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
    setIsTyping(false);

    const result = parseCommand(text, primaryWidget);
    const responseText = result
      ? (onCommand(result.command), result.response)
      : buildFallback(text, primaryWidget);

    setMessages(prev => [
      ...prev,
      { id: ++msgIdCounter, role: 'assistant', text: responseText, timestamp: new Date() },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center">
            <StarIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900">Data assistant</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <PaperclipIcon className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <DotsIcon className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages / empty state */}
      {isEmptyState ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4 min-h-0">
          <h2 className="text-2xl font-semibold text-slate-800 text-center mb-5">
            Jump into the data…
          </h2>
          <div className="w-full space-y-2.5">
            {EMPTY_SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="w-full text-left px-4 py-3.5 rounded-2xl bg-violet-100 hover:bg-violet-200 text-slate-700 text-sm leading-snug transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <StarIcon className="w-3 h-3 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-sm'
                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}
              >
                <FormattedText text={msg.text} />
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <StarIcon className="w-3 h-3 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Widget context + suggestions */}
      {selectedWidgets.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0">
          {/* Stacked chips — max 3 visible */}
          <div className="space-y-1.5">
            {visibleChips.map(widget => (
              <WidgetChip
                key={widget.id}
                label={widget.label}
                isActive={widget.id === primaryWidget?.id}
                onRemove={() => onClearWidget(widget.id)}
              />
            ))}
          </div>

          {/* Overflow toggle */}
          {overflowCount > 0 && (
            <div className="relative mt-1.5">
              <button
                onClick={() => setOverflowOpen(o => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${overflowOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                +{overflowCount} more
              </button>

              {overflowOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      All selected — {selectedWidgets.length} widgets
                    </p>
                    <button
                      onClick={() => setOverflowOpen(false)}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-2 space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedWidgets.map(widget => (
                      <WidgetChip
                        key={widget.id}
                        label={widget.label}
                        isActive={widget.id === primaryWidget?.id}
                        onRemove={() => { onClearWidget(widget.id); }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Context-aware suggestion pills */}
          <div className="mt-2.5 flex flex-wrap gap-2">
            {selectedWidgets.some(w => w.isChart) && (
              <>
                <SuggestionPill label="Change to bar chart" onSend={sendMessage} />
                <SuggestionPill label="Change to line chart" onSend={sendMessage} />
                <SuggestionPill label="Use ISU red" onSend={sendMessage} />
              </>
            )}
            {selectedWidgets.some(w => w.id === 'leaderboard') && (
              <>
                <SuggestionPill label="Sort by rebounds" onSend={sendMessage} />
                <SuggestionPill label="Show top 5 players" onSend={sendMessage} />
              </>
            )}
            {selectedWidgets.some(w => w.id === 'stats') && (
              <SuggestionPill label="Highlight top scorer" onSend={sendMessage} />
            )}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-3 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask the data assistant…"
            className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-sm outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <StarIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function WidgetChip({ label, isActive, onRemove }: { label: string; isActive: boolean; onRemove: () => void }) {
  return (
    <div className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-colors ${
      isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
    }`}>
      <span className="text-xs font-medium truncate min-w-0">{label}</span>
      <button
        onClick={onRemove}
        className={`w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${
          isActive ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function buildFallback(text: string, primaryWidget: WidgetContext | null): string {
  const ctx = primaryWidget ? ` for **${primaryWidget.label}**` : '';
  return (
    `I can't do "${text}"${ctx} yet — here's what I can help with:\n` +
    `• **Chart type** — "change to bar chart" / "switch to line chart"\n` +
    `• **Metric** — "show rebounds", "switch to assists"\n` +
    `• **Highlight** — "highlight Tamin Lipsey", "highlight top scorer"\n` +
    `• **Leaderboard** — "sort by rebounds", "show top 5 players"\n` +
    `• **Colors** — "use ISU red", "use green theme"\n` +
    `• **Rename** — select a widget, then "rename to My Chart"`
  );
}

function SuggestionPill({ label, onSend }: { label: string; onSend: (t: string) => void }) {
  return (
    <button
      onClick={() => onSend(label)}
      className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-full transition-colors"
    >
      {label}
    </button>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0.5L9.8 6.2L15.5 8L9.8 9.8L8 15.5L6.2 9.8L0.5 8L6.2 6.2L8 0.5Z" />
    </svg>
  );
}

function PaperclipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n•[^\n]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('\n•')) {
          return <div key={i} className="mt-1 pl-2 opacity-75">{part.slice(1)}</div>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
