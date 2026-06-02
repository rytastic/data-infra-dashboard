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
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(true);
  const [trendChartType, setTrendChartType] = useState<'line' | 'bar'>('line');
  const [compChartType, setCompChartType] = useState<'bar' | 'line'>('bar');
  const [leaderboardSort, setLeaderboardSort] = useState<string>('ppg');
  const [leaderboardLimit, setLeaderboardLimit] = useState<number | null>(null);
  const [accentColor, setAccentColor] = useState<string>('#3b82f6');
  const [widgetTitles, setWidgetTitles] = useState<Record<string, string>>({});

  const handleWidgetSelect = (id: string, shiftKey = false) => {
    setSelectedWidgets(prev => {
      if (shiftKey) {
        return prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id];
      }
      return prev.length === 1 && prev[0] === id ? [] : [id];
    });
  };

  // Reset all editable state whenever teamId changes
  useEffect(() => {
    setSelectedYear(data.seasons[data.seasons.length - 1].year);
    setHighlightedPlayer(null);
    setSelectedWidgets([]);
    setTrendChartType('line');
    setCompChartType('bar');
    setLeaderboardSort('ppg');
    setLeaderboardLimit(null);
    setAccentColor('#3b82f6');
    setWidgetTitles({});
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

  const widgetContexts: WidgetContext[] = selectedWidgets.map(id => ({
    id,
    ...(WIDGET_META[id] ?? { label: id, isChart: false }),
  }));

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
      case 'setChartType':
        if (cmd.widgetId === 'trend-chart') setTrendChartType(cmd.value as 'line' | 'bar');
        else if (cmd.widgetId === 'comparison-chart') setCompChartType(cmd.value as 'bar' | 'line');
        break;
      case 'setSort':
        setLeaderboardSort(cmd.value ?? 'ppg');
        break;
      case 'setLimit':
        setLeaderboardLimit(cmd.value ? parseInt(cmd.value) : null);
        break;
      case 'setAccentColor':
        setAccentColor(cmd.value ?? '#3b82f6');
        break;
      case 'setWidgetTitle':
        if (cmd.widgetId && cmd.value) {
          setWidgetTitles(prev => ({ ...prev, [cmd.widgetId!]: cmd.value! }));
        }
        break;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Left sidebar */}
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

          {/* Reopen button — only when pane is closed */}
          {!isPreview && !chatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 hover:bg-slate-700 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <StarIcon className="w-3.5 h-3.5" />
              Data assistant
            </button>
          )}
        </header>

        {/* Deselect on background click */}
        <div className="px-8 py-6 space-y-6" onClick={() => setSelectedWidgets([])}>
          <SelectableWidget id="stats" selectedIds={selectedWidgets} onSelect={handleWidgetSelect}>
            <StatsBar season={season} />
          </SelectableWidget>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SelectableWidget id="trend-chart" selectedIds={selectedWidgets} onSelect={handleWidgetSelect}>
              <TrendChart
                seasons={data.seasons}
                metric={chartMetric}
                chartType={trendChartType}
                accentColor={accentColor}
                title={widgetTitles['trend-chart']}
              />
            </SelectableWidget>
            <SelectableWidget id="comparison-chart" selectedIds={selectedWidgets} onSelect={handleWidgetSelect}>
              <ComparisonChart
                season={season}
                metric={chartMetric}
                highlightedPlayer={resolvedHighlight}
                chartType={compChartType}
                accentColor={accentColor}
                title={widgetTitles['comparison-chart']}
              />
            </SelectableWidget>
          </div>

          <SelectableWidget id="player-cards" selectedIds={selectedWidgets} onSelect={handleWidgetSelect}>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-3">
                Top Performers · {season.year}
              </h2>
              <PlayerCards
                players={season.players}
                highlightedPlayer={resolvedHighlight}
                selectedWidgetIds={selectedWidgets}
                onWidgetSelect={handleWidgetSelect}
              />
            </div>
          </SelectableWidget>

          <SelectableWidget id="leaderboard" selectedIds={selectedWidgets} onSelect={handleWidgetSelect}>
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
                externalSortKey={leaderboardSort}
                limit={leaderboardLimit}
              />
            </div>
          </SelectableWidget>

          <div className="h-4" />
        </div>
      </main>

      {/* Right chat pane */}
      {!isPreview && chatOpen && (
        <div className="w-96 flex-shrink-0 border-l border-slate-200 flex flex-col h-full">
          <ChatPane
            onCommand={handleCommand}
            onClose={() => setChatOpen(false)}
            chartMetric={chartMetric}
            highlightedPlayer={resolvedHighlight}
            selectedWidgets={widgetContexts}
            onClearWidget={(id) => setSelectedWidgets(prev => prev.filter(w => w !== id))}
          />
        </div>
      )}
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0.5L9.8 6.2L15.5 8L9.8 9.8L8 15.5L6.2 9.8L0.5 8L6.2 6.2L8 0.5Z" />
    </svg>
  );
}
