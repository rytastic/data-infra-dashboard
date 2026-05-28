'use client';

import type { Player } from './types';

interface Props {
  players: Player[];
  accentColor: 'cardinal' | 'gold';
  highlightedPlayer: string | null;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function PlayerCards({ players, accentColor, highlightedPlayer }: Props) {
  const top3 = [...players].sort((a, b) => b.ppg - a.ppg).slice(0, 3);
  const accentGrad = accentColor === 'cardinal'
    ? 'from-cardinal/20 to-cardinal/5 border-cardinal/30'
    : 'from-gold/20 to-gold/5 border-gold/30';
  const accentText = accentColor === 'cardinal' ? 'text-cardinal' : 'text-gold';
  const accentBadge = accentColor === 'cardinal'
    ? 'bg-cardinal text-white'
    : 'bg-gold text-slate-900';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {top3.map((player, i) => {
        const isHighlighted = highlightedPlayer !== null &&
          player.name.toLowerCase().includes(highlightedPlayer.toLowerCase());

        return (
          <div
            key={player.name}
            className={`rounded-xl border p-5 transition-all duration-300 ${
              isHighlighted || i === 0
                ? `bg-gradient-to-br ${accentGrad} shadow-md`
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold ${
                  i === 0 ? accentBadge : 'bg-slate-100 text-slate-600'
                }`}>
                  {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className={`font-bold text-sm ${isHighlighted || i === 0 ? accentText : 'text-slate-800'}`}>
                    {player.name}
                  </p>
                  <p className="text-slate-400 text-xs">{player.position} · {player.games}G played</p>
                </div>
              </div>
              <span className="text-xl">{MEDALS[i]}</span>
            </div>

            {/* Primary stat */}
            <div className="text-center py-3 mb-4 rounded-lg bg-white/60 border border-white/40">
              <p className={`text-3xl font-black ${i === 0 ? accentText : 'text-slate-800'}`}>
                {player.ppg.toFixed(1)}
              </p>
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
              <div className={`mt-3 text-center text-xs font-semibold py-1.5 rounded-lg ${
                accentColor === 'cardinal' ? 'bg-cardinal/20 text-cardinal' : 'bg-gold/20 text-gold-dark'
              }`}>
                ★ Highlighted
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/50 rounded-lg p-2 text-center">
      <p className="text-slate-700 text-xs font-bold">{value}</p>
      <p className="text-slate-400 text-[10px] uppercase tracking-wide">{label}</p>
    </div>
  );
}
