'use client';

import { useState, useMemo } from 'react';
import cyclonesData from '@/data/cyclones.json';
import TEAMS from '@/data/teams';
import StatsBar from './StatsBar';
import LeaderboardTable from './LeaderboardTable';
import TrendChart from './TrendChart';
import ComparisonChart from './ComparisonChart';
import PlayerCards from './PlayerCards';
import SelectableWidget from './SelectableWidget';
import ChatPane, { type ParsedCommand } from '@/components/chat/ChatPane';
import type { CyclonesData, ChartMetric } from './types';

const fallbackData = cyclonesData as CyclonesData;

interface Props {
  isPreview?: boolean;
  noSidebar?: boolean;
  teamId?: string;
}

export default function Dashboard({ isPreview = false, noSidebar = false, teamId }: Props) {
  const data = (teamId && TEAMS[teamId]) ? TEAMS[teamId] : fallbackData;
  const [selectedYear, setSelectedYear] = useState(data.seasons[data.seasons.length - 1].year);
  const [chartMetric, setChartMetric] = useState<ChartMetric>('ppg');
  const [highlightedPlayer, setHighlightedPlayer] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const handleWidgetSelect = (id: string) => {
    setSelectedWidget(prev => (prev === id ? null : id));
  };

  const season = useMemo(
    () => data.seasons.find(s => s.year === selectedYear) ?? data.seasons[data.seasons.length - 1],
    [selectedYear]
  );

  const resolvedHighlight = useMemo(() => {
    if (highlightedPlayer === '__top_scorer__') {
      const top = [...season.players].sort((a, b) => b.ppg - a.ppg)[0];
      return top?.name ?? null;
    }
    return highlightedPlayer;
  }, [highlightedPlayer, season]);

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
    <div className="flex h-full min-h-screen bg-slate-50 font-sans">
      {/* Sidebar — hidden when parent shell provides its own sidebar */}
      {!noSidebar && <aside className="w-56 flex-shrink-0 bg-slate-900 flex flex-col border-r border-slate-800">
        {/* Logo */}
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

        {/* Nav */}
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

        {/* Edit button */}
        {!isPreview && (
          <div className="px-3 pb-5">
            <button
              onClick={() => setChatOpen(o => !o)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                chatOpen
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {chatOpen ? 'Close Editor' : 'Edit Dashboard'}
            </button>
          </div>
        )}
      </aside>}

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{ marginRight: !isPreview && chatOpen ? '320px' : 0 }}
      >
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Dashboard logo */}
            <div className="w-12 h-12 rounded-full bg-[#3b82f6] flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-slate-900 font-bold text-lg leading-tight">{data.team}</h1>
              <p className="text-slate-400 text-xs">{season.year} Season</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Season selector */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {data.seasons.map(s => (
                <button
                  key={s.year}
                  onClick={() => setSelectedYear(s.year)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                    selectedYear === s.year
                      ? 'bg-[#3b82f6] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {s.year.slice(2)}
                </button>
              ))}
            </div>

            {/* Record badge */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-lg">
              <span className="text-slate-500 text-xs">Record:</span>
              <span className="text-xs font-bold text-[#3b82f6]">{season.record}</span>
            </div>

            {/* Chat toggle (mobile) */}
            {!isPreview && (
              <button
                onClick={() => setChatOpen(o => !o)}
                className={`xl:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  chatOpen ? 'bg-[#3b82f6] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Edit
              </button>
            )}
          </div>
        </header>

        {/* Deselect on background click */}
        <div className="px-8 py-6 space-y-6" onClick={() => setSelectedWidget(null)}>
          {/* Stats summary bar */}
          <SelectableWidget id="stats" selectedId={selectedWidget} onSelect={handleWidgetSelect}>
            <StatsBar season={season} />
          </SelectableWidget>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SelectableWidget id="trend-chart" selectedId={selectedWidget} onSelect={handleWidgetSelect}>
              <TrendChart seasons={data.seasons} metric={chartMetric} />
            </SelectableWidget>
            <SelectableWidget id="comparison-chart" selectedId={selectedWidget} onSelect={handleWidgetSelect}>
              <ComparisonChart season={season} metric={chartMetric} highlightedPlayer={resolvedHighlight} />
            </SelectableWidget>
          </div>

          {/* Player cards */}
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

          {/* Leaderboard */}
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

      {/* Chat pane */}
      {!isPreview && (
        <ChatPane
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          onCommand={handleCommand}
          chartMetric={chartMetric}
          highlightedPlayer={resolvedHighlight}
        />
      )}
    </div>
  );
}
