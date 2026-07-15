'use client';

import { Card } from '@astryxdesign/core/Card';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge } from '@astryxdesign/core/Badge';
import type { Player } from './types';
import SelectableWidget from './SelectableWidget';

interface Props {
  players: Player[];
  highlightedPlayer: string | null;
  selectedWidgetIds?: string[];
  onWidgetSelect?: (id: string, shiftKey: boolean) => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function PlayerCards({ players, highlightedPlayer, selectedWidgetIds = [], onWidgetSelect }: Props) {
  const top3 = [...players].sort((a, b) => b.ppg - a.ppg).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {top3.map((player, i) => {
        const isHighlighted = highlightedPlayer !== null && player.name.toLowerCase().includes(highlightedPlayer.toLowerCase());
        const widgetId = `player-${player.name.replace(/\s+/g, '-').toLowerCase()}`;

        return (
          <SelectableWidget key={player.name} id={widgetId} selectedIds={selectedWidgetIds} onSelect={(id, shiftKey) => onWidgetSelect?.(id, shiftKey)}>
            <Card padding={5}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={player.name} size="medium" />
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
                <div className="mt-3 flex justify-center">
                  <Badge label="Highlighted" variant="info" />
                </div>
              )}
            </Card>
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
