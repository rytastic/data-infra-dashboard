import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Badge } from '@astryxdesign/core/Badge';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';

/**
 * Foundation smoke test — proves the Astryx cascade (reset → theme → base →
 * astryx-base → astryx-theme → components → utilities) renders correctly
 * inside Storybook, using the same globals.css and <Theme> wiring as the
 * real app. If this looks broken (missing padding, wrong colors, no
 * radius/shadow), a cascade-layer conflict needs fixing before any real
 * component migration starts.
 */
const meta = {
  title: 'Astryx/Foundation',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Smoke: Story = {
  render: () => (
    <VStack gap={6} style={{ padding: 32 }}>
      <HStack gap={3}>
        <Button label="Primary" variant="primary" />
        <Button label="Secondary" variant="secondary" />
        <Button label="Ghost" variant="ghost" />
        <Button label="Destructive" variant="destructive" />
        <Button label="Loading" variant="primary" isLoading />
        <Button label="Disabled" variant="secondary" isDisabled />
      </HStack>

      <HStack gap={3}>
        <Badge label="Neutral" variant="neutral" />
        <Badge label="Info" variant="info" />
        <Badge label="Success" variant="success" />
        <Badge label="Warning" variant="warning" />
        <Badge label="Error" variant="error" />
      </HStack>

      <HStack gap={4}>
        <Card padding={4} style={{ width: 220 }}>
          <VStack gap={2}>
            <Badge label="Card" variant="blue" />
            <p>A default Card with padding, radius, and shadow tokens from the theme.</p>
          </VStack>
        </Card>
        <Card padding={4} variant="muted" style={{ width: 220 }}>
          <VStack gap={2}>
            <Badge label="Muted" variant="neutral" />
            <p>A muted-variant Card for comparison.</p>
          </VStack>
        </Card>
      </HStack>
    </VStack>
  ),
};
