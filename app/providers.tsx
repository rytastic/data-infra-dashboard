'use client';

import { Theme } from '@astryxdesign/core/theme';
import { cyclonesDashboardTheme } from './cyclones-dashboard';
import './cyclones-dashboard.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return <Theme theme={cyclonesDashboardTheme}>{children}</Theme>;
}
