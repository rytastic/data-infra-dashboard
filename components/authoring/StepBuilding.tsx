'use client';

import { useState, useEffect } from 'react';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';

const BUILD_STEPS = [
  { label: 'Selecting optimal layout',    icon: '🎨', duration: 800 },
  { label: 'Pulling data statistics',     icon: '📥', duration: 700 },
  { label: 'Rendering trend chart',       icon: '📈', duration: 700 },
  { label: 'Building leaderboard',        icon: '📋', duration: 600 },
  { label: 'Generating comparison charts',icon: '📊', duration: 600 },
  { label: 'Final polish',                icon: '✨', duration: 500 },
];

function DashboardIllustration() {
  return (
    <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 200, height: 129 }}>
      {/* Background card */}
      <rect width="280" height="180" rx="12" fill="#f8fafc"/>
      <rect width="280" height="180" rx="12" fill="white" fillOpacity="0.6"/>

      {/* Top header bar */}
      <rect x="0" y="0" width="280" height="32" rx="12" fill="#f1f5f9"/>
      <rect x="14" y="10" width="40" height="12" rx="3" fill="#94a3b8"/>
      <rect x="62" y="10" width="30" height="12" rx="3" fill="#cbd5e1"/>
      <rect x="100" y="10" width="30" height="12" rx="3" fill="#cbd5e1"/>
      <rect x="230" y="8" width="36" height="16" rx="8" fill="#3b82f6" fillOpacity="0.15"/>
      <rect x="238" y="13" width="20" height="6" rx="2" fill="#3b82f6"/>

      {/* 3 stat cards row */}
      <rect x="12" y="42" width="76" height="44" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
      <rect x="20" y="50" width="28" height="6" rx="2" fill="#cbd5e1"/>
      <rect x="20" y="60" width="44" height="16" rx="3" fill="#3b82f6" fillOpacity="0.15"/>
      <rect x="22" y="65" width="24" height="6" rx="2" fill="#3b82f6"/>

      <rect x="98" y="42" width="76" height="44" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
      <rect x="106" y="50" width="28" height="6" rx="2" fill="#cbd5e1"/>
      <rect x="106" y="60" width="44" height="16" rx="3" fill="#10b981" fillOpacity="0.12"/>
      <rect x="108" y="65" width="24" height="6" rx="2" fill="#10b981"/>

      <rect x="184" y="42" width="84" height="44" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
      <rect x="192" y="50" width="28" height="6" rx="2" fill="#cbd5e1"/>
      <rect x="192" y="60" width="44" height="16" rx="3" fill="#f59e0b" fillOpacity="0.12"/>
      <rect x="194" y="65" width="24" height="6" rx="2" fill="#f59e0b"/>

      {/* Line chart area */}
      <rect x="12" y="96" width="160" height="72" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
      <line x1="12" y1="126" x2="172" y2="126" stroke="#f1f5f9" strokeWidth="1"/>
      <line x1="12" y1="146" x2="172" y2="146" stroke="#f1f5f9" strokeWidth="1"/>
      <polyline points="22,158 46,142 70,148 94,132 118,136 142,124 162,118" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="22,162 46,158 70,160 94,154 118,156 142,152 162,150" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="20" y="102" width="40" height="6" rx="2" fill="#cbd5e1"/>

      {/* Bar chart area */}
      <rect x="182" y="96" width="86" height="72" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
      <rect x="190" y="102" width="32" height="6" rx="2" fill="#cbd5e1"/>
      {[
        { x: 192, h: 30 }, { x: 206, h: 44 }, { x: 220, h: 22 },
        { x: 234, h: 50 }, { x: 248, h: 36 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={168 - b.h} width="10" height={b.h} rx="2"
          fill="#3b82f6" fillOpacity={0.5 + i * 0.1}/>
      ))}
    </svg>
  );
}

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
      {/* Static dashboard illustration */}
      <div className="flex justify-center mb-5">
        <div
          className="rounded-2xl overflow-hidden shadow-md"
          style={{ border: '1px solid #e2e8f0' }}
        >
          <DashboardIllustration />
        </div>
      </div>

      {/* Title + subtitle */}
      <div className="text-center mb-5">
        <h2 className="text-2xl font-normal text-foreground mb-2 tracking-[0px]">
          {done ? 'Dashboard Ready!' : 'Building your dashboard...'}
        </h2>
        <p className="text-sm tracking-[0.25px] text-slate-500">
          {done ? 'Everything looks great. Launching preview...' : BUILD_STEPS[currentStep]?.label}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <ProgressBar label="Progress" value={progress} hasValueLabel />
      </div>

      {/* Notification */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl mb-6"
        style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
      >
        <svg className="w-4 h-4 text-[#3b82f6] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <p className="text-xs text-[#1d4ed8] leading-relaxed">
          Creating this dashboard could take several minutes. We&apos;ll send you a G-chat when the dashboard is complete.
        </p>
      </div>

      {/* Build steps list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {BUILD_STEPS.map((step, i) => {
          const isComplete = i < currentStep || done;
          const isCurrent  = i === currentStep && !done;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 transition-all duration-300 px-4 py-3 ${
                i < BUILD_STEPS.length - 1 ? 'border-b border-slate-100' : ''
              } ${isCurrent ? 'bg-accent-muted' : ''}`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isComplete ? '' : isCurrent ? 'bg-accent' : 'bg-slate-200'
                }`}
                style={isComplete ? { background: 'oklch(0.88 0.09 152)' } : undefined}
              >
                {isComplete ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'oklch(0.35 0.14 152)' }}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full animate-pulse bg-white"/>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-400 opacity-40"/>
                )}
              </div>

              <span className="text-sm mr-1">{step.icon}</span>

              <span
                className={`text-sm transition-colors duration-300 tracking-[0.25px] ${
                  isComplete ? 'text-slate-500 line-through' : isCurrent ? 'text-accent' : 'text-slate-500 opacity-50'
                }`}
              >
                {step.label}
              </span>

              {isCurrent && (
                <div className="ml-auto flex gap-1">
                  {[0, 1, 2].map(j => (
                    <div key={j} className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${j * 150}ms` }}/>
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
