'use client';

import type { Player } from './types';
import SelectableWidget from './SelectableWidget';

interface Props {
  players: Player[];
  highlightedPlayer: string | null;
  selectedWidgetId?: string | null;
  onWidgetSelect?: (id: string) => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function PlayerCards({ players, highlightedPlayer, selectedWidgetId, onWidgetSelect }: Props) {
  const top3 = [...players].sort((a, b) => b.ppg - a.ppg).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {top3.map((player, i) => {
        const isHighlighted = highlightedPlayer !== null &&
          player.name.toLowerCase().includes(highlightedPlayer.toLowerCase());
        const widgetId = `player-${player.name.replace(/\s+/g, '-').toLowerCase()}`;

        return (
          <SelectableWidget
            key={player.name}
            id={widgetId}
            selectedId={selectedWidgetId ?? null}
            onSelect={(id) => onWidgetSelect?.(id)}
          >
          <div
            className="rounded-xl border bg-white border-slate-200 p-5 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold bg-slate-100 text-slate-600">
                  {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">{player.name}</p>
                  <p className="text-slate-400 text-xs">{player.position} · {player.games}G played</p>
                </div>
              </div>
              <span className="text-xl">{MEDALS[i]}</span>
            </div>

            {/* Primary stat */}
            <div className="text-center py-3 mb-4 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-3xl font-black text-slate-800">{player.ppg.toFixed(1)}</p>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Points per game</p>
            </div>

            {/* Secondary stats grid */}
            <div className="grid grid-cols-3 gap-2">
              <StatPill label="REB" value={player.rpg.toFixed(1)} />
              <StatPill label="AST" value={player.apg.toFixed(1)} />
              <StatPill label="STL" value={player.spg.toFixed(1)} />
              <StatPill label="FG%" value={`${player.fgPct.toFixed(0)}%`} />
              <StatPill label="3P%" value={player.threePct > 0 ? `${player.threePct.toFixed(0)}%` : '—'} />
              <StatPill label="MPG" value={player.mpg.toFixed(0)} />
            </div>

            {isHighlighted && (
              <div className="mt-3 text-center text-xs font-semibold py-1.5 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6]">
                ★ Highlighted
              </div>
            )}
          </div>
          </SelectableWidget>
        );
      })}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-2 text-center">
      <p className="text-slate-700 text-xs font-bold">{value}</p>
      <p className="text-slate-400 text-[10px] uppercase tracking-wide">{label}</p>
    </div>
  );
}
