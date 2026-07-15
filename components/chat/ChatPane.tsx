'use client';

import { useState, useRef, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import { Button } from '@astryxdesign/core/Button';
import { IconButton } from '@astryxdesign/core/IconButton';
import {
  ChatLayout,
  ChatMessageList,
  ChatMessage,
  ChatMessageBubble,
  ChatComposer,
} from '@astryxdesign/core/Chat';
import type { ChartMetric, PendingEdit } from '@/components/dashboard/types';

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
  widgetIds?: string[];
}

export interface WidgetContext {
  id: string;
  label: string;
  isChart: boolean;
  chartType?: 'line' | 'bar';
}

interface Props {
  onCommand: (cmd: ParsedCommand) => PendingEdit[];
  onClose?: () => void;
  chartMetric: ChartMetric;
  highlightedPlayer: string | null;
  selectedWidgets: WidgetContext[];
  onClearWidget: (id: string) => void;
  pendingEdits: PendingEdit[];
  onAcceptEdits: () => void;
  onDiscardEdits: () => void;
  emptyHeading?: string;
  emptySuggestions?: string[];
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

function buildChartTypeCommand(
  chartType: 'line' | 'bar',
  selectedWidgets: WidgetContext[],
  primaryWidget: WidgetContext | null,
): { command: ParsedCommand; response: string } {
  const chartWidgets = selectedWidgets.filter(w => w.isChart);
  if (chartWidgets.length > 1) {
    const widgetIds = chartWidgets.map(w => w.id);
    const labels = chartWidgets.map(w => w.label);
    const labelStr = labels.length === 2
      ? `**${labels[0]}** and **${labels[1]}**`
      : labels.slice(0, -1).map(l => `**${l}**`).join(', ') + ` and **${labels[labels.length - 1]}**`;
    return {
      command: { type: 'setChartType', value: chartType, widgetIds },
      response: `Switched ${labelStr} to ${chartType} charts.`,
    };
  }
  const widgetId = chartWidgets[0]?.id ?? (primaryWidget?.isChart ? primaryWidget.id : 'trend-chart');
  const label = chartWidgets[0]?.label ?? primaryWidget?.label ?? 'Chart 1 · Scoring Trend';
  return {
    command: { type: 'setChartType', value: chartType, widgetId },
    response: `Switched **${label}** to a ${chartType} chart.`,
  };
}

function parseCommand(
  input: string,
  primaryWidget: WidgetContext | null,
  selectedWidgets: WidgetContext[],
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
    return buildChartTypeCommand('bar', selectedWidgets, primaryWidget);
  }
  if (/\bline\b.*chart|\bline\b.*graph|switch.*\bline\b|change.*\bline\b|as lines?\b|to line\b/i.test(input)) {
    return buildChartTypeCommand('line', selectedWidgets, primaryWidget);
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
  pendingEdits,
  onAcceptEdits,
  onDiscardEdits,
  emptyHeading,
  emptySuggestions,
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

  // Most-recently-selected widget drives command targeting
  const primaryWidget = selectedWidgets.length > 0 ? selectedWidgets[selectedWidgets.length - 1] : null;

  const visibleChips = selectedWidgets.slice(0, MAX_VISIBLE_CHIPS);
  const overflowCount = Math.max(0, selectedWidgets.length - MAX_VISIBLE_CHIPS);
  const isEmptyState = messages.length === 1 && messages[0].role === 'assistant' && selectedWidgets.length === 0 && pendingEdits.length === 0;

  const handleAccept = async () => {
    setMessages(prev => [...prev, { id: ++msgIdCounter, role: 'user', text: 'Accept', timestamp: new Date() }]);
    onAcceptEdits();
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 600));
    setIsTyping(false);
    setMessages(prev => [...prev, { id: ++msgIdCounter, role: 'assistant', text: 'Done! All changes have been applied to your dashboard.', timestamp: new Date() }]);
  };

  const handleDiscard = async () => {
    setMessages(prev => [...prev, { id: ++msgIdCounter, role: 'user', text: 'Discard all', timestamp: new Date() }]);
    onDiscardEdits();
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 600));
    setIsTyping(false);
    setMessages(prev => [...prev, { id: ++msgIdCounter, role: 'assistant', text: 'Discarded. Your dashboard has been reverted to its previous state.', timestamp: new Date() }]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: ++msgIdCounter, role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
    setIsTyping(false);

    const result = parseCommand(text, primaryWidget, selectedWidgets);
    if (result) onCommand(result.command);
    const responseText = result
      ? result.response
      : buildFallback(text, primaryWidget);

    setMessages(prev => [
      ...prev,
      { id: ++msgIdCounter, role: 'assistant', text: responseText, timestamp: new Date() },
    ]);
  };

  const assistantAvatar = (
    <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
      <StarIcon className="w-3 h-3 text-white" />
    </div>
  );

  const suggestionPills = (() => {
    const pills: string[] = [];
    const chartWidgets = selectedWidgets.filter(w => w.isChart);
    if (chartWidgets.length > 0) {
      const allBar = chartWidgets.every(w => w.chartType === 'bar');
      const allLine = chartWidgets.every(w => w.chartType === 'line');
      if (!allBar) pills.push('Change to bar chart');
      if (!allLine) pills.push('Change to line chart');
    }
    if (selectedWidgets.some(w => w.id === 'leaderboard')) {
      pills.push('Sort by rebounds', 'Show top 5 players');
    }
    pills.push('Show rebounds', 'Highlight top scorer', 'Use ISU red');
    return [...new Set(pills)].slice(0, 3);
  })();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          {assistantAvatar}
          <span className="text-sm font-semibold text-slate-900">Data assistant</span>
        </div>
        <div className="flex items-center gap-0.5">
          <IconButton icon={<PaperclipIcon />} label="Attach" variant="ghost" />
          <IconButton icon={<DotsIcon />} label="More options" variant="ghost" />
          {onClose && <IconButton icon={<CloseIcon />} label="Close" variant="ghost" onClick={onClose} />}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <ChatLayout
          composer={
            <ChatComposer
              value={input}
              onChange={setInput}
              onSubmit={sendMessage}
              placeholder="Ask the data assistant…"
              drawer={
                selectedWidgets.length > 0 ? (
                  <div className="px-1 pt-1">
                    <div className="space-y-1.5">
                      {visibleChips.map(widget => (
                        <WidgetChip key={widget.id} label={widget.label} onRemove={() => onClearWidget(widget.id)} />
                      ))}
                    </div>

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
                                <WidgetChip key={widget.id} label={widget.label} onRemove={() => onClearWidget(widget.id)} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="my-2 border-t border-slate-200" />

                    <div className="flex flex-wrap gap-2 pb-1">
                      {suggestionPills.map(label => (
                        <SuggestionPill key={label} label={label} onSend={sendMessage} />
                      ))}
                    </div>
                  </div>
                ) : undefined
              }
            />
          }
        >
          <ChatMessageList
            emptyState={
              <div className="w-full px-2">
                <h2 className="text-2xl font-semibold text-slate-800 text-center mb-5">
                  {emptyHeading ?? 'Jump into the data…'}
                </h2>
                <div className="w-full space-y-2.5">
                  {(emptySuggestions ?? EMPTY_SUGGESTIONS).map(s => (
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
            }
          >
            {!isEmptyState && (
              <>
                {messages.map(msg => (
                  <ChatMessage key={msg.id} sender={msg.role} avatar={msg.role === 'assistant' ? assistantAvatar : undefined}>
                    <ChatMessageBubble>
                      <FormattedText text={msg.text} />
                    </ChatMessageBubble>
                  </ChatMessage>
                ))}

                {isTyping && (
                  <ChatMessage sender="assistant" avatar={assistantAvatar}>
                    <ChatMessageBubble>
                      <div className="flex items-center gap-1.5 py-0.5">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                        ))}
                      </div>
                    </ChatMessageBubble>
                  </ChatMessage>
                )}

                {pendingEdits.length > 0 && (
                  <ChatMessage sender="assistant" avatar={assistantAvatar}>
                    <EditsCard edits={pendingEdits} onAccept={handleAccept} onDiscard={handleDiscard} />
                  </ChatMessage>
                )}
              </>
            )}
          </ChatMessageList>
        </ChatLayout>
      </div>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function WidgetChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-700">
      <span className="text-xs font-medium truncate min-w-0">{label}</span>
      <button
        onClick={onRemove}
        className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── edits card ───────────────────────────────────────────────────────────────

