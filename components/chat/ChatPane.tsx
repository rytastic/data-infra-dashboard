'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChartMetric } from '@/components/dashboard/types';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCommand: (cmd: ParsedCommand) => void;
  chartMetric: ChartMetric;
  highlightedPlayer: string | null;
  accentColor: 'cardinal' | 'gold';
}

export interface ParsedCommand {
  type: 'setMetric' | 'highlight' | 'clearHighlight' | 'setAccent' | 'setSeason';
  value?: string;
}

const METRIC_TRIGGERS: { patterns: RegExp[]; metric: ChartMetric; label: string }[] = [
  { patterns: [/rebound/i, /\brbg\b/i, /\brpg\b/i], metric: 'rpg', label: 'Rebounds Per Game' },
  { patterns: [/assist/i, /\bapg\b/i], metric: 'apg', label: 'Assists Per Game' },
  { patterns: [/steal/i, /\bspg\b/i, /\bstl\b/i], metric: 'spg', label: 'Steals Per Game' },
  { patterns: [/\bpoint/i, /\bscoring\b/i, /\bppg\b/i], metric: 'ppg', label: 'Points Per Game' },
];

const HIGHLIGHT_TRIGGER = /highlight\s+([\w\s]+?)(?:\s+in|\s+on|\s*$)/i;
const TOP_SCORER_TRIGGER = /highlight.*\btop\s+scor/i;
const CLEAR_TRIGGER = /clear|remove|reset\s+highlight/i;
const GOLD_TRIGGER = /gold|yellow|change.*(color|theme).*gold|gold.*(color|theme)/i;
const CARDINAL_TRIGGER = /red|cardinal|change.*(color|theme).*red|red.*(color|theme)/i;

const SUGGESTIONS = [
  'Change the chart to show rebounds',
  'Highlight the top scorer in the table',
  'Switch to assists for the comparison chart',
  'Change the accent color to gold',
  'Show steals in the charts',
  'Clear the highlight',
];

function parseCommand(input: string): { command: ParsedCommand; response: string } | null {
  // Highlight / clear checks come first to avoid "scorer" matching the PPG pattern
  if (CLEAR_TRIGGER.test(input)) {
    return {
      command: { type: 'clearHighlight' },
      response: "Cleared! The player highlight has been removed from the table and charts.",
    };
  }

  if (TOP_SCORER_TRIGGER.test(input)) {
    return {
      command: { type: 'highlight', value: '__top_scorer__' },
      response: "Got it! I've highlighted the top scorer in the leaderboard table and player cards.",
    };
  }

  // Named player highlight
  const hlMatch = input.match(HIGHLIGHT_TRIGGER);
  if (hlMatch) {
    const name = hlMatch[1].trim();
    return {
      command: { type: 'highlight', value: name },
      response: `Done! Highlighting **${name}** across the leaderboard table and player comparison chart.`,
    };
  }

  // Metric changes (after highlight checks so "scorer" doesn't match PPG)
  for (const { patterns, metric, label } of METRIC_TRIGGERS) {
    if (patterns.some(p => p.test(input))) {
      return {
        command: { type: 'setMetric', value: metric },
        response: `Done! I've updated both charts to show **${label}**. The season trend and player comparison are now reflecting ${label.toLowerCase()}.`,
      };
    }
  }

  // Accent color
  if (GOLD_TRIGGER.test(input)) {
    return {
      command: { type: 'setAccent', value: 'gold' },
      response: "Switched the accent color to Iowa State Gold (#F1BE48). Looking sharp!",
    };
  }
  if (CARDINAL_TRIGGER.test(input)) {
    return {
      command: { type: 'setAccent', value: 'cardinal' },
      response: "Switched back to Cardinal Red (#C8102E). Go Cyclones!",
    };
  }

  return null;
}

let msgIdCounter = 10;

export default function ChatPane({ open, onClose, onCommand, chartMetric, highlightedPlayer, accentColor }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: "Hi! I can help you customize this dashboard. Try asking me to change the chart metric, highlight a player, or switch the accent color.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: ++msgIdCounter, role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 700 + Math.random() * 400));
    setIsTyping(false);

    const result = parseCommand(text);
    let responseText: string;

    if (result) {
      onCommand(result.command);
      responseText = result.response;
    } else {
      responseText = `I understand you want to "${text}", but I'm not sure how to apply that change. Try asking me to:\n• Change the chart metric (points, rebounds, assists, steals)\n• Highlight a player by name\n• Change the accent color to gold or red`;
    }

    const assistantMsg: Message = {
      id: ++msgIdCounter,
      role: 'assistant',
      text: responseText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMsg]);
  };

  const accentBg = accentColor === 'cardinal' ? 'bg-cardinal' : 'bg-gold';
  const accentText = accentColor === 'cardinal' ? 'text-cardinal' : 'text-gold';

  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-80 xl:w-96 bg-slate-900 border-l border-slate-800 flex flex-col z-40 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0 shadow-2xl shadow-black/40' : 'translate-x-full'
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg ${accentBg} flex items-center justify-center`}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-200 text-sm font-semibold">Dashboard Editor</p>
              <p className="text-slate-500 text-xs">Natural language editing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Context pills */}
        <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-slate-800/50 flex-shrink-0">
          <ContextPill label="Chart" value={chartMetric.toUpperCase()} />
          <ContextPill label="Accent" value={accentColor === 'cardinal' ? 'Cardinal Red' : 'Cyclones Gold'} />
          {highlightedPlayer && <ContextPill label="Highlight" value={highlightedPlayer} />}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className={`w-6 h-6 rounded-full ${accentBg} flex items-center justify-center flex-shrink-0 mr-2 mt-0.5`}>
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? `${accentBg} text-white rounded-tr-sm`
                    : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                }`}
              >
                <FormattedText text={msg.text} accentText={accentText} />
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className={`w-6 h-6 rounded-full ${accentBg} flex items-center justify-center flex-shrink-0 mr-2 mt-0.5`}>
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 py-2 border-t border-slate-800/50 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors duration-150 whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 pb-5 pt-3 flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Change the chart to show rebounds..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-slate-600 transition-colors duration-150"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                input.trim()
                  ? `${accentBg} text-white hover:opacity-90 shadow-md`
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ContextPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-full text-[10px]">
      <span className="text-slate-500">{label}:</span>
      <span className="text-slate-300 font-medium">{value}</span>
    </div>
  );
}

function FormattedText({ text, accentText }: { text: string; accentText: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n•[^\n]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className={accentText}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('\n•')) {
          return <div key={i} className="mt-1 pl-2 text-slate-400">{part.slice(1)}</div>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
