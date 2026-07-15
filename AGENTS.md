<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design Standards

## UI & Layout — Astryx
All UI elements, layout, spacing, and component patterns must use the [Astryx](https://www.npmjs.com/package/@astryxdesign/core) design system (`@astryxdesign/core`). Discover before building — do not hand-roll layout or invent bespoke components:
1. `npx astryx build "<idea>"` — find the closest page/block/component kit for what you're building.
2. `npx astryx component <Name>` — check props/examples before using any component.
3. `npx astryx docs <topic>` — layout, tokens, spacing, color, theme, etc.

No raw `<div>`-based layout — components own layout/spacing. Custom styling goes through component props first, then Tailwind utilities backed by Astryx tokens (no raw hex/px values). See `npx astryx docs migration` for incrementally converting any remaining hand-rolled components.

## Data Visualization — Apache ECharts
All charts and data visualizations must use [Apache ECharts](https://echarts.apache.org/). Do not introduce Chart.js, Recharts, D3, or any other charting library. Configure charts with ECharts option objects; prefer declarative config over imperative canvas manipulation.
