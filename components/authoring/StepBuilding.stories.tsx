import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StepBuilding from './StepBuilding';

/**
 * The animated "building your dashboard" step, migrated to Astryx's
 * ProgressBar (Phase 6 of the design system migration). Runs through its
 * full ~4s build sequence automatically and calls onComplete at the end.
 */
const meta: Meta = {
  title: 'Authoring/StepBuilding',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <StepBuilding onComplete={() => console.log('Build complete')} />,
};
