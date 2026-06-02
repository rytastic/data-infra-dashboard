'use client';

import { useState, useMemo, useEffect } from 'react';
import cyclonesData from '@/data/cyclones.json';
import TEAMS from '@/data/teams';
import StatsBar from './StatsBar';
import LeaderboardTable from './LeaderboardTable';
import TrendChart from './TrendChart';
import ComparisonChart from './ComparisonChart';
import PlayerCards from './PlayerCards';
import SelectableWidget from './SelectableWidget';
import ChatPane, { type ParsedCommand, type WidgetContext } from '@/components/chat/ChatPane';
import type { CyclonesData, ChartMetric } from './types';

const fallbackData = cyclonesData as CyclonesData;

const WIDGET_META: Record<string, { label: string; isChart: boolean }> = {
  stats: { label: 'Season Highlights', isChart: false },
  'trend-chart': { label: 'Chart 1 · Scoring Trend', isChart: true },
  'comparison-chart': { label: 'Chart 2 · Game-by-Game Margin', isChart: true },
  'player-cards': { label: 'Chart 3 · Roster Stats', isChart: false },
  leaderboard: { label: 'Player Leaderboard', isChart: false },
};

interface Props {
  isPreview?: boolean;
  noSidebar?: boolean;
  teamId?: string;
  sectionTitle?: string;
}

export default function Dashboard({ isPreview = false, noSidebar = false, teamId, sectionTitle }: Props) {
  const data = (teamId && TEAMS[teamId]) ? TEAMS[teamId] : fallbackData;
  const [selectedYear, setSelectedYear] = useState(data.seasons[data.seasons.length - 1].year);
  const [chartMetric, setChartMetric] = useState<ChartMetric>('ppg');
  const [highlightedPlayer, setHighlightedPlayer] = useState<string | null>(null);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const handleWidgetSelect = (id: string) => {
    setSelectedWidget(prev => (prev === id ? null : id));
  };

  // Reset to the team's latest season whenever teamId changes
  useEffect(() => {
    setSelectedYear(data.seasons[data.seasons.length - 1].year);
    setHighlightedPlayer(null);
    setSelectedWidget(null);
  }, [teamId]); // eslint-disable-line react-hooks/exhaustive-deps

  const season = useMemo(
    () => data.seasons.find(s => s.year === selectedYear) ?? data.seasons[data.seasons.length - 1],
    [selectedYear, data]
  );

  const resolvedHighlight = useMemo(() => {
    if (highlightedPlayer === '__top_scorer__') {
      const top = [...season.players].sort((a, b) => b.ppg - a.ppg)[0];
      return top?.name ?? null;
    }
    return highlightedPlayer;
  }, [highlightedPlayer, season]);

  const widgetContext: WidgetContext | null = selectedWidget
    ? { id: selectedWidget, ...(WIDGET_META[selectedWidget] ?? { label: selectedWidget, isChart: false }) }
    : null;

  const handleCommand = (cmd: ParsedCommand) => {
    switch (cmd.type) {
      case 'setMetric':
        setChartMetric(cmd.value as ChartMetric);
        break;
      case 'highlight':
        setHighlightedPlayer(cmd.value ?? null);
        break;
      case 'clearHighlight':
        setHighlightedPlayer(null);
        break;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar — hidden when parent shell provides its own sidebar */}
      {!noSidebar && (
        <aside className="w-56 flex-shrink-0 bg-slate-900 flex flex-col border-r border-slate-800">
          <div className="px-5 py-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-100 text-xs font-bold leading-tight">Analytics</p>
                <p className="text-slate-400 text-[10px]">Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {[
              { label: 'Overview', icon: '📊', active: true },
              { label: 'Players', icon: '🏀', active: false },
              { label: 'Schedule', icon: '📅', active: false },
              { label: 'Recruiting', icon: '🎯', active: false },
              { label: 'Analytics', icon: '🔬', active: false },
            ].map(item => (
              <div
                key={item.label}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-150 ${
                  item.active
                    ? 'bg-[#3b82f6]/15 text-[#3b82f6]'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />}
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              {sectionTitle && (
                <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-widest mb-0.5 leading-none">
                  {sectionTitle}
                </p>
              )}
              <h1 className="text-slate-900 font-bold text-xl leading-tight">{data.team}</h1>
            </div>
          </div>

        </header>

        {/* Deselect on background click */}
        <div className="px-8 py-6 space-y-6" onClick={() => setSelectedWidget(null)}>
          <SelectableWidget id="stats" selectedId={selectedWidget} onSelect={handleWidgetSelect}>
            <StatsBar season={season} />
          </SelectableWidget>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SelectableWidget id="trend-chart" selectedId={selectedWidget} onSelect={handleWidgetSelect}>
              <TrendChart seasons={data.seasons} metric={chartMetric} />
            </SelectableWidget>
            <SelectableWidget id="comparison-chart" selectedId={selectedWidget} onSelect={handleWidgetSelect}>
              <ComparisonChart season={season} metric={chartMetric} highlightedPlayer={resolvedHighlight} />
            </SelectableWidget>
          </div>

          <SelectableWidget id="player-cards" selectedId={selectedWidget} onSelect={handleWidgetSelect}>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-3">
                Top Performers · {season.year}
              </h2>
              <PlayerCards
                players={season.players}
                highlightedPlayer={resolvedHighlight}
                selectedWidgetId={selectedWidget}
                onWidgetSelect={handleWidgetSelect}
              />
            </div>
          </SelectableWidget>

          <SelectableWidget id="leaderboard" selectedId={selectedWidget} onSelect={handleWidgetSelect}>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wider">
                  Player Leaderboard
                </h2>
                {resolvedHighlight && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setHighlightedPlayer(null); }}
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear highlight
                  </button>
                )}
              </div>
              <LeaderboardTable
                players={season.players}
                highlightedPlayer={resolvedHighlight}
                chartMetric={chartMetric}
              />
            </div>
          </SelectableWidget>

          <div className="h-4" />
        </div>
      </main>

      {/* Right chat pane — always visible in dashboard mode */}
      {!isPreview && (
        <div className="w-96 flex-shrink-0 border-l border-slate-200 flex flex-col h-full">
          <ChatPane
            onCommand={handleCommand}
            chartMetric={chartMetric}
            highlightedPlayer={resolvedHighlight}
            selectedWidget={widgetContext}
            onClearWidget={() => setSelectedWidget(null)}
          />
        </div>
      )}
    </div>
  );
}
