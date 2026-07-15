import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AuthoringFlow from './AuthoringFlow';

/**
 * The full app: sidebar, dashboard, and the "New dash" creation flow
 * (data source -> breakdown -> building -> generated dashboard). This is
 * the top-level component every phase of the design system migration was
 * verified against. Click "New dash" in the sidebar to walk the flow.
 */
const meta: Meta = {
  title: 'App/AuthoringFlow',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ height: 900 }}>
      <AuthoringFlow />
    </div>
  ),
};
