import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LeaderboardTable from './LeaderboardTable';
import TEAMS from '@/data/teams';

const PLAYERS = TEAMS.kansas.seasons[2].players;

/**
 * The player stats table used on every dashboard, migrated to Astryx's
 * Table + useTableSortable (Phase 4a of the design system migration).
 */
const meta: Meta = {
  title: 'Dashboard/LeaderboardTable',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <LeaderboardTable
      players={PLAYERS}
      highlightedPlayer={null}
      chartMetric="ppg"
    />
  ),
};

export const HighlightedPlayer: Story = {
  render: () => (
    <LeaderboardTable
      players={PLAYERS}
      highlightedPlayer="Marcus Thompson"
      chartMetric="rpg"
    />
  ),
};

export const Limited: Story = {
  name: 'Limited to top 5',
  render: () => (
    <LeaderboardTable
      players={PLAYERS}
      highlightedPlayer={null}
      chartMetric="ppg"
      limit={5}
    />
  ),
};

function InteractiveSort() {
  const [sortKey, setSortKey] = useState('ppg');
  return (
    <div>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
        Click a column header to sort — externalSortKey below simulates a
        chat-driven sort change.
      </p>
      <button
        onClick={() => setSortKey((k) => (k === 'ppg' ? 'rpg' : 'ppg'))}
        style={{ marginBottom: 12, fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}
      >
        Toggle external sort ({sortKey})
      </button>
      <LeaderboardTable
        players={PLAYERS}
        highlightedPlayer={null}
        chartMetric="ppg"
        externalSortKey={sortKey}
      />
    </div>
  );
}

export const ExternalSort: Story = {
  render: () => <InteractiveSort />,
};
