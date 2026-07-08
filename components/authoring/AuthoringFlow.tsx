'use client';

import { useState, useRef, useEffect } from 'react';
import AppSidebar, { type NavSection } from '@/components/shared/AppSidebar';
import StepDataSource from './StepDataSource';
import StepBreakdown from './StepBreakdown';
import StepBuilding from './StepBuilding';
import PromptInput from './PromptInput';
import Dashboard, { type DashboardLayout } from '@/components/dashboard/Dashboard';
import TEAMS from '@/data/teams';

type Step = 'dashboard' | 'datasource' | 'breakdown' | 'building';

// Maps data source IDs to the TEAMS keys we have data for
const BREAKDOWN_TO_LAYOUT: Record<string, DashboardLayout> = {
  b1: 'player-comparison',
  b2: 'overview',
  b3: 'top-scorers',
};

const SOURCE_TO_TEAM: Record<string, string> = {
  's3':  'kansas',
  's9':  'houston',
  's10': 'kansas',
  's12': 'tcu',
  's13': 'arizona',
};

interface SelectedSource { id: string; label: string }

const BASE_SECTIONS: NavSection[] = [
  {
    id: 's26',
    label: '26 Big 12 🏀 tournament',
    items: [
      { id: 'kansas', label: 'Kansas' },
      { id: 'tcu', label: 'TCU' },
      { id: 'arizona', label: 'Arizona' },
      { id: 'byu', label: 'BYU' },
      { id: 'houston', label: 'Houston' },
    ],
  },
  {
    id: 's25',
    label: '25 Big 12 🏀 tournament',
    items: [
      { id: 'p-iowa-state', label: 'Label', isPlaceholder: true },
      { id: 'p-texas-tech', label: 'Label', isPlaceholder: true },
    ],
  },
  {
    id: 'placeholder',
    label: 'Section Header',
    items: [
      { id: 'p1', label: 'Label', isPlaceholder: true },
      { id: 'p2', label: 'Label', isPlaceholder: true },
      { id: 'p3', label: 'Label', isPlaceholder: true },
    ],
  },
];

const ALL_SOURCES = [
  { id: 's1',  label: 'Cyclone basketball 2020-21' },
  { id: 's2',  label: 'Cyclone basketball 2022-23' },
  { id: 's3',  label: 'Kansas basketball 2024-25' },
  { id: 's4',  label: 'Cyclone basketball (non-con) 2022-23' },
  { id: 's5',  label: 'Duke basketball 2023-24' },
  { id: 's6',  label: 'Kentucky basketball 2023-24' },
  { id: 's7',  label: 'UNC basketball 2022-23' },
  { id: 's8',  label: 'Gonzaga basketball 2023-24' },
  { id: 's9',  label: 'Houston basketball 2023-24' },
  { id: 's10', label: 'Kansas basketball 2023-24' },
  { id: 's11', label: 'Baylor basketball 2023-24' },
  { id: 's12', label: 'TCU basketball 2023-24' },
  { id: 's13', label: 'Arizona basketball 2022-23' },
  { id: 's14', label: 'Purdue basketball 2023-24' },
  { id: 's15', label: 'Tennessee basketball 2023-24' },
  { id: 's16', label: 'UConn basketball 2023-24' },
  { id: 's17', label: 'Alabama basketball 2023-24' },
  { id: 's18', label: 'Marquette basketball 2023-24' },
  { id: 's19', label: 'Creighton basketball 2023-24' },
  { id: 's20', label: 'UCLA basketball 2022-23' },
  { id: 's21', label: 'Indiana basketball 2022-23' },
  { id: 's22', label: 'Michigan basketball 2023-24' },
  { id: 's23', label: 'SDSU basketball 2022-23' },
  { id: 's24', label: 'Iowa State basketball 2021-22' },
  { id: 's25', label: 'Texas Tech basketball 2023-24' },
  { id: 's26', label: 'Big 12 2023-24' },
  { id: 's27', label: 'NCAA Tournament 2024' },
  { id: 's28', label: 'Villanova basketball 2022-23' },
  { id: 's29', label: 'FAU basketball 2022-23' },
  { id: 's30', label: 'Arkansas basketball 2022-23' },
];

const DATASOURCE_CHIPS = [
  'Show me Cyclones game stats',
  'Compare seasons side by side',
  'Top scorers this year',
  'Big 12 conference record',
];

const BREAKDOWN_CHIPS = [
  'Show shooting percentages',
  'Break down by opponent',
  'Focus on conference games',
  'Add player headshots',
];

