'use client';

import { useState, useEffect } from 'react';
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';

const BREAKDOWNS = [
  {
    id: 'b1',
    title: 'Player by player comparison per game',
    subtitle: 'Side-by-side stats for every player across selected games',
    widgets: 60,
    thumbnail: 'comparison',
  },
  {
    id: 'b2',
    title: 'Season overview',
    subtitle: 'Key team metrics, win/loss record, and season highlights',
    widgets: 20,
    thumbnail: 'overview',
  },
  {
    id: 'b3',
    title: '5 top scorers stats across all games',
    subtitle: 'Points, assists, and rebounds for the leading scorers',
    widgets: 30,
    defaultSelected: true,
    thumbnail: 'scorers',
  },
];

function ThumbnailComparison() {
  return (
    <svg viewBox="0 0 88 62" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Header row */}
      <rect x="0" y="0" width="88" height="62" rx="6" fill="#f1f5f9"/>
      <rect x="4" y="5" width="80" height="11" rx="3" fill="#e2e8f0"/>
      <rect x="8" y="8" width="18" height="5" rx="1" fill="#94a3b8"/>
      <rect x="42" y="8" width="12" height="5" rx="1" fill="#3b82f6" fillOpacity="0.6"/>
      <rect x="60" y="8" width="12" height="5" rx="1" fill="#3b82f6" fillOpacity="0.4"/>
      {/* Row 1 */}
      <rect x="8" y="20" width="16" height="4" rx="1" fill="#94a3b8"/>
      <rect x="42" y="20" width="16" height="4" rx="1" fill="#3b82f6" fillOpacity="0.8"/>
      <rect x="60" y="20" width="10" height="4" rx="1" fill="#3b82f6" fillOpacity="0.5"/>
      {/* Row 2 */}
      <rect x="8" y="29" width="20" height="4" rx="1" fill="#94a3b8"/>
      <rect x="42" y="29" width="10" height="4" rx="1" fill="#3b82f6" fillOpacity="0.6"/>
      <rect x="60" y="29" width="18" height="4" rx="1" fill="#3b82f6" fillOpacity="0.7"/>
      {/* Row 3 */}
      <rect x="8" y="38" width="14" height="4" rx="1" fill="#94a3b8"/>
      <rect x="42" y="38" width="20" height="4" rx="1" fill="#3b82f6" fillOpacity="0.9"/>
      <rect x="60" y="38" width="8" height="4" rx="1" fill="#3b82f6" fillOpacity="0.4"/>
      {/* Row 4 */}
      <rect x="8" y="47" width="18" height="4" rx="1" fill="#94a3b8"/>
      <rect x="42" y="47" width="14" height="4" rx="1" fill="#3b82f6" fillOpacity="0.7"/>
      <rect x="60" y="47" width="14" height="4" rx="1" fill="#3b82f6" fillOpacity="0.6"/>
      {/* Divider lines */}
      <line x1="37" y1="5" x2="37" y2="57" stroke="#e2e8f0" strokeWidth="0.5"/>
      <line x1="56" y1="5" x2="56" y2="57" stroke="#e2e8f0" strokeWidth="0.5"/>
    </svg>
  );
}

function ThumbnailOverview() {
  return (
    <svg viewBox="0 0 88 62" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="88" height="62" rx="6" fill="#f1f5f9"/>
      {/* 3 stat cards */}
      <rect x="4" y="4" width="24" height="20" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="0.75"/>
      <rect x="8" y="8" width="10" height="3" rx="1" fill="#94a3b8"/>
      <rect x="8" y="14" width="16" height="6" rx="1" fill="#3b82f6" fillOpacity="0.7"/>

      <rect x="32" y="4" width="24" height="20" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="0.75"/>
      <rect x="36" y="8" width="10" height="3" rx="1" fill="#94a3b8"/>
      <rect x="36" y="14" width="14" height="6" rx="1" fill="#10b981" fillOpacity="0.7"/>

      <rect x="60" y="4" width="24" height="20" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="0.75"/>
      <rect x="64" y="8" width="10" height="3" rx="1" fill="#94a3b8"/>
      <rect x="64" y="14" width="12" height="6" rx="1" fill="#f59e0b" fillOpacity="0.8"/>

      {/* Line chart area */}
      <rect x="4" y="28" width="80" height="30" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="0.75"/>
      {/* Grid lines */}
      <line x1="4" y1="42" x2="84" y2="42" stroke="#f1f5f9" strokeWidth="0.75"/>
      {/* Primary line */}
      <polyline
        points="10,52 22,46 34,49 46,41 58,43 70,38 82,35"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Secondary dashed line */}
      <polyline
        points="10,55 22,54 34,56 46,52 58,54 70,52 82,50"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThumbnailScorers() {
  const bars = [
    { w: 62, label: 12 },
    { w: 50, label: 10 },
    { w: 40, label: 8 },
    { w: 30, label: 6 },
    { w: 20, label: 4 },
  ];
  return (
    <svg viewBox="0 0 88 62" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="88" height="62" rx="6" fill="#f1f5f9"/>
      {bars.map((bar, i) => {
        const y = 5 + i * 11;
        const opacity = 0.95 - i * 0.15;
        return (
          <g key={i}>
            <rect x="2" y={y + 1} width="10" height="7" rx="1" fill="#cbd5e1"/>
            <rect x="14" y={y} width={bar.w} height="9" rx="2.5" fill="#3b82f6" fillOpacity={opacity}/>
            <rect x={14 + bar.w + 2} y={y + 2} width="8" height="5" rx="1" fill="#94a3b8"/>
          </g>
        );
      })}
    </svg>
  );
}

const THUMBNAIL_MAP: Record<string, React.FC> = {
  comparison: ThumbnailComparison,
  overview: ThumbnailOverview,
  scorers: ThumbnailScorers,
};

interface Props {
  onSubmit: (breakdownId: string) => void;
  onBack?: () => void;
  onSelectionChange?: (title: string) => void;
}

export default function StepBreakdown({ onSubmit, onBack, onSelectionChange }: Props) {
  const [selected, setSelected] = useState<string>(
    BREAKDOWNS.find((b) => b.defaultSelected)?.id ?? BREAKDOWNS[0].id
  );

  useEffect(() => {
    const title = BREAKDOWNS.find(b => b.id === selected)?.title ?? '';
    onSelectionChange?.(title);
  }, [selected, onSelectionChange]);

  return (
    <div className="w-full max-w-[600px] animate-fade-up">
      <div className="bg-white overflow-hidden">
        <div className="px-6 pt-5 pb-2">
          <h2 className="text-base font-semibold text-foreground tracking-[0.1px]">Dimension breakdowns</h2>
        </div>

        <div className="px-6 py-4">
          <RadioList label="Dimension breakdowns" isLabelHidden value={selected} onChange={setSelected}>
            {BREAKDOWNS.map((b) => {
              const Thumb = THUMBNAIL_MAP[b.thumbnail];
              return (
                <RadioListItem
                  key={b.id}
                  value={b.id}
                  label={b.title}
                  description={b.subtitle}
                  startContent={
                    <div className="flex-shrink-0 rounded-xl overflow-hidden ml-3" style={{ width: 88, height: 62 }}>
                      <Thumb />
                    </div>
                  }
                  endContent={
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {b.widgets} widgets
                    </span>
                  }
                />
              );
            })}
          </RadioList>
        </div>

        <div className="px-6 py-2.5" style={{ borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
