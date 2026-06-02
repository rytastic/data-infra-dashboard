# Product Goals

## Phase 1 — Authoring Wizard (complete)

Multi-step wizard (`components/authoring/AuthoringFlow.tsx`) that walks the user through:
- Data source selection (`StepDataSource.tsx`)
- Breakdown / grouping configuration (`StepBreakdown.tsx`)
- Dashboard generation (`StepBuilding.tsx`)
- Preview and confirmation

Output: a fully rendered dashboard on the canvas (`components/dashboard/Dashboard.tsx`).

---

## Phase 2 — Editing Experience (in progress)

The editing experience lets users refine a generated dashboard through a chat-driven agent panel. It is the primary post-creation workflow.

### Entry point
The right-hand chat pane (`components/chat/ChatPane.tsx`) becomes active once a dashboard has been created.

### Natural language editing
The user types a prompt into the chat input. The agent interprets it and updates one or more widgets on the dashboard canvas. Changes are reflected immediately in a pending/highlighted state — not committed until approved.

### Widget selection as context
Clicking a widget on the canvas (via `components/dashboard/SelectableWidget.tsx`) attaches that widget as context in the chat input. This enables fine-grained, widget-scoped edits ("make this chart a bar chart", "change the color to blue") without the agent needing to guess which widget the user means.

### Change preview and approval flow
After the agent applies edits:
1. **Highlight** — affected widgets on the canvas are visually highlighted (pending state) until approved.
2. **Change toasts** — a vertical stack of toast-style entries surfaces from the chat pane, one per changed widget, each showing a brief summary of what changed.
3. **Approve individually** — the user can tap approve on any single toast to commit that widget's change and clear its highlight.
4. **Approve all** — a bulk action commits all pending changes at once.
5. **Reject / dismiss** — dismissing a toast reverts that widget's change.

### Key constraints
- All UI must follow Material Design 3 (see `AGENTS.md`).
- Charts use Apache ECharts exclusively (see `AGENTS.md`).
- Agent responses and state live in the existing `ChatPane` component; extend rather than replace it.
