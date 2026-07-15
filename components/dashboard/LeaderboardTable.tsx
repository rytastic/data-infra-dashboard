'use client';

import { useState, useEffect } from 'react';
import { Table, useTableSortable, proportional, pixel, type TableColumn } from '@astryxdesign/core/Table';
import type { Player, ChartMetric } from './types';

type SortKey = 'name' | 'ppg' | 'rpg' | 'apg' | 'spg' | 'bpg' | 'fgPct' | 'threePct' | 'ftPct' | 'mpg';

interface Props {
  players: Player[];
  highlightedPlayer: string | null;
  chartMetric: ChartMetric;
  externalSortKey?: string;
  limit?: number | null;
}

type Row = Player & Record<string, unknown>;

const STAT_COLUMNS: { key: SortKey; header: string }[] = [
  { key: 'ppg', header: 'PPG' },
  { key: 'rpg', header: 'RPG' },
  { key: 'apg', header: 'APG' },
  { key: 'spg', header: 'STL' },
  { key: 'bpg', header: 'BLK' },
  { key: 'fgPct', header: 'FG%' },
  { key: 'threePct', header: '3P%' },
  { key: 'ftPct', header: 'FT%' },
  { key: 'mpg', header: 'MPG' },
];

export default function LeaderboardTable({ players, highlightedPlayer, chartMetric, externalSortKey, limit }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('ppg');
  const [sortDir, setSortDir] = useState<'ascending' | 'descending'>('descending');

  useEffect(() => {
    if (externalSortKey && (STAT_COLUMNS.some(c => c.key === externalSortKey) || externalSortKey === 'name')) {
      setSortKey(externalSortKey as SortKey);
      setSortDir(externalSortKey === 'name' ? 'ascending' : 'descending');
    }
  }, [externalSortKey]);

  const sorted = [...players].sort((a, b) => {
    const av = a[sortKey] as string | number;
    const bv = b[sortKey] as string | number;
    if (typeof av === 'string') {
      return sortDir === 'ascending' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
    }
    return sortDir === 'ascending' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const displayed = (limit != null ? sorted.slice(0, limit) : sorted) as Row[];

  const metricToColumn: Record<ChartMetric, SortKey> = { ppg: 'ppg', rpg: 'rpg', apg: 'apg', spg: 'spg' };
  const highlightCol = metricToColumn[chartMetric];
  const isRankedByTopScorer = sortKey === 'ppg' && sortDir === 'descending';

  const sortablePlugin = useTableSortable<Row, SortKey>({
    sort: [{ sortKey, direction: sortDir }],
    onSortChange: (next) => {
      const entry = next[0];
      if (entry) {
        setSortKey(entry.sortKey);
        setSortDir(entry.direction);
      }
    },
  });

  const columns: TableColumn<Row>[] = [
    {
      key: 'name',
      header: 'Player',
      width: proportional(2),
      renderCell: (player: Row) => {
        const index = displayed.indexOf(player);
        const isHighlighted = highlightedPlayer !== null && player.name.toLowerCase().includes(highlightedPlayer.toLowerCase());
        const isTop = index === 0 && isRankedByTopScorer;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 16, textAlign: 'center', flexShrink: 0 }}>
              {isTop ? '🏆' : (
                <span style={{ fontFamily: 'var(--font-family-code)', fontSize: 11, color: 'var(--color-text-secondary)' }}>
                  {index + 1}
                </span>
              )}
            </span>
            <div>
              <div style={{ fontWeight: 600, color: isHighlighted ? 'var(--color-accent)' : undefined }}>
                {player.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{player.position}</div>
            </div>
          </div>
        );
      },
    },
    ...STAT_COLUMNS.map((col): TableColumn<Row> => ({
      key: col.key,
      header: col.header,
      width: pixel(64),
      renderCell: (player: Row) => {
        const value = player[col.key];
        return (
          <span
            style={{
              fontFamily: 'var(--font-family-code)',
              fontSize: 12,
              fontWeight: sortKey === col.key ? 700 : 400,
              color: col.key === highlightCol ? 'var(--color-accent)' : undefined,
            }}
          >
            {typeof value === 'number' ? value.toFixed(1) : String(value)}
          </span>
        );
      },
    })),
  ];

  return (
    <>
      {limit != null && limit < players.length && (
        <p style={{ padding: '8px 16px', fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Showing top {limit} of {players.length} players
        </p>
      )}
      <Table
        data={displayed}
        columns={columns}
        idKey="name"
        plugins={{ sortable: sortablePlugin }}
        hasHover
        dividers="rows"
      />
    </>
  );
}
