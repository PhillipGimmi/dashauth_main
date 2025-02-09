import React, { useState } from 'react';

import { Paintbrush, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { StepHeader } from '../../StepHeader/StepHeader';

interface CustomizationStepProps {
  readonly onComplete: () => Promise<void>;
  readonly isSubmitting: boolean;
  readonly initialSettings: {
    theme: 'default' | 'custom';
    branding?: {
      logo_url: string | null;
      primary_color: string;
      accent_color: string;
    };
  } | null;
  readonly onSettingsChange: (
    settings: NonNullable<CustomizationStepProps['initialSettings']>
  ) => void;
}

export const CustomizationStep: React.FC<CustomizationStepProps> = ({
  onComplete,
  isSubmitting,
  initialSettings,
  onSettingsChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<'custom' | 'default'>(
    initialSettings?.theme ?? 'default'
  );
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleOptionSelect = (option: 'default' | 'custom') => {
    setSelectedOption(option);
    onSettingsChange({
      theme: option,
      branding: initialSettings?.branding ?? {
        logo_url: null,
        primary_color: '#000000',
        accent_color: '#ffffff',
      },
    });
  };

  const handleComplete = async () => {
    if (isSubmitting) return;

    try {
      setIsError(false);
      setErrorMessage(null);
      console.log('[CustomizationStep] Completing with option:', selectedOption);
      await onComplete();
    } catch (error) {
      console.error('[CustomizationStep] Completion failed:', error);
      setIsError(true);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to save customization preferences.'
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 text-white dark:bg-white dark:text-black">
      <div className="h-full overflow-y-auto">
        <div className="mx-auto min-h-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <StepHeader
            title="Customize Your Integration"
            subtitle="Choose how you want your authentication to look"
            backLabel="Back to Setup"
            showHelp={showHelp}
            onBack={() => {
              console.log('test');
            }}
            onHelp={() => setShowHelp(!showHelp)}
          />

          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <button
                onClick={() => handleOptionSelect('default')}
                disabled={isSubmitting}
                className={`rounded-lg border p-6 backdrop-blur-sm transition-all duration-200 ${
                  selectedOption === 'default'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                  <Paintbrush /> Use Default Components
                </h3>
                <p className="text-sm text-zinc-400">
                  Get started quickly with our pre-built, customizable authentication components
                </p>
              </button>

              <button
                onClick={() => handleOptionSelect('custom')}
                disabled={isSubmitting}
                className={`rounded-lg border p-6 backdrop-blur-sm transition-all duration-200 ${
                  selectedOption === 'custom'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                  <Paintbrush /> Custom Implementation
                </h3>
                <p className="text-sm text-zinc-400">
                  Build your own UI components using our authentication hooks and utilities
                </p>
              </button>
            </div>

            {isError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-500">{errorMessage}</p>
              </div>
            )}

            <div className="flex items-center justify-end pt-6">
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <ArrowRight className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Complete Step</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
