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
