import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Dashboard from './Dashboard';

/**
 * The full dashboard page: header, stat cards, charts, leaderboard, and the
 * chat pane. Its shell and every sub-widget were migrated across Phases
 * 4-5 of the design system migration (Layout/LayoutPanel frame,
 * Table/Card/Avatar/Badge widgets, Chat* family for the assistant pane).
 */
const meta: Meta = {
  title: 'Dashboard/Dashboard',
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => (
    <div style={{ height: 900 }}>
      <Dashboard noSidebar teamId="kansas" layout="overview" />
    </div>
  ),
};

export const PlayerComparison: Story = {
  render: () => (
    <div style={{ height: 900 }}>
      <Dashboard noSidebar teamId="kansas" layout="player-comparison" />
    </div>
  ),
};

export const TopScorers: Story = {
  render: () => (
    <div style={{ height: 900 }}>
      <Dashboard noSidebar teamId="kansas" layout="top-scorers" />
    </div>
  ),
};

export const PreviewMode: Story = {
  name: 'Preview (no chat pane, no clone button)',
  render: () => (
    <div style={{ height: 900 }}>
      <Dashboard noSidebar isPreview teamId="kansas" layout="overview" />
    </div>
  ),
};
