'use client';

import { Card } from '@astryxdesign/core/Card';
import type { Season } from './types';

interface Props {
  season: Season;
  conference?: string;
}

export default function StatsBar({ season, conference }: Props) {
  const topScorer = [...season.players].sort((a, b) => b.ppg - a.ppg)[0];
  const topRebounder = [...season.players].sort((a, b) => b.rpg - a.rpg)[0];
  const topAssister = [...season.players].sort((a, b) => b.apg - a.apg)[0];
  const [wins, losses] = season.record.split('-').map(Number);
  const winPct = ((wins / (wins + losses)) * 100).toFixed(0);

  const stats = [
    { label: 'Team Record', value: season.record, sub: `${winPct}% win rate` },
    { label: 'Avg Points', value: season.avgPoints.toFixed(1), sub: 'per game' },
    { label: 'Conf. Rank', value: `#${season.conferenceRank}`, sub: conference ?? '—' },
    { label: 'Top Scorer', value: topScorer?.ppg.toFixed(1) ?? '—', sub: topScorer?.name ?? '—' },
    { label: 'Top Rebounder', value: topRebounder?.rpg.toFixed(1) ?? '—', sub: topRebounder?.name ?? '—' },
    { label: 'Top Assists', value: topAssister?.apg.toFixed(1) ?? '—', sub: topAssister?.name ?? '—' },
  ];

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s) => (
        <Card key={s.label} padding={4}>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">{s.label}</p>
          <p className="text-2xl font-bold leading-none mb-1 text-slate-900">{s.value}</p>
          <p className="text-slate-400 text-xs truncate">{s.sub}</p>
        </Card>
      ))}
    </div>
  );
}
