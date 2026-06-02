'use client';

import { useState } from 'react';
import AppSidebar, { type NavSection } from '@/components/shared/AppSidebar';
import StepDataSource from './StepDataSource';
import StepBreakdown from './StepBreakdown';
import StepBuilding from './StepBuilding';
import PromptInput from './PromptInput';
import Dashboard from '@/components/dashboard/Dashboard';

type Step = 'dashboard' | 'datasource' | 'breakdown' | 'building';

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

const isCreating = (step: Step) =>
  step === 'datasource' || step === 'breakdown' || step === 'building';

export default function AuthoringFlow() {
  // Start on an existing dashboard
  const [step, setStep] = useState<Step>('dashboard');
  const [activeNavId, setActiveNavId] = useState<string>('kansas');
  const [sections, setSections] = useState<NavSection[]>(BASE_SECTIONS);
  const [selectedSources, setSelectedSources] = useState<SelectedSource[]>([]);
  const [promptInputValue, setPromptInputValue] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNewDash = () => {
    setSelectedSources([]);
    setPromptInputValue('');
    setSidebarCollapsed(true);
    setStep('datasource');
  };

  const handleCloseCreation = () => {
    setSidebarCollapsed(false);
    setSelectedSources([]);
    setPromptInputValue('');
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

  const handleDataSourceNext = (sources: SelectedSource[]) => {
    setSelectedSources(sources);
    setStep('breakdown');
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

  const handleBuildComplete = () => {
    // Add newly created item to nav
    setSections(prev => {
      if (prev[0]?.id === 'created') return prev;
      return [
        {
          id: 'created',
          label: 'My Dashboards',
          items: [{ id: 'cyclone-2324', label: 'Iowa State 2023-24' }],
        },
        ...prev,
      ];
    });
    setActiveNavId('cyclone-2324');
    setSidebarCollapsed(false);  // expand nav on completion
    setStep('dashboard');
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
        {step === 'dashboard' && <Dashboard noSidebar teamId={activeNavId} />}

        {isCreating(step) && (
          <>
            {/* Page header */}
            <div className="px-10 pt-10 pb-6 flex-shrink-0 flex items-start justify-between">
              <div>
                <h1 className="text-[22px] font-bold text-foreground tracking-[-0.25px]">
                  Let&apos;s create a dashboard page
                </h1>
                <p className="text-sm text-[var(--md-on-surface-variant)] mt-1">
                  What data would you like to use? Or ask a data question and we can find the right sources for you.
                </p>
              </div>
              <button
                onClick={handleCloseCreation}
                className="mt-0.5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Step content + persistent input */}
            <div className="flex-1 flex flex-col items-center px-10 pb-6 overflow-y-auto">
              {step === 'datasource' && (
                <StepDataSource
                  onNext={handleDataSourceNext}
                  onSelectionChange={handleSelectionChange}
                />
              )}
              {step === 'breakdown' && (
                <StepBreakdown
                  onSubmit={() => setStep('building')}
                  onBack={() => setStep('datasource')}
                  onSelectionChange={setPromptInputValue}
                />
              )}
              {step === 'building' && (
                <div className="w-full max-w-[600px]">
                  <StepBuilding onComplete={handleBuildComplete} />
                </div>
              )}

              {(step === 'datasource' || step === 'breakdown') && (
                <div className="w-full max-w-[600px] mt-4">
                  <PromptInput
                    chips={step === 'datasource' ? DATASOURCE_CHIPS : BREAKDOWN_CHIPS}
                    selectedSources={selectedSources}
                    availableSources={availableSources}
                    onRemoveSource={handleRemoveSource}
                    onAddSource={handleAddSource}
                    placeholder="What data question can I answer?"
                    inputValue={step === 'breakdown' ? promptInputValue : undefined}
                    ctaLabel={step === 'breakdown' ? 'Create dash' : undefined}
                    onSubmit={() => {
                      if (step === 'datasource') setStep('breakdown');
                      if (step === 'breakdown') setStep('building');
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
