import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PlayerCards from './PlayerCards';
import TEAMS from '@/data/teams';

const PLAYERS = TEAMS.kansas.seasons[2].players;

/**
 * Top-3 player stat cards, migrated to Astryx's Card + Avatar + Badge
 * (Phase 4c of the design system migration).
 */
const meta: Meta = {
  title: 'Dashboard/PlayerCards',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <PlayerCards players={PLAYERS} highlightedPlayer={null} />,
};

export const HighlightedPlayer: Story = {
  render: () => <PlayerCards players={PLAYERS} highlightedPlayer="Alex Grant" />,
};

function InteractiveSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <PlayerCards
      players={PLAYERS}
      highlightedPlayer={null}
      selectedWidgetIds={selected}
      onWidgetSelect={(id, shiftKey) => {
        setSelected((prev) => {
          if (shiftKey) return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
          return prev.includes(id) && prev.length === 1 ? [] : [id];
        });
      }}
    />
  );
}

export const SelectableWidgets: Story = {
  name: 'Click to select (shift-click for multi)',
  render: () => <InteractiveSelection />,
};
