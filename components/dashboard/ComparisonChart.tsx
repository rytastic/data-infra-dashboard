'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Season, ChartMetric } from './types';
import { METRIC_LABELS, METRIC_SHORT } from './types';

interface Props {
  season: Season;
  metric: ChartMetric;
  accentColor: 'cardinal' | 'gold';
  highlightedPlayer: string | null;
}

export default function ComparisonChart({ season, metric, accentColor, highlightedPlayer }: Props) {
  const primaryColor = accentColor === 'cardinal' ? '#C8102E' : '#F1BE48';
  const dimColor = '#cbd5e1';

  const data = [...season.players]
    .sort((a, b) => b[metric] - a[metric])
    .map(p => ({
      name: p.name.split(' ').pop() ?? p.name,
      fullName: p.name,
      value: +p[metric].toFixed(1),
    }));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-slate-800 font-semibold text-sm">Player Comparison</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {season.year} · {METRIC_LABELS[metric]}
          </p>
        </div>
        <div className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-600">
          {METRIC_SHORT[metric]}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 16, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '10px',
              color: '#e2e8f0',
              fontSize: 12,
            }}
            formatter={(value, _name, props) => [
              `${value ?? 0} ${METRIC_SHORT[metric]}`,
              (props as { payload?: { fullName?: string } }).payload?.fullName ?? '',
            ]}
            labelFormatter={() => ''}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry) => {
              const isHl = highlightedPlayer !== null &&
                entry.fullName.toLowerCase().includes(highlightedPlayer.toLowerCase());
              return (
                <Cell
                  key={entry.fullName}
                  fill={isHl ? primaryColor : dimColor}
                  opacity={highlightedPlayer && !isHl ? 0.5 : 1}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
