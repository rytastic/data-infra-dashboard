'use client';

import ReactECharts from 'echarts-for-react';
import type { Season, ChartMetric } from './types';
import { METRIC_LABELS, METRIC_SHORT } from './types';

type ChartType = 'bar' | 'line';

interface Props {
  season: Season;
  metric: ChartMetric;
  highlightedPlayer: string | null;
  chartType?: ChartType;
  accentColor?: string;
  title?: string;
}

export default function ComparisonChart({
  season,
  metric,
  highlightedPlayer,
  chartType = 'bar',
  accentColor = '#3b82f6',
  title,
}: Props) {
  const dimColor = '#cbd5e1';

  const data = [...season.players]
    .sort((a, b) => b[metric] - a[metric])
    .map(p => ({
      name: p.name.split(' ').pop() ?? p.name,
      fullName: p.name,
      value: +p[metric].toFixed(1),
    }));

  const seriesData = data.map(d => {
    const isHl = highlightedPlayer !== null &&
      d.fullName.toLowerCase().includes(highlightedPlayer.toLowerCase());
    return {
      value: d.value,
      itemStyle: {
        color: isHl ? accentColor : (chartType === 'line' ? accentColor : dimColor),
        opacity: highlightedPlayer && !isHl ? 0.45 : 1,
        ...(chartType === 'bar' ? { borderRadius: [4, 4, 0, 0] } : {}),
      },
    };
  });

  const seriesBase = {
    data: seriesData,
    barMaxWidth: 40,
  };

  const series =
    chartType === 'line'
      ? [{
          ...seriesBase,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: { width: 2.5, color: accentColor },
          areaStyle: { color: accentColor, opacity: 0.07 },
        }]
      : [{ ...seriesBase, type: 'bar' }];

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 8, right: 16, bottom: 56, left: 40, containLabel: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      axisPointer: { type: 'none' },
      formatter: (params: { name: string; value: number }[]) => {
        const p = params[0];
        const full = data.find(d => d.name === p.name)?.fullName ?? p.name;
        return `${full}<br/><b>${p.value} ${METRIC_SHORT[metric]}</b>`;
      },
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10, rotate: -35, interval: 0 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-slate-800 font-semibold text-sm">{title ?? 'Player Comparison'}</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {season.year} · {METRIC_LABELS[metric]}
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-600">
          {METRIC_SHORT[metric]}
        </span>
      </div>
      <ReactECharts option={option} style={{ height: 260 }} notMerge />
    </div>
  );
}
