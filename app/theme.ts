import { defineTheme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';

/**
 * theme-neutral's shipped shadow tokens read heavier than the design
 * system's own documented defaults once rendered at real UI scale (dropdowns,
 * cards, the header icon). Softened here — lower opacity, comparable blur —
 * shared by the app and Storybook so both stay visually identical.
 */
export const appTheme = defineTheme({
  name: 'cyclones-dashboard',
  extends: neutralTheme,
  tokens: {
    '--shadow-low':
      '0px 1px 2px light-dark(rgba(0,0,0,0.04), rgba(0,0,0,0.12)), 0px 1px 4px light-dark(rgba(0,0,0,0.06), rgba(0,0,0,0.18))',
    '--shadow-med':
      '0px 1px 2px light-dark(rgba(0,0,0,0.05), rgba(0,0,0,0.14)), 0px 3px 8px light-dark(rgba(0,0,0,0.07), rgba(0,0,0,0.20))',
    '--shadow-high':
      '0px 2px 4px light-dark(rgba(0,0,0,0.06), rgba(0,0,0,0.16)), 0px 6px 18px light-dark(rgba(0,0,0,0.10), rgba(0,0,0,0.26))',
  },
});
