'use client';

import ReactECharts from 'echarts-for-react';
import type { Season, ChartMetric } from './types';
import { METRIC_LABELS } from './types';

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

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 16, right: 16, bottom: 48, left: 40, containLabel: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1C1E21',
      borderColor: '#3A3B3C',
      borderWidth: 1,
      textStyle: { color: '#E4E6EB', fontSize: 12 },
      axisPointer: { lineStyle: { color: '#E4E6EB', opacity: 0.3 } },
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#65676B', fontSize: 11 },
      itemWidth: 14,
      itemHeight: 3,
      icon: 'roundRect',
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
        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-accent text-primary">
          {METRIC_LABELS[metric]}
        </span>
      </div>
      <ReactECharts option={option} style={{ height: 260 }} notMerge />
    </div>
  );
}
