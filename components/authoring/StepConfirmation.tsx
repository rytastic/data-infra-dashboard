'use client';

import { useState, useEffect } from 'react';

interface Props {
  prompt: string;
  onConfirm: () => void;
  onBack: () => void;
}

const INTENT_CARDS = [
  {
    icon: '📊',
    title: "Season-over-Season Trends",
    description: "Line chart comparing key stats across 5 seasons (2020–21 through 2024–25)",
    tag: "Visualization",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    icon: '🏀',
    title: "Player Leaderboard",
    description: "Sortable table of all players with PPG, rebounds, assists, FG%, and more",
    tag: "Table",
    tagColor: "bg-gold/10 text-gold border-gold/20",
  },
  {
    icon: '🎯',
    title: "Top Performer Cards",
    description: "Highlight cards for the season's top 3 scorers with full stat breakdowns",
    tag: "Cards",
    tagColor: "bg-cardinal/10 text-cardinal border-cardinal/20",
  },
];

const REFINEMENTS = [
  "Show only Big 12 conference games",
  "Add a player comparison tool",
  "Include shooting heat maps",
];

export default function StepConfirmation({ prompt, onConfirm, onBack }: Props) {
  const [thinking, setThinking] = useState(true);
  const [selectedRefinements, setSelectedRefinements] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setThinking(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const toggleRefinement = (r: string) => {
    setSelectedRefinements(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  if (thinking) {
    return (
      <div className="w-full max-w-2xl flex flex-col items-center gap-8 animate-fade-up">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="text-3xl">🤔</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cardinal flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-sm mb-4">Analyzing your request...</p>
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-5 py-2.5">
            <ThinkingDots />
            <span className="text-slate-300 text-sm font-medium italic">&ldquo;{prompt.slice(0, 60)}{prompt.length > 60 ? '…' : ''}&rdquo;</span>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-2">
          {['Parsing intent', 'Identifying data sources', 'Mapping layout'].map((label, i) => (
            <ThinkingRow key={label} label={label} delay={i * 400} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl animate-fade-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Intent Understood</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Here&apos;s what I&apos;ll build</h2>
        <p className="text-slate-400 text-sm">
          A full Cyclones basketball dashboard with these components:
        </p>
      </div>

      {/* Intent cards */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {INTENT_CARDS.map((card, i) => (
          <div
            key={card.title}
            className="flex items-start gap-4 bg-slate-800 border border-slate-700 rounded-xl p-4 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-xl flex-shrink-0">
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-slate-100 font-semibold text-sm">{card.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${card.tagColor}`}>
                  {card.tag}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{card.description}</p>
            </div>
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        ))}
      </div>

      {/* Optional refinements */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Optional: Refine your dashboard
        </p>
        <div className="flex flex-wrap gap-2">
          {REFINEMENTS.map(r => (
            <button
              key={r}
              onClick={() => toggleRefinement(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                selectedRefinements.includes(r)
                  ? 'bg-cardinal/20 border-cardinal/50 text-cardinal'
                  : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
              }`}
            >
              {selectedRefinements.includes(r) ? '✓ ' : '+ '}{r}
            </button>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-medium hover:border-slate-600 hover:text-slate-300 transition-all duration-150"
        >
          ← Revise prompt
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cardinal text-white text-sm font-semibold hover:bg-cardinal-dark transition-all duration-200 shadow-md shadow-cardinal/25"
        >
          <span>Looks good, build it</span>
          <span className="text-base">🚀</span>
        </button>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-cardinal animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  );
}

function ThinkingRow({ label, delay }: { label: string; delay: number }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), delay + 600);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
        done ? 'bg-emerald-500/20' : 'bg-slate-700'
      }`}>
        {done
          ? <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          : <div className="w-1.5 h-1.5 rounded-full bg-cardinal animate-pulse" />
        }
      </div>
      <span className={`transition-colors duration-300 ${done ? 'text-slate-300' : 'text-slate-500'}`}>{label}</span>
    </div>
  );
}
