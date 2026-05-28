'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Season, ChartMetric } from './types';
import { METRIC_LABELS } from './types';

interface Props {
  seasons: Season[];
  metric: ChartMetric;
  accentColor: 'cardinal' | 'gold';
}

const COLORS = ['#C8102E', '#F1BE48', '#60a5fa', '#34d399', '#a78bfa'];

export default function TrendChart({ seasons, metric, accentColor }: Props) {
  // Build per-player series across seasons
  // Get the union of all player names
  const allPlayers = Array.from(
    new Set(seasons.flatMap(s => s.players.map(p => p.name)))
  );

  // For season-over-season chart, show top 5 players by their max value of the metric
  const playerMaxes = allPlayers.map(name => {
    const vals = seasons.flatMap(s =>
      s.players.filter(p => p.name === name).map(p => p[metric])
    );
    return { name, max: Math.max(...vals, 0) };
  });
  const topPlayers = playerMaxes
    .sort((a, b) => b.max - a.max)
    .slice(0, 5)
    .map(p => p.name);

  const data = seasons.map(s => {
    const row: Record<string, string | number> = { season: s.year };
    topPlayers.forEach(name => {
      const p = s.players.find(pl => pl.name === name);
      row[name] = p ? +p[metric].toFixed(1) : 0;
    });
    return row;
  });

  const primaryColor = accentColor === 'cardinal' ? '#C8102E' : '#F1BE48';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-slate-800 font-semibold text-sm">Season Trend</h3>
          <p className="text-slate-400 text-xs mt-0.5">{METRIC_LABELS[metric]} — Top 5 players over 5 seasons</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-lg">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: primaryColor }} />
          <span className="text-slate-600 text-xs font-medium">{METRIC_LABELS[metric]}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 16, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="season"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '10px',
              color: '#e2e8f0',
              fontSize: 12,
            }}
            labelStyle={{ color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 12 }}
          />
          {topPlayers.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={i === 0 ? primaryColor : COLORS[i]}
              strokeWidth={i === 0 ? 2.5 : 1.5}
              dot={{ r: 3, fill: i === 0 ? primaryColor : COLORS[i] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
