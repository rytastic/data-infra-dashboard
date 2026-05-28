'use client';

import { useState, useEffect } from 'react';

const BUILD_STEPS = [
  { label: 'Selecting optimal layout', icon: '🎨', duration: 800 },
  { label: 'Pulling player statistics', icon: '📥', duration: 700 },
  { label: 'Calculating season averages', icon: '🧮', duration: 600 },
  { label: 'Rendering season trend chart', icon: '📈', duration: 700 },
  { label: 'Building player leaderboard', icon: '📋', duration: 600 },
  { label: 'Generating comparison charts', icon: '📊', duration: 600 },
  { label: 'Assembling player cards', icon: '🃏', duration: 500 },
  { label: 'Applying Iowa State branding', icon: '🌪️', duration: 400 },
  { label: 'Final polish', icon: '✨', duration: 500 },
];

export default function StepBuilding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let stepIdx = 0;
    let elapsed = 0;
    const totalDuration = BUILD_STEPS.reduce((s, b) => s + b.duration, 0) + 600;

    const tick = () => {
      if (stepIdx >= BUILD_STEPS.length) {
        setDone(true);
        setProgress(100);
        setTimeout(onComplete, 600);
        return;
      }
      setCurrentStep(stepIdx);
      elapsed += BUILD_STEPS[stepIdx].duration;
      setProgress(Math.round((elapsed / totalDuration) * 100));
      stepIdx++;
      if (stepIdx < BUILD_STEPS.length) {
        setTimeout(tick, BUILD_STEPS[stepIdx - 1].duration);
      } else {
        setTimeout(() => {
          setDone(true);
          setProgress(100);
          setTimeout(onComplete, 600);
        }, BUILD_STEPS[stepIdx - 1].duration);
      }
    };

    const start = setTimeout(tick, 200);
    return () => clearTimeout(start);
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl animate-fade-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-5xl">
            {done ? '✅' : BUILD_STEPS[currentStep]?.icon ?? '🔨'}
          </div>
          {!done && (
            <div className="absolute inset-0 rounded-2xl border-2 border-cardinal/40 animate-ping" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {done ? 'Dashboard Ready!' : 'Building your dashboard...'}
        </h2>
        <p className="text-slate-400 text-sm">
          {done ? 'Everything looks great. Launching preview...' : BUILD_STEPS[currentStep]?.label}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-500 text-xs">Progress</span>
          <span className="text-slate-300 text-xs font-mono font-semibold">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cardinal to-gold rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step checklist */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {BUILD_STEPS.map((step, i) => {
          const isComplete = i < currentStep || done;
          const isCurrent = i === currentStep && !done;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 px-4 py-3 border-b border-slate-700 last:border-0 transition-all duration-300 ${
                isCurrent ? 'bg-slate-700/50' : ''
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                isComplete
                  ? 'bg-emerald-500/20'
                  : isCurrent
                  ? 'bg-cardinal/20'
                  : 'bg-slate-700'
              }`}>
                {isComplete ? (
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-cardinal animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                )}
              </div>
              <span className="text-sm mr-2">{step.icon}</span>
              <span className={`text-sm transition-colors duration-300 ${
                isComplete ? 'text-slate-400 line-through decoration-slate-600' : isCurrent ? 'text-slate-200 font-medium' : 'text-slate-600'
              }`}>
                {step.label}
              </span>
              {isCurrent && (
                <div className="ml-auto flex gap-1">
                  {[0, 1, 2].map(j => (
                    <div key={j} className="w-1 h-1 rounded-full bg-cardinal animate-pulse" style={{ animationDelay: `${j * 150}ms` }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