interface HoverState {
  edit: PendingEdit;
  top: number;
  right: number;
}

function EditsCard({ edits, onAccept, onDiscard }: {
  edits: PendingEdit[];
  onAccept: () => void;
  onDiscard: () => void;
}) {
  const [hovered, setHovered] = useState<HoverState | null>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>, edit: PendingEdit) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHovered({ edit, top: rect.top + rect.height / 2, right: window.innerWidth - rect.left + 12 });
  }, []);

  return (
    <div className="rounded-2xl rounded-tl-sm bg-violet-50 overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-xl font-bold text-slate-800">Review edits</h3>
      </div>

      <div className="px-3 pb-3">
        {edits.map((edit, i) => (
          <div key={edit.id}>
            {i > 0 && <div className="border-t border-violet-200 mx-2" />}
            <div
              className="flex items-center justify-between px-2 py-3 gap-3 rounded-xl hover:bg-violet-100 transition-colors cursor-default"
              onMouseEnter={(e) => handleMouseEnter(e, edit)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-slate-700 leading-snug truncate">{edit.description}</span>
              </div>
              <div className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center bg-violet-500">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-violet-200">
        <Button label="Discard all" variant="ghost" onClick={onDiscard} />
        <Button label="Accept" variant="primary" onClick={onAccept} />
      </div>

      {/* Fixed-position before/after popover */}
      {hovered && (
        <EditPreviewPopover state={hovered} onClose={() => setHovered(null)} />
      )}
    </div>
  );
}

function EditPreviewPopover({ state, onClose }: { state: HoverState; onClose: () => void }) {
  const { edit, top, right } = state;
  const hasCharts = !!edit.previewOptions;

  return (
    <div
      className="fixed z-[9999] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
      style={{
        top,
        right,
        transform: 'translateY(-50%)',
        width: hasCharts ? 440 : 280,
      }}
      onMouseEnter={() => {/* keep open when hovering preview */}}
      onMouseLeave={onClose}
    >
      <div className="px-4 pt-3 pb-2 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-500">{edit.description}</p>
      </div>
      <div className="flex">
        {/* Before */}
        <div className="flex-1 p-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Before</p>
          {hasCharts ? (
            <ReactECharts option={edit.previewOptions!.before} style={{ height: 130 }} notMerge />
          ) : (
            <FallbackPreview value={edit.before} previewType={edit.previewType} />
          )}
        </div>
        <div className="w-px bg-slate-100" />
        {/* After */}
        <div className="flex-1 p-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">After</p>
          {hasCharts ? (
            <ReactECharts option={edit.previewOptions!.after} style={{ height: 130 }} notMerge />
          ) : (
            <FallbackPreview value={edit.after} previewType={edit.previewType} />
          )}
        </div>
      </div>
    </div>
  );
}

function FallbackPreview({ value, previewType }: { value: string; previewType: PendingEdit['previewType'] }) {
  if (previewType === 'color') {
    return <div className="h-10 rounded-lg w-full" style={{ background: value }} />;
  }
  return (
    <div className="px-2 py-2 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 text-center truncate">
      {value}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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

function PaperclipIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );
}

function DotsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
