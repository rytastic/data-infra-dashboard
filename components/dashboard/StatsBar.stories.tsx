import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StatsBar from './StatsBar';
import TEAMS from '@/data/teams';

const SEASON = TEAMS.kansas.seasons[2];

/**
 * The season-summary stat strip at the top of every dashboard, migrated to
 * Astryx's Card (Phase 4c of the design system migration).
 */
const meta: Meta = {
  title: 'Dashboard/StatsBar',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <StatsBar season={SEASON} conference="Big 12" />,
};

export const NoConference: Story = {
  render: () => <StatsBar season={SEASON} />,
};
