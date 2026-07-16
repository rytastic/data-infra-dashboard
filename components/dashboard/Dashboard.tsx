'use client';

import { useState, useMemo, useEffect } from 'react';
import { Layout, LayoutContent, LayoutPanel } from '@astryxdesign/core/Layout';
import { TabList, Tab } from '@astryxdesign/core/TabList';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Icon } from '@astryxdesign/core/Icon';
import { type SelectorOptionType } from '@astryxdesign/core/Selector';
import cyclonesData from '@/data/cyclones.json';
import TEAMS from '@/data/teams';
import StatsBar from './StatsBar';
import LeaderboardTable from './LeaderboardTable';
import TrendChart from './TrendChart';
import ComparisonChart from './ComparisonChart';
import PlayerCards from './PlayerCards';
import SelectableWidget from './SelectableWidget';
import ManualEditPane from './ManualEditPane';
import ChatPane, { type ParsedCommand, type WidgetContext } from '@/components/chat/ChatPane';
import type { CyclonesData, ChartMetric, PendingEdit, Season, Player } from './types';

const fallbackData = cyclonesData as CyclonesData;

// All selectable "teams" a widget's data source can point at, including the
// Iowa State fallback dataset that isn't part of the TEAMS record.
const ALL_TEAMS: Record<string, CyclonesData> = { 'iowa-state': fallbackData, ...TEAMS };
const TEAM_ORDER = ['iowa-state', 'kansas', 'tcu', 'arizona', 'byu', 'houston'];

