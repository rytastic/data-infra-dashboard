'use client';

import ReactECharts from 'echarts-for-react';
import type { Season, ChartMetric } from './types';
import { METRIC_LABELS, METRIC_SHORT } from './types';

interface Props {
  seasons: Season[];
  metric: ChartMetric;
}

const PALETTE = ['#31A24C', '#F02849', '#FFAD0F', '#8A3FC7', '#0866FF'];

export default function TrendChart({ seasons, metric }: Props) {
  const primaryColor = '#3b82f6';

  // Build top-5 players by their peak value of the metric
  const allNames = Array.from(new Set(seasons.flatMap(s => s.players.map(p => p.name))));
  const topPlayers = allNames
    .map(name => ({
      name,
      max: Math.max(...seasons.flatMap(s => s.players.filter(p => p.name === name).map(p => p[metric]))),
    }))
    .sort((a, b) => b.max - a.max)
    .slice(0, 5)
    .map(p => p.name);

  const xAxis = seasons.map(s => s.year);

  const series = topPlayers.map((name, i) => ({
    name,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { width: i === 0 ? 2.5 : 1.5 },
    itemStyle: { color: i === 0 ? primaryColor : PALETTE[i] },
    data: seasons.map(s => {
      const p = s.players.find(pl => pl.name === name);
      return p ? +p[metric].toFixed(1) : null;
    }),
    connectNulls: true,
  }));

  // Shorten "First Last" → "First L." for compact legend labels
  const shortName = (name: string) => {
    const parts = name.trim().split(' ');
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : name;
  };

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 16, right: 16, bottom: 60, left: 40, containLabel: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1C1E21',
      borderColor: '#3A3B3C',
      borderWidth: 1,
      textStyle: { color: '#E4E6EB', fontSize: 12 },
      axisPointer: { lineStyle: { color: '#E4E6EB', opacity: 0.3 } },
      // Show full name in axis tooltip
      formatter: (params: { seriesName: string; value: number; axisValue: string }[]) => {
        if (!params?.length) return '';
        const header = `<div style="margin-bottom:4px;font-size:11px;color:#9ca3af">${params[0].axisValue}</div>`;
        const rows = params
          .map(p => `<div style="display:flex;justify-content:space-between;gap:16px"><span>${p.seriesName}</span><span style="font-weight:600">${p.value}</span></div>`)
          .join('');
        return header + rows;
      },
    },
    legend: {
      // Scrollable single-row legend — shows ‹ › navigation when names overflow
      type: 'scroll',
      bottom: 4,
      textStyle: { color: '#65676B', fontSize: 11 },
      itemWidth: 14,
      itemHeight: 3,
      icon: 'roundRect',
      pageIconColor: '#94a3b8',
      pageIconInactiveColor: '#e2e8f0',
      pageTextStyle: { color: '#94a3b8', fontSize: 11 },
      // Truncate to "First L." in the label; full name shows in axis tooltip
      formatter: shortName,
      tooltip: {
        show: true,
        // Full name on hover over legend swatch
        formatter: (params: { name: string }) => params.name,
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        textStyle: { color: '#e2e8f0', fontSize: 12 },
        padding: [6, 10],
      },
    },
    xAxis: {
      type: 'category',
      data: xAxis,
      axisLine: { lineStyle: { color: '#E4E6EB' } },
      axisTick: { show: false },
      axisLabel: { color: '#65676B', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#F0F2F5', type: 'solid' } },
      axisLabel: { color: '#65676B', fontSize: 11 },
    },
    series,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-foreground font-semibold text-sm">Season Trend</h3>
          <p className="text-muted-foreground text-xs mt-0.5">
            {METRIC_LABELS[metric]} — Top 5 players over 5 seasons
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
          {METRIC_SHORT[metric]}
        </span>
      </div>
      <ReactECharts option={option} style={{ height: 280 }} notMerge />
    </div>
  );
}
