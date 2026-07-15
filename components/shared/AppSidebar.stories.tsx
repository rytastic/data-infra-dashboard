import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AppShell } from '@astryxdesign/core/AppShell';
import AppSidebar, { type NavSection } from './AppSidebar';

const SECTIONS: NavSection[] = [
  {
    id: 's26',
    label: '26 Big 12 Tournament',
    items: [
      { id: 'kansas', label: 'Kansas' },
      { id: 'tcu', label: 'TCU' },
      { id: 'arizona', label: 'Arizona' },
      { id: 'byu', label: 'BYU' },
      { id: 'houston', label: 'Houston' },
    ],
  },
  {
    id: 'placeholder',
    label: 'Section Header',
    items: [
      { id: 'p1', label: 'Label', isPlaceholder: true },
      { id: 'p2', label: 'Label', isPlaceholder: true },
    ],
  },
];

/**
 * The app's primary navigation, migrated from a hand-rolled <aside> to
 * Astryx's SideNav family (Phase 3 of the design system migration). Renders
 * inside an AppShell here to match how it's actually used in the app.
 */
const meta: Meta = {
  title: 'App/AppSidebar',
};

export default meta;
type Story = StoryObj;

function Interactive({ startCollapsed = false }: { startCollapsed?: boolean }) {
  const [activeId, setActiveId] = useState('kansas');
  const [collapsed, setCollapsed] = useState(startCollapsed);

  return (
    <div style={{ height: 500 }}>
      <AppShell
        height="fill"
        contentPadding={4}
        sideNav={
          <AppSidebar
            sections={SECTIONS}
            activeId={activeId}
            collapsed={collapsed}
            onItemClick={setActiveId}
            onNewDash={() => alert('New dash clicked')}
            onToggleCollapse={() => setCollapsed((c) => !c)}
          />
        }
      >
        <p>Active: {activeId}</p>
      </AppShell>
    </div>
  );
}

export const Expanded: Story = {
  render: () => <Interactive />,
};

export const Collapsed: Story = {
  render: () => <Interactive startCollapsed />,
};
