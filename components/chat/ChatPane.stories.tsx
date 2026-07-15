import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ChatPane, { type WidgetContext } from './ChatPane';
import type { PendingEdit } from '@/components/dashboard/types';

/**
 * The chat-driven editing panel docked to the dashboard's right edge,
 * rewritten on Astryx's Chat* component family (Phase 5b of the design
 * system migration) while keeping its custom command-parsing and
 * pending-edit review logic untouched.
 */
const meta: Meta = {
  title: 'Chat/ChatPane',
};

export default meta;
type Story = StoryObj;

const SAMPLE_PENDING_EDITS: PendingEdit[] = [
  {
    id: 'edit-1',
    description: 'Changed Chart 1 metric to Rebounds Per Game',
    previewType: 'metric',
    before: 'Points Per Game',
    after: 'Rebounds Per Game',
    affectedWidgetIds: ['trend-chart'],
  },
  {
    id: 'edit-2',
    description: 'Changed Chart 2 to a line chart',
    previewType: 'chart-type',
    before: 'bar',
    after: 'line',
    affectedWidgetIds: ['comparison-chart'],
  },
];

function Interactive({ initialSelectedWidgets = [], initialPendingEdits = [] }: {
  initialSelectedWidgets?: WidgetContext[];
  initialPendingEdits?: PendingEdit[];
}) {
  const [selectedWidgets, setSelectedWidgets] = useState<WidgetContext[]>(initialSelectedWidgets);
  const [pendingEdits, setPendingEdits] = useState<PendingEdit[]>(initialPendingEdits);

  return (
    <div style={{ height: 800, width: 384, border: '1px solid #e2e8f0' }}>
      <ChatPane
        onCommand={() => {
          const edit: PendingEdit = {
            id: `edit-${Date.now()}`,
            description: 'Simulated edit from a chat command',
            previewType: 'highlight',
            before: 'none',
            after: 'applied',
            affectedWidgetIds: [],
          };
          setPendingEdits((prev) => [...prev, edit]);
          return [edit];
        }}
        chartMetric="ppg"
        highlightedPlayer={null}
        selectedWidgets={selectedWidgets}
        onClearWidget={(id) => setSelectedWidgets((prev) => prev.filter((w) => w.id !== id))}
        pendingEdits={pendingEdits}
        onAcceptEdits={() => setPendingEdits([])}
        onDiscardEdits={() => setPendingEdits([])}
      />
    </div>
  );
}

export const EmptyState: Story = {
  render: () => <Interactive />,
};

export const WithSelectedWidget: Story = {
  render: () => (
    <Interactive
      initialSelectedWidgets={[{ id: 'trend-chart', label: 'Chart 1 · Scoring Trend', isChart: true, chartType: 'line' }]}
    />
  ),
};

export const WithPendingEdits: Story = {
  name: 'With pending edits (Approve/Reject)',
  render: () => <Interactive initialPendingEdits={SAMPLE_PENDING_EDITS} />,
};
