'use client';

import ReactECharts from 'echarts-for-react';
import type { Season, ChartMetric } from './types';
import { METRIC_LABELS } from './types';

type ChartType = 'line' | 'bar';

interface Props {
  seasons: Season[];
  metric: ChartMetric;
  chartType?: ChartType;
  accentColor?: string;
  title?: string;
}

const PALETTE = ['#31A24C', '#F02849', '#FFAD0F', '#8A3FC7', '#0866FF'];

export default function TrendChart({
  seasons,
  metric,
  chartType = 'line',
  accentColor = '#3b82f6',
  title,
}: Props) {
  const allNames = Array.from(new Set(seasons.flatMap(s => s.players.map(p => p.name))));
  const topPlayers = allNames
    .map(name => ({
      name,
      max: Math.max(...seasons.flatMap(s => s.players.filter(p => p.name === name).map(p => p[metric]))),
    }))
    .sort((a, b) => b.max - a.max)
    .slice(0, 5)
    .map(p => p.name);

  const series = topPlayers.map((name, i) => {
    const color = i === 0 ? accentColor : PALETTE[i];
    const base = {
      name,
      type: chartType,
      itemStyle: { color },
      data: seasons.map(s => {
        const p = s.players.find(pl => pl.name === name);
        return p ? +p[metric].toFixed(1) : null;
      }),
      connectNulls: true,
    };
    if (chartType === 'line') {
      return { ...base, smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width: i === 0 ? 2.5 : 1.5, color } };
    }
    return { ...base, barMaxWidth: 18, itemStyle: { color, borderRadius: [3, 3, 0, 0] } };
  });

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
      type: 'scroll',
      bottom: 4,
      textStyle: { color: '#65676B', fontSize: 11 },
      itemWidth: 14,
      itemHeight: 3,
      icon: 'roundRect',
      pageIconColor: '#94a3b8',
      pageIconInactiveColor: '#e2e8f0',
      pageTextStyle: { color: '#94a3b8', fontSize: 11 },
      formatter: shortName,
      tooltip: {
        show: true,
        formatter: (params: { name: string }) => params.name,
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        textStyle: { color: '#e2e8f0', fontSize: 12 },
        padding: [6, 10],
      },
    },
    xAxis: {
      type: 'category',
      data: seasons.map(s => s.year),
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
    <div className="bg-white border border-slate-200 rounded-xl p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-foreground font-semibold text-sm">{title ?? 'Season Trend'}</h3>
          <p className="text-muted-foreground text-xs mt-0.5">
            {METRIC_LABELS[metric]} — Top 5 players over 5 seasons
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-600">
          {METRIC_LABELS[metric]}
        </span>
      </div>
      <ReactECharts option={option} style={{ height: 280 }} notMerge />
    </div>
  );
}
