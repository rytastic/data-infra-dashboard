'use client';

import { useState } from 'react';
import StepWelcome from './StepWelcome';
import StepConfirmation from './StepConfirmation';
import StepBuilding from './StepBuilding';
import StepPreview from './StepPreview';
import Dashboard from '@/components/dashboard/Dashboard';

export type Step = 'welcome' | 'confirmation' | 'building' | 'preview' | 'published';

export default function AuthoringFlow() {
  const [step, setStep] = useState<Step>('welcome');
  const [prompt, setPrompt] = useState('');

  if (step === 'published') {
    return <Dashboard />;
  }

  return (
    <div className="min-h-full bg-slate-900 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-cardinal flex items-center justify-center">
            <span className="text-white text-xs font-bold">IS</span>
          </div>
          <span className="text-slate-200 font-semibold text-sm tracking-wide">Dashboard Builder</span>
        </div>
        <StepPips current={step} />
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        {step === 'welcome' && (
          <StepWelcome
            onSubmit={(p) => { setPrompt(p); setStep('confirmation'); }}
          />
        )}
        {step === 'confirmation' && (
          <StepConfirmation
            prompt={prompt}
            onConfirm={() => setStep('building')}
            onBack={() => setStep('welcome')}
          />
        )}
        {step === 'building' && (
          <StepBuilding onComplete={() => setStep('preview')} />
        )}
        {step === 'preview' && (
          <StepPreview onPublish={() => setStep('published')} />
        )}
      </main>
    </div>
  );
}

const STEPS: Step[] = ['welcome', 'confirmation', 'building', 'preview'];
const STEP_LABELS: Record<Step, string> = {
  welcome: 'Describe',
  confirmation: 'Confirm',
  building: 'Build',
  preview: 'Preview',
  published: 'Published',
};

function StepPips({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-1.5">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              i < idx
                ? 'bg-cardinal/20 text-cardinal'
                : i === idx
                ? 'bg-cardinal text-white'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              i < idx ? 'bg-cardinal text-white' : i === idx ? 'bg-white/20' : 'bg-slate-700'
            }`}>
              {i < idx ? '✓' : i + 1}
            </span>
            {STEP_LABELS[s]}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-6 h-px ${i < idx ? 'bg-cardinal/50' : 'bg-slate-700'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