function ChipCarousel({ chips, onSelect }: { chips: string[]; onSelect: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateButtons();
  }, [chips]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-[600px] flex items-center gap-2">
      <button
        onClick={() => scroll('left')}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
        style={{
          border: '1px solid #e2e8f0',
          background: 'white',
          opacity: canLeft ? 1 : 0.35,
          cursor: canLeft ? 'pointer' : 'default',
          pointerEvents: canLeft ? 'auto' : 'none',
        }}
        aria-label="Previous suggestions"
      >
        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* min-w-0 is required so the flex child can shrink and actually scroll */}
      <div
        ref={scrollRef}
        onScroll={updateButtons}
        className="flex gap-2 flex-nowrap flex-1 min-w-0 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={onSelect}
            className="flex-shrink-0 text-sm whitespace-nowrap transition-colors hover:bg-slate-50"
            style={{
              padding: '8px 16px',
              borderRadius: 9999,
              border: '1px solid #e2e8f0',
              background: 'white',
              color: '#475569',
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
        style={{
          border: '1px solid #e2e8f0',
          background: 'white',
          opacity: canRight ? 1 : 0.35,
          cursor: canRight ? 'pointer' : 'default',
          pointerEvents: canRight ? 'auto' : 'none',
        }}
        aria-label="Next suggestions"
      >
        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}

const isCreating = (step: Step) =>
  step === 'datasource' || step === 'breakdown' || step === 'building';

export default function AuthoringFlow() {
  // Start on an existing dashboard
  const [step, setStep] = useState<Step>('dashboard');
  const [activeNavId, setActiveNavId] = useState<string>('kansas');
  const [sections, setSections] = useState<NavSection[]>(BASE_SECTIONS);
  const [selectedSources, setSelectedSources] = useState<SelectedSource[]>([]);
  const [promptInputValue, setPromptInputValue] = useState('');
  const [datasourcePromptValue, setDatasourcePromptValue] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // maps created nav item IDs to TEAMS keys so Dashboard knows which data to load
  const [navTeamOverrides, setNavTeamOverrides] = useState<Record<string, string>>({});
  // maps created nav item IDs to dashboard layout
  const [navLayoutOverrides, setNavLayoutOverrides] = useState<Record<string, DashboardLayout>>({});
  // maps nav item IDs to a custom display title (used by cloned dashboards)
  const [navTitleOverrides, setNavTitleOverrides] = useState<Record<string, string>>({});
  // marks nav item IDs that should open the chat pane with the "clone" welcome state
  const [navCloneWelcome, setNavCloneWelcome] = useState<Record<string, boolean>>({});
  const [selectedBreakdown, setSelectedBreakdown] = useState<string>('b3');

  const handleNewDash = () => {
    setSelectedSources([]);
    setPromptInputValue('');
    setDatasourcePromptValue('');
    setSidebarCollapsed(true);
    setStep('datasource');
  };

  const handleCloseCreation = () => {
    setSidebarCollapsed(false);
    setSelectedSources([]);
    setPromptInputValue('');
    setDatasourcePromptValue('');
    setStep('dashboard');
  };

  const handleNavItemClick = (id: string) => {
    setActiveNavId(id);
    if (isCreating(step)) {
      // Clicking a nav item exits creation and shows that dashboard
      setSidebarCollapsed(false);
      setStep('dashboard');
    }
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleSelectionChange = (sources: SelectedSource[]) => {
    setSelectedSources(sources);
  };

  const handleRemoveSource = (id: string) => {
    setSelectedSources(prev => prev.filter(s => s.id !== id));
  };

  const handleAddSource = (source: SelectedSource) => {
    setSelectedSources(prev =>
      prev.some(s => s.id === source.id) ? prev : [...prev, source]
    );
  };

  const availableSources = ALL_SOURCES.filter(
    s => !selectedSources.some(sel => sel.id === s.id)
  );

  const datasourceHasPrompt = !!datasourcePromptValue.trim();

  const handleBuildComplete = () => {
    // Determine which team to show based on selected sources
    const teamId = selectedSources
      .map(s => SOURCE_TO_TEAM[s.id])
      .find(Boolean) ?? undefined; // undefined → Dashboard falls back to Iowa State

    // Derive a readable label: use the team's full name if we have data, else the source label
    const teamName = teamId
      ? (TEAMS[teamId]?.team ?? selectedSources[0]?.label ?? 'My Dashboard')
      : (selectedSources[0]?.label ?? 'Iowa State 2023-24');

    const navId = `created-${teamId ?? 'default'}-${Date.now()}`;

    setSections(prev => {
      const withoutCreated = prev.filter(s => s.id !== 'created');
      const existingCreated = prev.find(s => s.id === 'created');
      const createdItems = existingCreated ? [...existingCreated.items, { id: navId, label: teamName }] : [{ id: navId, label: teamName }];
      return [{ id: 'created', label: 'My Dashboards', items: createdItems }, ...withoutCreated];
    });

    if (teamId) {
      setNavTeamOverrides(prev => ({ ...prev, [navId]: teamId }));
    }

    const dashLayout = BREAKDOWN_TO_LAYOUT[selectedBreakdown] ?? 'overview';
    setNavLayoutOverrides(prev => ({ ...prev, [navId]: dashLayout }));

    setActiveNavId(navId);
    setSidebarCollapsed(false);
    setStep('dashboard');
  };

  const handleCloneDashboard = () => {
    const teamId = navTeamOverrides[activeNavId] ?? activeNavId;
    const currentTitle =
      navTitleOverrides[activeNavId] ??
      TEAMS[teamId]?.team ??
      sections.flatMap(s => s.items).find(i => i.id === activeNavId)?.label ??
      'Dashboard';
    const cloneTitle = `Copy of ${currentTitle}`;
    const navId = `clone-${activeNavId}-${Date.now()}`;

    setSections(prev => {
      const withoutCreated = prev.filter(s => s.id !== 'created');
      const existingCreated = prev.find(s => s.id === 'created');
      const createdItems = existingCreated
        ? [...existingCreated.items, { id: navId, label: cloneTitle }]
        : [{ id: navId, label: cloneTitle }];
      return [{ id: 'created', label: 'My Dashboards', items: createdItems }, ...withoutCreated];
    });

    setNavTeamOverrides(prev => ({ ...prev, [navId]: teamId }));
    setNavLayoutOverrides(prev => ({ ...prev, [navId]: navLayoutOverrides[activeNavId] ?? 'overview' }));
    setNavTitleOverrides(prev => ({ ...prev, [navId]: cloneTitle }));
    setNavCloneWelcome(prev => ({ ...prev, [navId]: true }));
    setActiveNavId(navId);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        sections={sections}
        activeId={activeNavId}
        collapsed={sidebarCollapsed}
        onItemClick={handleNavItemClick}
        onNewDash={handleNewDash}
        onToggleCollapse={handleToggleCollapse}
      />

      <div
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
        style={{ background: '#f1f5f9' }}
      >
        {step === 'dashboard' && (
          <Dashboard
            key={activeNavId}
            noSidebar
            teamId={navTeamOverrides[activeNavId] ?? activeNavId}
            layout={navLayoutOverrides[activeNavId] ?? 'overview'}
            sectionTitle={sections.find(s => s.items.some(i => i.id === activeNavId))?.label}
            title={navTitleOverrides[activeNavId]}
            startWithCloneSuggestion={!!navCloneWelcome[activeNavId]}
            onCloneDashboard={handleCloneDashboard}
          />
        )}

        {isCreating(step) && (
          <>
            {/* Page header */}
            <div className="px-10 pt-10 pb-6 flex-shrink-0 flex items-start gap-4">
              {/* Spacer mirrors the close button so the title stays centered */}
              <div className="w-8 flex-shrink-0" />
              <div className="flex-1 text-center">
                <h1 className="text-[22px] font-bold text-foreground tracking-[-0.25px]">
                  Let&apos;s create a dashboard page
                </h1>
                <p className="text-sm text-[var(--md-on-surface-variant)] mt-1">
                  Select a data source or ask a data question
                </p>
              </div>
              <button
                onClick={handleCloseCreation}
                className="w-8 flex-shrink-0 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Step content + persistent input */}
            <div className="flex-1 flex flex-col items-center px-10 pb-6 overflow-y-auto gap-4">
              {step === 'building' && (
                <div className="w-full max-w-[600px]">
                  <StepBuilding onComplete={handleBuildComplete} />
                </div>
              )}

              {(step === 'datasource' || step === 'breakdown') && (
                <>
                  {/* Tray: step card + prompt input joined under one border */}
                  <div
                    className="w-full max-w-[600px] overflow-hidden"
                    style={{
                      border: '1px solid var(--md-outline-variant)',
                      borderRadius: 16,
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
                    }}
                  >
                    {step === 'datasource' && (
                      <StepDataSource
                        onSelectionChange={handleSelectionChange}
                      />
                    )}
                    {step === 'breakdown' && (
                      <StepBreakdown
                        onSubmit={(id) => { setSelectedBreakdown(id); setStep('building'); }}
                        onBack={() => setStep('datasource')}
                        onSelectionChange={setPromptInputValue}
                      />
                    )}
                    {/* Light separator between step and prompt */}
                    <div style={{ height: 1, background: '#e8edf2' }} />
                    {step === 'datasource' && (
                      <PromptInput
                        selectedSources={selectedSources}
                        availableSources={availableSources}
                        onRemoveSource={handleRemoveSource}
                        onAddSource={handleAddSource}
                        placeholder="Select data source(s) or ask a data question"
                        inputValue={datasourcePromptValue}
                        ctaLabel={datasourceHasPrompt ? 'Create dash' : 'Next'}
                        ctaEnabled={selectedSources.length > 0 || datasourceHasPrompt}
                        onValueChange={setDatasourcePromptValue}
                        onSubmit={() => {
                          if (datasourceHasPrompt) setStep('building');
                          else setStep('breakdown');
                        }}
                      />
                    )}
                    {step === 'breakdown' && (
                      <PromptInput
                        selectedSources={selectedSources}
                        availableSources={availableSources}
                        onRemoveSource={handleRemoveSource}
                        onAddSource={handleAddSource}
                        placeholder="Select data source(s) or ask a data question"
                        inputValue={promptInputValue}
                        ctaLabel="Create dash"
                        onSubmit={() => setStep('building')}
                      />
                    )}
                  </div>

                  {/* Suggested prompts — horizontal pill carousel with nav buttons */}
                  <ChipCarousel
                    chips={step === 'datasource' ? DATASOURCE_CHIPS : BREAKDOWN_CHIPS}
                    onSelect={() => {
                      if (step === 'datasource') setStep('breakdown');
                      if (step === 'breakdown') setStep('building');
                    }}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
