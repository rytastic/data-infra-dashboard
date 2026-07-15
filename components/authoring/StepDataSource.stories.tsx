import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StepDataSource from './StepDataSource';

/**
 * The data-source picker step of the authoring flow, migrated to Astryx's
 * CheckboxList (Phase 4b of the design system migration).
 */
const meta: Meta = {
  title: 'Authoring/StepDataSource',
};

export default meta;
type Story = StoryObj;

function Interactive() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return (
    <StepDataSource
      selectedIds={selectedIds}
      onToggle={(source) => {
        setSelectedIds((prev) =>
          prev.includes(source.id) ? prev.filter((id) => id !== source.id) : [...prev, source.id]
        );
      }}
    />
  );
}

export const Default: Story = {
  render: () => <Interactive />,
};
