export interface Player {
  name: string;
  position: string;
  games: number;
  mpg: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
}

export interface Season {
  year: string;
  record: string;
  conferenceRank: number;
  avgPoints: number;
  players: Player[];
}

export interface CyclonesData {
  team: string;
  sport: string;
  seasons: Season[];
}

export type ChartMetric = 'ppg' | 'rpg' | 'apg' | 'spg';

export type EditPreviewType = 'chart-type' | 'color' | 'metric' | 'sort' | 'limit' | 'title' | 'highlight' | 'season';

export interface PendingEdit {
  id: string;
  description: string;
  previewType: EditPreviewType;
  before: string;
  after: string;
  affectedWidgetIds: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previewOptions?: { before: Record<string, any>; after: Record<string, any> };
  // Applies (true) or reverts (false) just this edit's live effect. Lets the
  // review card's checkmarks stage/unstage individual edits before Accept.
  onToggle?: (checked: boolean) => void;
}

export interface EditableDashboardState {
  selectedYear: string;
  trendChartType: 'line' | 'bar';
  compChartType: 'bar' | 'line';
  chartMetric: ChartMetric;
  leaderboardSort: string;
  leaderboardLimit: number | null;
  accentColor: string;
  widgetTitles: Record<string, string>;
  highlightedPlayer: string | null;
  widgetDataOverrides: Record<string, { teamId: string; year?: string }>;
}

export interface DashboardVersion {
  label: string;
  changes: string[];
  state: EditableDashboardState;
}

export const METRIC_LABELS: Record<ChartMetric, string> = {
  ppg: 'Points Per Game',
  rpg: 'Rebounds Per Game',
  apg: 'Assists Per Game',
  spg: 'Steals Per Game',
};

export const METRIC_SHORT: Record<ChartMetric, string> = {
  ppg: 'PPG',
  rpg: 'RPG',
  apg: 'APG',
  spg: 'SPG',
};
