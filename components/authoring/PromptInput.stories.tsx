import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PromptInput from './PromptInput';

interface SourceChip { id: string; label: string; kind?: 'source' | 'dashboard' }

const SOURCES: SourceChip[] = [
  { id: 's1', label: 'Cyclone basketball 2020-21' },
  { id: 's2', label: 'Cyclone basketball 2022-23' },
  { id: 's3', label: 'Kansas basketball 2024-25' },
  { id: 's4', label: 'Duke basketball 2023-24' },
  { id: 's5', label: 'Kentucky basketball 2023-24' },
  { id: 's6', label: 'Houston basketball 2023-24' },
];

const DASHBOARDS: SourceChip[] = [
  { id: 'd1', label: 'Kansas' },
  { id: 'd2', label: 'TCU' },
  { id: 'd3', label: 'Arizona' },
];

/**
 * The authoring flow's data-question composer, including the @-mention
 * autocomplete for tagging sources/dashboards and the multi-source chip
 * row. The riskiest piece of Phase 6 of the design system migration — its
 * chips, dropdowns, and CTA are Astryx (Token/Popover/List/Button), while
 * the @ trigger keeps its custom cursor-anchored keyboard nav. Type "@" in
 * the input to try the mention dropdown.
 */
const meta: Meta = {
  title: 'Authoring/PromptInput',
};

export default meta;
type Story = StoryObj;

function Interactive({ initialSelected = [], ctaLabel }: { initialSelected?: SourceChip[]; ctaLabel?: string }) {
  const [selectedSources, setSelectedSources] = useState<SourceChip[]>(initialSelected);
  const [value, setValue] = useState('');

  const availableSources = SOURCES.filter((s) => !selectedSources.some((sel) => sel.id === s.id));
  const availableDashboards = DASHBOARDS.filter((d) => !selectedSources.some((sel) => sel.id === d.id));

  return (
    <div style={{ maxWidth: 600 }}>
      <PromptInput
        selectedSources={selectedSources}
        availableSources={availableSources}
        availableDashboards={availableDashboards}
        onRemoveSource={(id) => setSelectedSources((prev) => prev.filter((s) => s.id !== id))}
        onAddSource={(s) => setSelectedSources((prev) => (prev.some((x) => x.id === s.id) ? prev : [...prev, s]))}
        inputValue={value}
        onValueChange={setValue}
        ctaLabel={ctaLabel}
        onSubmit={(v) => alert(`Submitted: ${v || '(no text, sources only)'}`)}
      />
    </div>
  );
}

export const Empty: Story = {
  render: () => <Interactive />,
};

export const WithSelectedSources: Story = {
  render: () => <Interactive initialSelected={SOURCES.slice(0, 2)} />,
};

export const OverflowChips: Story = {
  name: 'Overflow (4+ sources)',
  render: () => <Interactive initialSelected={SOURCES} />,
};

export const WithCtaLabel: Story = {
  render: () => <Interactive initialSelected={SOURCES.slice(0, 1)} ctaLabel="Create dash" />,
};
