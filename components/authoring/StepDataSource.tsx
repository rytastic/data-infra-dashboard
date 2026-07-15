'use client';

import { useState, useRef } from 'react';
import { CheckboxList, CheckboxListItem } from '@astryxdesign/core/CheckboxList';

const ALL_SOURCES = [
  { id: 's1',  title: 'Cyclone basketball 2020-21',         subtitle: 'Men + Women full season with roster',       chipLabel: 'Cyclone basketball 2020-21' },
  { id: 's2',  title: 'Cyclone basketball 2022-23',         subtitle: 'Men + Women full season with roster',       chipLabel: 'Cyclone basketball 2022-23' },
  { id: 's3',  title: 'Kansas basketball 2024-25',          subtitle: 'Roster only',                               chipLabel: 'Kansas basketball 2024-25' },
  { id: 's4',  title: 'Cyclone basketball 2022-23',         subtitle: 'Non-conference opponents',                  chipLabel: 'Cyclone basketball (non-con) 2022-23' },
  { id: 's5',  title: 'Duke Blue Devils 2023-24',           subtitle: 'Full season with roster and play-by-play',  chipLabel: 'Duke basketball 2023-24' },
  { id: 's6',  title: 'Kentucky Wildcats 2023-24',          subtitle: 'Full season with roster',                   chipLabel: 'Kentucky basketball 2023-24' },
  { id: 's7',  title: 'North Carolina Tar Heels 2022-23',   subtitle: 'Full season stats',                         chipLabel: 'UNC basketball 2022-23' },
  { id: 's8',  title: 'Gonzaga Bulldogs 2023-24',           subtitle: 'Full season with roster',                   chipLabel: 'Gonzaga basketball 2023-24' },
  { id: 's9',  title: 'Houston Cougars 2023-24',            subtitle: 'Conference games only',                     chipLabel: 'Houston basketball 2023-24' },
  { id: 's10', title: 'Kansas Jayhawks 2023-24',            subtitle: 'Full season with roster',                   chipLabel: 'Kansas basketball 2023-24' },
  { id: 's11', title: 'Baylor Bears 2023-24',               subtitle: 'Full season stats',                         chipLabel: 'Baylor basketball 2023-24' },
  { id: 's12', title: 'TCU Horned Frogs 2023-24',           subtitle: 'Full season with roster',                   chipLabel: 'TCU basketball 2023-24' },
  { id: 's13', title: 'Arizona Wildcats 2022-23',           subtitle: 'Full season with roster',                   chipLabel: 'Arizona basketball 2022-23' },
  { id: 's14', title: 'Purdue Boilermakers 2023-24',        subtitle: 'Full season with roster',                   chipLabel: 'Purdue basketball 2023-24' },
  { id: 's15', title: 'Tennessee Volunteers 2023-24',       subtitle: 'Full season stats',                         chipLabel: 'Tennessee basketball 2023-24' },
  { id: 's16', title: 'Connecticut Huskies 2023-24',        subtitle: 'Championship season with full roster',      chipLabel: 'UConn basketball 2023-24' },
  { id: 's17', title: 'Alabama Crimson Tide 2023-24',       subtitle: 'Full season with roster',                   chipLabel: 'Alabama basketball 2023-24' },
  { id: 's18', title: 'Marquette Golden Eagles 2023-24',    subtitle: 'Full season stats',                         chipLabel: 'Marquette basketball 2023-24' },
  { id: 's19', title: 'Creighton Bluejays 2023-24',         subtitle: 'Full season with roster',                   chipLabel: 'Creighton basketball 2023-24' },
  { id: 's20', title: 'UCLA Bruins 2022-23',                subtitle: 'Full season with roster',                   chipLabel: 'UCLA basketball 2022-23' },
  { id: 's21', title: 'Indiana Hoosiers 2022-23',           subtitle: 'Full season stats',                         chipLabel: 'Indiana basketball 2022-23' },
  { id: 's22', title: 'Michigan Wolverines 2023-24',        subtitle: 'Full season with play-by-play',             chipLabel: 'Michigan basketball 2023-24' },
  { id: 's23', title: 'San Diego State 2022-23',            subtitle: 'Final Four run, full season',               chipLabel: 'SDSU basketball 2022-23' },
  { id: 's24', title: 'Iowa State basketball 2021-22',      subtitle: 'Full season with roster',                   chipLabel: 'Iowa State basketball 2021-22' },
  { id: 's25', title: 'Texas Tech Red Raiders 2023-24',     subtitle: 'Full season with roster',                   chipLabel: 'Texas Tech basketball 2023-24' },
  { id: 's26', title: 'Big 12 Conference 2023-24',          subtitle: 'All teams combined stats',                  chipLabel: 'Big 12 2023-24' },
  { id: 's27', title: 'NCAA Tournament 2024',               subtitle: 'All 68 tournament teams',                   chipLabel: 'NCAA Tournament 2024' },
  { id: 's28', title: 'Villanova Wildcats 2022-23',         subtitle: 'Full season with roster',                   chipLabel: 'Villanova basketball 2022-23' },
  { id: 's29', title: 'Florida Atlantic Owls 2022-23',      subtitle: 'Cinderella Final Four run',                 chipLabel: 'FAU basketball 2022-23' },
  { id: 's30', title: 'Arkansas Razorbacks 2022-23',        subtitle: 'Full season stats',                         chipLabel: 'Arkansas basketball 2022-23' },
];

interface SelectedSource { id: string; label: string }

interface Props {
  selectedIds?: string[];
  onToggle?: (source: SelectedSource) => void;
}

export default function StepDataSource({ selectedIds = [], onToggle }: Props) {
  const [showChip, setShowChip] = useState(true);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (values: string[]) => {
    const selectedSet = new Set(selectedIds);
    const nextSet = new Set(values);
    const changedId = values.find(id => !selectedSet.has(id)) ?? selectedIds.find(id => !nextSet.has(id));
    const source = changedId ? ALL_SOURCES.find(s => s.id === changedId) : undefined;
    if (source) onToggle?.({ id: source.id, label: source.chipLabel });
  };

  const visibleSources = query.trim()
    ? ALL_SOURCES.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_SOURCES;

  return (
    <div className="w-full max-w-[600px] animate-fade-up">
      <div className="bg-white overflow-hidden">
        {/* Search bar */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 mx-4 mt-4 mb-1 rounded-xl"
          style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
        >
          {showChip && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium flex-shrink-0"
              style={{
                padding: '4px 8px 4px 10px',
                borderRadius: 9999,
                background: '#334155',
                color: 'white',
              }}
            >
              Suggested data sources
              <button
                onClick={() => { setShowChip(false); inputRef.current?.focus(); }}
                className="opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Remove filter"
              >
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M3 3l6 6M9 3l-6 6"/>
                </svg>
              </button>
            </span>
          )}

          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for data sources"
            className="flex-1 bg-transparent text-sm outline-none min-w-0 text-slate-500"
          />

          <svg
            className="w-4 h-4 flex-shrink-0 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="7"/>
            <path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto" style={{ maxHeight: 240 }}>
          {visibleSources.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-slate-400">
              No data sources match &ldquo;{query}&rdquo;
            </p>
          ) : (
            <CheckboxList
              label="Data sources"
              isLabelHidden
              value={selectedIds}
              onChange={handleChange}
              hasDividers
            >
              {visibleSources.map(source => (
                <CheckboxListItem
                  key={source.id}
                  value={source.id}
                  label={source.title}
                  description={source.subtitle}
                />
              ))}
            </CheckboxList>
          )}
        </div>
      </div>
    </div>
  );
}