const MINI_PALETTE = ['#F02849', '#FFAD0F', '#8A3FC7'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function miniTrendOption(type: 'line' | 'bar', seasons: Season[], metric: ChartMetric, color: string): Record<string, any> {
  const allNames = Array.from(new Set(seasons.flatMap(s => s.players.map(p => p.name))));
  const top3 = allNames
    .map(name => ({ name, max: Math.max(...seasons.flatMap(s => s.players.filter(p => p.name === name).map(p => p[metric] as number))) }))
    .sort((a, b) => b.max - a.max).slice(0, 3).map(p => p.name);
  return {
    animation: false, backgroundColor: 'transparent',
    grid: { top: 4, right: 4, bottom: 24, left: 28, containLabel: false },
    xAxis: { type: 'category', data: seasons.map(s => s.year.slice(2)), axisLabel: { fontSize: 8, color: '#94a3b8' }, axisTick: { show: false }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: { type: 'value', axisLabel: { fontSize: 8, color: '#94a3b8' }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLine: { show: false }, axisTick: { show: false } },
    series: top3.map((name, i) => {
      const c = i === 0 ? color : MINI_PALETTE[i - 1];
      const data = seasons.map(s => +(s.players.find(p => p.name === name)?.[metric] as number ?? 0).toFixed(1));
      return type === 'line'
        ? { name, type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 1.5, color: c }, itemStyle: { color: c }, data }
        : { name, type: 'bar', barMaxWidth: 8, itemStyle: { color: c, borderRadius: [2, 2, 0, 0] }, data };
    }),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function miniCompOption(type: 'bar' | 'line', players: Player[], metric: ChartMetric, color: string): Record<string, any> {
  const data = [...players].sort((a, b) => (b[metric] as number) - (a[metric] as number)).slice(0, 8)
    .map(p => ({ name: p.name.split(' ').pop() ?? p.name, value: +(p[metric] as number).toFixed(1) }));
  return {
    animation: false, backgroundColor: 'transparent',
    grid: { top: 4, right: 4, bottom: 28, left: 28, containLabel: false },
    xAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { fontSize: 7, color: '#94a3b8', rotate: -30, interval: 0 }, axisTick: { show: false }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: { type: 'value', axisLabel: { fontSize: 7, color: '#94a3b8' }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLine: { show: false }, axisTick: { show: false } },
    series: [type === 'bar'
      ? { type: 'bar', data: data.map(d => d.value), barMaxWidth: 12, itemStyle: { color, borderRadius: [3, 3, 0, 0] } }
      : { type: 'line', smooth: true, symbol: 'none', data: data.map(d => d.value), lineStyle: { width: 2, color }, itemStyle: { color } }],
  };
}

const WIDGET_META: Record<string, { label: string; isChart: boolean }> = {
  stats: { label: 'Season Highlights', isChart: false },
  'trend-chart': { label: 'Chart 1 · Scoring Trend', isChart: true },
  'comparison-chart': { label: 'Chart 2 · Game-by-Game Margin', isChart: true },
  'player-cards': { label: 'Chart 3 · Roster Stats', isChart: false },
  leaderboard: { label: 'Player Leaderboard', isChart: false },
};

export type DashboardLayout = 'overview' | 'player-comparison' | 'top-scorers';
type RightPaneTab = 'chat' | 'edit';

interface Props {
  isPreview?: boolean;
  noSidebar?: boolean;
  teamId?: string;
  sectionTitle?: string;
  layout?: DashboardLayout;
  title?: string;
  startWithCloneSuggestion?: boolean;
  onCloneDashboard?: () => void;
}

export default function Dashboard({
  isPreview = false,
  noSidebar = false,
  teamId,
  sectionTitle,
  layout = 'overview',
  title,
  startWithCloneSuggestion = false,
  onCloneDashboard,
}: Props) {
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
  const [pendingEdits, setPendingEdits] = useState<PendingEdit[]>([]);
  // snapshot taken before the first pending edit so we can revert all at once
  const [editSnapshot, setEditSnapshot] = useState<{
    trendChartType: 'line' | 'bar';
    compChartType: 'bar' | 'line';
    chartMetric: ChartMetric;
    leaderboardSort: string;
    leaderboardLimit: number | null;
    accentColor: string;
    widgetTitles: Record<string, string>;
    highlightedPlayer: string | null;
  } | null>(null);

  // Manual (non-chat) per-widget editing: which widget's edit pane is showing,
  // which tab is active, and per-widget team/season data-source overrides.
  const [rightPaneTab, setRightPaneTab] = useState<RightPaneTab>('chat');
  const [manualEditWidgetId, setManualEditWidgetId] = useState<string | null>(null);
  const [widgetDataOverrides, setWidgetDataOverrides] = useState<Record<string, { teamId: string; year?: string }>>({});

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
    setManualEditWidgetId(null);
    setRightPaneTab('chat');
    setWidgetDataOverrides({});
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

  // Resolves a widget's effective team/season: its own data-source override
  // if one has been set via the manual edit pane, else the dashboard default.
  const resolveWidgetTeamData = (widgetId: string): CyclonesData => {
    const override = widgetDataOverrides[widgetId];
    if (override && ALL_TEAMS[override.teamId]) return ALL_TEAMS[override.teamId];
    return data;
  };
  const resolveWidgetSeason = (widgetId: string): Season => {
    const teamData = resolveWidgetTeamData(widgetId);
    const year = widgetDataOverrides[widgetId]?.year ?? selectedYear;
    return teamData.seasons.find(s => s.year === year) ?? teamData.seasons[teamData.seasons.length - 1];
  };

  const widgetContexts: WidgetContext[] = selectedWidgets.map(id => ({
    id,
    ...(WIDGET_META[id] ?? { label: id, isChart: false }),
    chartType: id === 'trend-chart' ? trendChartType : id === 'comparison-chart' ? compChartType : undefined,
  }));

  const pendingWidgetIds = useMemo(
    () => Array.from(new Set(pendingEdits.flatMap(e => e.affectedWidgetIds))),
    [pendingEdits]
  );

  const handleCommand = (cmd: ParsedCommand): PendingEdit[] => {
    const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    // Snapshot state before the first edit so we can revert all at once
    setPendingEdits(prev => {
      if (prev.length === 0) {
        setEditSnapshot({ trendChartType, compChartType, chartMetric, leaderboardSort, leaderboardLimit, accentColor, widgetTitles, highlightedPlayer });
      }
      return prev;
    });

    const edits: PendingEdit[] = [];

    switch (cmd.type) {
      case 'setMetric': {
        const beforeMetric = chartMetric;
        const afterMetric = cmd.value as ChartMetric;
        setChartMetric(afterMetric);
        const previewOptions = {
          before: miniCompOption(compChartType, season.players, beforeMetric, accentColor),
          after: miniCompOption(compChartType, season.players, afterMetric, accentColor),
        };
        edits.push({ id: makeId(), description: `Changed metric to ${afterMetric.toUpperCase()}`, previewType: 'metric', before: beforeMetric.toUpperCase(), after: afterMetric.toUpperCase(), affectedWidgetIds: ['trend-chart', 'comparison-chart'], previewOptions });
        break;
      }
      case 'highlight': {
        const before = highlightedPlayer ?? 'none';
        setHighlightedPlayer(cmd.value ?? null);
        const label = cmd.value === '__top_scorer__' ? 'top scorer' : (cmd.value ?? '');
        edits.push({ id: makeId(), description: `Highlighted ${label}`, previewType: 'highlight', before, after: label, affectedWidgetIds: ['leaderboard', 'player-cards'] });
        break;
      }
      case 'clearHighlight':
        setHighlightedPlayer(null);
        edits.push({ id: makeId(), description: 'Cleared player highlight', previewType: 'highlight', before: highlightedPlayer ?? 'none', after: 'none', affectedWidgetIds: ['leaderboard', 'player-cards'] });
        break;
      case 'setChartType': {
        const after = cmd.value as 'line' | 'bar';
        const targetIds = cmd.widgetIds ?? (cmd.widgetId ? [cmd.widgetId] : ['trend-chart']);
        for (const targetId of targetIds) {
          const isTrend = targetId === 'trend-chart';
          const before = isTrend ? trendChartType : compChartType;
          if (before === after) continue;
          if (isTrend) setTrendChartType(after);
          else setCompChartType(after as 'bar' | 'line');
          const chartLabel = isTrend ? 'Scoring Trend' : 'Player Comparison';
          const previewOptions = isTrend
            ? { before: miniTrendOption(before as 'line' | 'bar', data.seasons, chartMetric, accentColor), after: miniTrendOption(after, data.seasons, chartMetric, accentColor) }
            : { before: miniCompOption(before as 'bar' | 'line', season.players, chartMetric, accentColor), after: miniCompOption(after as 'bar' | 'line', season.players, chartMetric, accentColor) };
          edits.push({ id: makeId(), description: `Changed ${chartLabel} to ${after} chart`, previewType: 'chart-type', before, after, affectedWidgetIds: [targetId], previewOptions });
        }
        break;
      }
      case 'setSort': {
        const before = leaderboardSort;
        setLeaderboardSort(cmd.value ?? 'ppg');
        edits.push({ id: makeId(), description: `Sorted leaderboard by ${cmd.value?.toUpperCase()}`, previewType: 'sort', before: before.toUpperCase(), after: (cmd.value ?? '').toUpperCase(), affectedWidgetIds: ['leaderboard'] });
        break;
      }
      case 'setLimit': {
        const n = cmd.value ? parseInt(cmd.value) : null;
        const before = leaderboardLimit ? `Top ${leaderboardLimit}` : 'All players';
        setLeaderboardLimit(n);
        edits.push({ id: makeId(), description: n ? `Showing top ${n} players` : 'Showing all players', previewType: 'limit', before, after: n ? `Top ${n}` : 'All players', affectedWidgetIds: ['leaderboard'] });
        break;
      }
      case 'setAccentColor': {
        const before = accentColor;
        const after = cmd.value ?? '#3b82f6';
        setAccentColor(after);
        const previewOptions = {
          before: miniTrendOption(trendChartType, data.seasons, chartMetric, before),
          after: miniTrendOption(trendChartType, data.seasons, chartMetric, after),
        };
        edits.push({ id: makeId(), description: 'Changed chart accent color', previewType: 'color', before, after, affectedWidgetIds: ['trend-chart', 'comparison-chart'], previewOptions });
        break;
      }
      case 'setWidgetTitle': {
        if (cmd.widgetId && cmd.value) {
          const before = widgetTitles[cmd.widgetId] ?? WIDGET_META[cmd.widgetId]?.label ?? cmd.widgetId;
          setWidgetTitles(prev => ({ ...prev, [cmd.widgetId!]: cmd.value! }));
          edits.push({ id: makeId(), description: `Renamed widget to "${cmd.value}"`, previewType: 'title', before, after: cmd.value, affectedWidgetIds: [cmd.widgetId] });
        }
        break;
      }
    }

    if (edits.length > 0) {
      setPendingEdits(prev => [...prev, ...edits]);
    }
    return edits;
  };

  const handleAcceptEdits = () => {
    setPendingEdits([]);
    setEditSnapshot(null);
    setSelectedWidgets([]);
  };

  const handleDiscardEdits = () => {
    if (editSnapshot) {
      setTrendChartType(editSnapshot.trendChartType);
      setCompChartType(editSnapshot.compChartType);
      setChartMetric(editSnapshot.chartMetric);
      setLeaderboardSort(editSnapshot.leaderboardSort);
      setLeaderboardLimit(editSnapshot.leaderboardLimit);
      setAccentColor(editSnapshot.accentColor);
      setWidgetTitles(editSnapshot.widgetTitles);
      setHighlightedPlayer(editSnapshot.highlightedPlayer);
    }
    setPendingEdits([]);
    setEditSnapshot(null);
    // keep widget selection so the user can continue editing
  };

  // Manual edit pane wiring — independent of the chat multi-select above.
  // Only one widget can be manually edited at a time; retargeting only
  // happens by hovering a different widget and clicking its Edit button.
  const handleEditWidget = (id: string) => {
    setManualEditWidgetId(id);
    setRightPaneTab('edit');
    if (!chatOpen) setChatOpen(true);
  };

  const manualEditMeta = manualEditWidgetId
    ? (WIDGET_META[manualEditWidgetId] ?? { label: manualEditWidgetId, isChart: false })
    : null;
  const manualEditIsTrend = manualEditWidgetId === 'trend-chart';

  const dataSourceOptions: SelectorOptionType[] = manualEditWidgetId
    ? manualEditIsTrend
      ? TEAM_ORDER.map(id => ({ value: id, label: ALL_TEAMS[id].team }))
      : TEAM_ORDER.map(id => ({
          type: 'section' as const,
          title: ALL_TEAMS[id].team,
          options: ALL_TEAMS[id].seasons.map(s => ({ value: `${id}::${s.year}`, label: s.year })),
        }))
    : [];

  const defaultTeamKey = teamId && TEAMS[teamId] ? teamId : 'iowa-state';
  const currentOverride = manualEditWidgetId ? widgetDataOverrides[manualEditWidgetId] : undefined;
  const currentTeamKey = currentOverride?.teamId ?? defaultTeamKey;
  const dataSourceValue = manualEditWidgetId
    ? (manualEditIsTrend ? currentTeamKey : `${currentTeamKey}::${currentOverride?.year ?? selectedYear}`)
    : '';

  const handleDataSourceChange = (value: string) => {
    if (!manualEditWidgetId) return;
    if (manualEditIsTrend) {
      setWidgetDataOverrides(prev => ({ ...prev, [manualEditWidgetId]: { teamId: value } }));
    } else {
      const [teamKey, year] = value.split('::');
      setWidgetDataOverrides(prev => ({ ...prev, [manualEditWidgetId]: { teamId: teamKey, year } }));
    }
  };

  const handleManualTitleChange = (value: string) => {
    if (!manualEditWidgetId) return;
    setWidgetTitles(prev => {
      if (value.trim() === '') {
        const next = { ...prev };
        delete next[manualEditWidgetId];
        return next;
      }
      return { ...prev, [manualEditWidgetId]: value };
    });
  };

  const manualEditChartType = manualEditWidgetId === 'trend-chart'
    ? trendChartType
    : manualEditWidgetId === 'comparison-chart'
      ? compChartType
      : undefined;
  const handleManualChartTypeChange = (value: 'line' | 'bar') => {
    if (manualEditWidgetId === 'trend-chart') setTrendChartType(value);
    else if (manualEditWidgetId === 'comparison-chart') setCompChartType(value as 'bar' | 'line');
  };

  return (
    <Layout
      height="fill"
      content={
        <LayoutContent padding={0}>
          <div className="bg-slate-50 font-sans min-w-0">
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
              <h1 className="text-slate-900 font-bold text-xl leading-tight">{title ?? data.team}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPreview && onCloneDashboard && (
              <button
                onClick={onCloneDashboard}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors shadow-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Clone dashboard
              </button>
            )}

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
          </div>
        </header>

        {/* Deselect on background click */}
        <div className="px-8 py-6 space-y-6" onClick={() => setSelectedWidgets([])}>

          {/* ── OVERVIEW: charts → stats → player cards → leaderboard ── */}
          {layout === 'overview' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SelectableWidget id="trend-chart" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={handleEditWidget}>
                  <TrendChart seasons={resolveWidgetTeamData('trend-chart').seasons} metric={chartMetric} chartType={trendChartType} accentColor={accentColor} title={widgetTitles['trend-chart']} />
                </SelectableWidget>
                <SelectableWidget id="comparison-chart" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={handleEditWidget}>
                  <ComparisonChart season={resolveWidgetSeason('comparison-chart')} metric={chartMetric} highlightedPlayer={resolvedHighlight} chartType={compChartType} accentColor={accentColor} title={widgetTitles['comparison-chart']} />
                </SelectableWidget>
              </div>
              <SelectableWidget id="stats" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={handleEditWidget}>
                <StatsBar season={resolveWidgetSeason('stats')} />
              </SelectableWidget>
              <SelectableWidget id="player-cards" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={handleEditWidget}>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-3">Top Performers · {resolveWidgetSeason('player-cards').year}</h2>
                  <PlayerCards players={resolveWidgetSeason('player-cards').players} highlightedPlayer={resolvedHighlight} selectedWidgetIds={selectedWidgets} onWidgetSelect={handleWidgetSelect} />
                </div>
              </SelectableWidget>
              <LeaderboardWidget season={resolveWidgetSeason('leaderboard')} selectedWidgets={selectedWidgets} pendingWidgetIds={pendingWidgetIds} handleWidgetSelect={handleWidgetSelect} resolvedHighlight={resolvedHighlight} setHighlightedPlayer={setHighlightedPlayer} chartMetric={chartMetric} leaderboardSort={leaderboardSort} leaderboardLimit={leaderboardLimit} onEdit={handleEditWidget} />
            </>
          )}

          {/* ── PLAYER-COMPARISON: leaderboard → player cards → bar chart ── */}
          {layout === 'player-comparison' && (
            <>
              <LeaderboardWidget season={resolveWidgetSeason('leaderboard')} selectedWidgets={selectedWidgets} pendingWidgetIds={pendingWidgetIds} handleWidgetSelect={handleWidgetSelect} resolvedHighlight={resolvedHighlight} setHighlightedPlayer={setHighlightedPlayer} chartMetric={chartMetric} leaderboardSort={leaderboardSort} leaderboardLimit={leaderboardLimit} onEdit={handleEditWidget} />
              <SelectableWidget id="player-cards" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={handleEditWidget}>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-3">Top Performers · {resolveWidgetSeason('player-cards').year}</h2>
                  <PlayerCards players={resolveWidgetSeason('player-cards').players} highlightedPlayer={resolvedHighlight} selectedWidgetIds={selectedWidgets} onWidgetSelect={handleWidgetSelect} />
                </div>
              </SelectableWidget>
              <SelectableWidget id="comparison-chart" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={handleEditWidget}>
                <ComparisonChart season={resolveWidgetSeason('comparison-chart')} metric={chartMetric} highlightedPlayer={resolvedHighlight} chartType={compChartType} accentColor={accentColor} title={widgetTitles['comparison-chart']} />
              </SelectableWidget>
            </>
          )}

          {/* ── TOP-SCORERS: stats → charts → player cards ── */}
          {layout === 'top-scorers' && (
            <>
              <SelectableWidget id="stats" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={handleEditWidget}>
                <StatsBar season={resolveWidgetSeason('stats')} />
              </SelectableWidget>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SelectableWidget id="trend-chart" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={handleEditWidget}>
                  <TrendChart seasons={resolveWidgetTeamData('trend-chart').seasons} metric={chartMetric} chartType={trendChartType} accentColor={accentColor} title={widgetTitles['trend-chart']} />
                </SelectableWidget>
                <SelectableWidget id="comparison-chart" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={handleEditWidget}>
                  <ComparisonChart season={resolveWidgetSeason('comparison-chart')} metric={chartMetric} highlightedPlayer={resolvedHighlight} chartType={compChartType} accentColor={accentColor} title={widgetTitles['comparison-chart']} />
                </SelectableWidget>
              </div>
              <SelectableWidget id="player-cards" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={handleEditWidget}>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wider mb-3">Top Performers · {resolveWidgetSeason('player-cards').year}</h2>
                  <PlayerCards players={resolveWidgetSeason('player-cards').players} highlightedPlayer={resolvedHighlight} selectedWidgetIds={selectedWidgets} onWidgetSelect={handleWidgetSelect} />
                </div>
              </SelectableWidget>
            </>
          )}

          <div className="h-4" />
        </div>
          </div>
        </LayoutContent>
      }
      end={
        !isPreview && chatOpen ? (
          <LayoutPanel width={384} hasDivider padding={0} isScrollable={false}>
            <div className="flex flex-col h-full">
              <TabList value={rightPaneTab} onChange={(v) => setRightPaneTab(v as RightPaneTab)} hasDivider size="sm">
                <Tab value="chat" label="Chat" />
                {manualEditWidgetId && (
                  <>
                    <Tab value="edit" label="Edit" />
                    <IconButton
                      icon={<Icon icon="close" size="sm" />}
                      label="Close edit tab"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setManualEditWidgetId(null); setRightPaneTab('chat'); }}
                    />
                  </>
                )}
              </TabList>

              <div className="flex-1 min-h-0" style={{ display: rightPaneTab === 'chat' ? 'block' : 'none' }}>
                <ChatPane
                  onCommand={handleCommand}
                  onClose={() => setChatOpen(false)}
                  chartMetric={chartMetric}
                  highlightedPlayer={resolvedHighlight}
                  selectedWidgets={widgetContexts}
                  onClearWidget={(id) => setSelectedWidgets(prev => prev.filter(w => w !== id))}
                  pendingEdits={pendingEdits}
                  onAcceptEdits={handleAcceptEdits}
                  onDiscardEdits={handleDiscardEdits}
                  emptyHeading={startWithCloneSuggestion ? 'Ready to update' : undefined}
                  emptySuggestions={startWithCloneSuggestion ? ['Update with current half data'] : undefined}
                />
              </div>

              {manualEditWidgetId && manualEditMeta && (
                <div className="flex-1 min-h-0" style={{ display: rightPaneTab === 'edit' ? 'block' : 'none' }}>
                  <ManualEditPane
                    widgetLabel={manualEditMeta.label}
                    titleValue={widgetTitles[manualEditWidgetId] ?? ''}
                    onTitleChange={handleManualTitleChange}
                    isChart={manualEditMeta.isChart}
                    chartType={manualEditChartType}
                    onChartTypeChange={handleManualChartTypeChange}
                    dataSourceValue={dataSourceValue}
                    dataSourceOptions={dataSourceOptions}
                    onDataSourceChange={handleDataSourceChange}
                  />
                </div>
              )}
            </div>
          </LayoutPanel>
        ) : undefined
      }
    />
  );
}

function LeaderboardWidget({ season, selectedWidgets, pendingWidgetIds, handleWidgetSelect, resolvedHighlight, setHighlightedPlayer, chartMetric, leaderboardSort, leaderboardLimit, onEdit }: {
  season: import('./types').Season;
  selectedWidgets: string[];
  pendingWidgetIds: string[];
  handleWidgetSelect: (id: string, shiftKey: boolean) => void;
  resolvedHighlight: string | null;
  setHighlightedPlayer: (v: string | null) => void;
  chartMetric: import('./types').ChartMetric;
  leaderboardSort: string;
  leaderboardLimit: number | null;
  onEdit?: (id: string) => void;
}) {
  return (
    <SelectableWidget id="leaderboard" selectedIds={selectedWidgets} pendingIds={pendingWidgetIds} onSelect={handleWidgetSelect} onEdit={onEdit}>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-slate-800 font-bold text-sm uppercase tracking-wider">Player Leaderboard</h2>
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
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0.5L9.8 6.2L15.5 8L9.8 9.8L8 15.5L6.2 9.8L0.5 8L6.2 6.2L8 0.5Z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
