'use client';

import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Icon } from '@astryxdesign/core/Icon';
import { TextInput } from '@astryxdesign/core/TextInput';
import { TextArea } from '@astryxdesign/core/TextArea';
import { FormLayout } from '@astryxdesign/core/FormLayout';
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';
import { Tokenizer } from '@astryxdesign/core/Tokenizer';
import type { SearchableItem, SearchSource } from '@astryxdesign/core/Typeahead';
import { VStack } from '@astryxdesign/core/VStack';

interface Props {
  onExit: () => void;
}

const TOTAL_STEPS = 10;

const STEP_META = [
  { n: 1, label: 'Details' },
  { n: 2, label: 'Permissions' },
  { n: 3, label: 'Data & visuals' },
  { n: 4, label: 'Filters' },
  { n: 5, label: 'Layout' },
  { n: 6, label: 'Alerts' },
  { n: 7, label: 'Sharing' },
  { n: 8, label: 'Branding' },
  { n: 9, label: 'Automation' },
  { n: 10, label: 'Review' },
];

const OWNER_DIRECTORY: SearchableItem[] = [
  { id: 'o1', label: 'Jordan Blake' },
  { id: 'o2', label: 'Casey Nguyen' },
  { id: 'o3', label: 'Priya Shah' },
  { id: 'o4', label: 'Marcus Webb' },
  { id: 'o5', label: 'Elena Ruiz' },
  { id: 'o6', label: 'Sam Okafor' },
];

const ownerSearchSource: SearchSource = {
  search: (query: string) =>
    OWNER_DIRECTORY.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
  bootstrap: () => OWNER_DIRECTORY,
};

const WIREFRAME_WIDTHS = ['70%', '45%', '60%', '35%', '55%', '50%'];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full max-w-[760px] flex items-start px-2">
      {STEP_META.map((step, i) => {
        const isComplete = step.n < currentStep;
        const isActive = step.n === currentStep;
        const circleClass = isComplete
          ? 'bg-slate-700 text-white'
          : isActive
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-slate-300 text-slate-500';

        return (
          <div key={step.n} className={`flex items-center ${i < STEP_META.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0" style={{ width: 56 }}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${circleClass}`}>
                {isComplete ? <Icon icon="check" size="xsm" /> : step.n}
              </div>
              <span className={`text-[11px] text-center leading-tight ${isActive ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {i < STEP_META.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-5 ${isComplete ? 'bg-slate-400' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Placeholder field row: a label-shaped bar over an empty input-shaped box.
function WireframeField({ width, seed }: { width: string; seed: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-2.5 rounded bg-slate-200" style={{ width }} />
      <div className={`h-9 rounded-lg border border-slate-200 ${seed % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`} />
    </div>
  );
}

// Placeholder checklist row: an empty checkbox box next to a label-shaped bar.
function WireframeChecklistRow({ width }: { width: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <div className="w-4 h-4 rounded border border-slate-300 bg-white flex-shrink-0" />
      <div className="h-2.5 rounded bg-slate-200" style={{ width }} />
    </div>
  );
}

// Generic, non-specific form used for every step from "Data & visuals" onward —
// these steps aren't built out with real content, just the wizard's shape.
function WireframeStepForm({ stepNumber }: { stepNumber: number }) {
  const w = (offset: number) => WIREFRAME_WIDTHS[(stepNumber + offset) % WIREFRAME_WIDTHS.length];

  return (
    <VStack gap={6}>
      <div className="flex flex-col gap-2">
        <div className="h-4 rounded bg-slate-200" style={{ width: w(0) }} />
        <div className="h-2.5 rounded bg-slate-100" style={{ width: w(1) }} />
      </div>

      <WireframeField width={w(2)} seed={stepNumber} />
      <WireframeField width={w(3)} seed={stepNumber + 1} />

      <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
        {[0, 1, 2].map((i) => (
          <WireframeChecklistRow key={i} width={w(i + 4)} />
        ))}
      </div>
    </VStack>
  );
}

export default function LegacyAuthoringWizard({ onExit }: Props) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 — dashboard details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Step 2 — permissions & on-call owners
  const [visibility, setVisibility] = useState('team');
  const [owners, setOwners] = useState<SearchableItem[]>([]);

  const canProceed = currentStep === 1 ? name.trim().length > 0 : true;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const activeLabel = STEP_META.find((s) => s.n === currentStep)?.label ?? '';

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden" style={{ background: '#f1f5f9' }}>
      {/* Page header */}
      <div className="px-10 pt-10 pb-6 flex-shrink-0 flex items-start gap-4">
        <div className="w-10 flex-shrink-0">
          <IconButton
            icon={<Icon icon="chevronLeft" />}
            label="Back to conversational authoring"
            tooltip="Back to chat"
            variant="ghost"
            onClick={onExit}
          />
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-[22px] font-bold text-foreground tracking-[-0.25px]">Legacy authoring</h1>
          <p className="text-sm text-slate-500 mt-1">
            Step {currentStep} of {TOTAL_STEPS} — {activeLabel}
          </p>
        </div>
        <div className="w-10 flex-shrink-0" />
      </div>

      {/* Step indicator */}
      <div className="flex justify-center px-10 pb-6 flex-shrink-0">
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center px-10 pb-6 overflow-y-auto gap-4">
        <div
          className="w-full max-w-[600px] bg-white overflow-hidden border border-slate-200"
          style={{
            borderRadius: 16,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
          }}
        >
          <div className="p-6">
            {currentStep === 1 && (
              <FormLayout>
                <TextInput
                  label="Dashboard name"
                  value={name}
                  onChange={setName}
                  placeholder="e.g. Kansas Jayhawks 2024-25"
                  isRequired
                  hasAutoFocus
                />
                <TextArea
                  label="Description"
                  value={description}
                  onChange={setDescription}
                  placeholder="What is this dashboard for?"
                  rows={4}
                  isOptional
                />
              </FormLayout>
            )}

            {currentStep === 2 && (
              <VStack gap={6}>
                <RadioList label="Who can view this dashboard" value={visibility} onChange={setVisibility}>
                  <RadioListItem value="private" label="Only me" description="Private to your account" />
                  <RadioListItem value="team" label="My team" description="Visible to everyone on your team" />
                  <RadioListItem value="org" label="Entire organization" description="Visible to everyone in the organization" />
                </RadioList>
                <Tokenizer
                  label="On-call owners"
                  description="Notified if this dashboard's data pipeline breaks"
                  searchSource={ownerSearchSource}
                  value={owners}
                  onChange={(items) => setOwners(items)}
                  placeholder="Search people…"
                  hasEntriesOnFocus
                  hasClear
                />
              </VStack>
            )}

            {currentStep >= 3 && <WireframeStepForm stepNumber={currentStep} />}
          </div>

          {/* Step nav — lives in the same card as the fields it advances */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <Button label="Back" variant="secondary" onClick={handleBack} isDisabled={currentStep === 1} />
            <Button
              label="Next"
              variant="primary"
              onClick={handleNext}
              isDisabled={!canProceed || currentStep >= TOTAL_STEPS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
