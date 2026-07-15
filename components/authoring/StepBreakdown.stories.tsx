import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StepBreakdown from './StepBreakdown';

/**
 * The dimension-breakdown picker step of the authoring flow, migrated to
 * Astryx's RadioList (Phase 4b of the design system migration).
 */
const meta: Meta = {
  title: 'Authoring/StepBreakdown',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <StepBreakdown
      onSubmit={(id) => alert(`Submitted breakdown: ${id}`)}
      onBack={() => alert('Back clicked')}
      onSelectionChange={(title) => console.log('Selected:', title)}
    />
  ),
};
