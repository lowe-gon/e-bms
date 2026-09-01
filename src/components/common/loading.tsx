'use client';

import { cn } from '@/lib/utils';
import { Building2, CheckCircle2, FileText, Lock, Users } from 'lucide-react';
import React from 'react';

export interface IInitStep {
  id: number;
  title: string;
  desc: string;
  icon?: React.ElementType;
}

interface ILoadingScreenProps {
  onComplete?: () => void;
  customMessage?: string;
  customSubtext?: string;
  durationMs?: number;
  isOverlay?: boolean;
  customSteps?: IInitStep[];
  badgeText?: string;
}

export const DEFAULT_INIT_STEPS: IInitStep[] = [
  {
    id: 1,
    title: 'Connecting to Portal',
    desc: 'Establishing secure session...',
    icon: Lock,
  },
  {
    id: 2,
    title: 'Loading Resident Records',
    desc: 'Retrieving citizen registry...',
    icon: Users,
  },
  {
    id: 3,
    title: 'Syncing Barangay Services',
    desc: 'Preparing clearances and documents...',
    icon: FileText,
  },
  {
    id: 4,
    title: 'Ready',
    desc: 'Opening your dashboard...',
    icon: CheckCircle2,
  },
];

export const ZERO_USER_STEPS: IInitStep[] = [
  {
    id: 1,
    title: 'Setting up Barangay Portal',
    desc: 'Initializing local database...',
    icon: Building2,
  },
  {
    id: 2,
    title: 'Creating Administrator Account',
    desc: 'Registering official credentials...',
    icon: Users,
  },
  {
    id: 3,
    title: 'Setup Complete',
    desc: 'Redirecting to your workspace...',
    icon: CheckCircle2,
  },
];

export function LoadingScreen({
  onComplete,
  customMessage,
  customSubtext,
  durationMs = 2000,
  isOverlay = false,
  customSteps,
  badgeText,
}: ILoadingScreenProps) {
  const steps = customSteps && customSteps.length > 0 ? customSteps : DEFAULT_INIT_STEPS;
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [isFinishing, setIsFinishing] = React.useState(false);

  React.useEffect(() => {
    const stepDuration = durationMs / (steps.length + 1);

    const stepTimer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next < steps.length) {
          return next;
        } else {
          clearInterval(stepTimer);
          return prev;
        }
      });
    }, stepDuration);

    const completionTimer = setTimeout(() => {
      setIsFinishing(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 300);
    }, durationMs + 80);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(completionTimer);
    };
  }, [durationMs, onComplete, steps.length]);

  const activeStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  return (
    <div
      className={cn(
        'bg-background text-foreground relative flex flex-col items-center justify-between p-6 transition-opacity duration-300 select-none sm:p-10',
        isOverlay ? 'fixed inset-0 z-50' : 'min-h-screen',
        isFinishing ? 'opacity-0' : 'opacity-100',
      )}>
      {/* Center Minimal Circular Content */}
      <main className="my-auto flex w-full max-w-sm flex-col items-center space-y-6 text-center">
        {/* Clean circular spinner */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="border-primary absolute inset-0 rounded-full border-2" />
          <div className="border-accent absolute inset-0 animate-spin rounded-full border-2 border-t-transparent" />
          <Building2 className="text-primary h-6 w-6" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          {badgeText && (
            <span className="text-primary mb-1 inline-block text-[11px] font-medium">
              {badgeText}
            </span>
          )}
          <h1 className="text-foreground text-xl font-bold tracking-tight">Barangay Calungboyan</h1>
          <p className="text-foreground text-xs">
            {customMessage || 'e-Barangay Management Portal'}
          </p>
        </div>

        {/* Status Text (No Progress Bar) */}
        <p className="text-muted-foreground animate-pulse text-xs transition-all">
          {customSubtext || activeStep?.desc || activeStep?.title || 'Loading...'}
        </p>
      </main>

      {/* Minimal Footer */}
      <footer className="text-muted-foreground text-center text-[11px]">
        Republic of the Philippines • Municipality of Santa
      </footer>
    </div>
  );
}
