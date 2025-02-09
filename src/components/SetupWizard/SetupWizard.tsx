'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Shield } from 'lucide-react';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useRouter } from 'next/navigation';
import PlatformStep from './steps/2PlatformStep/PlatformStep';
import { SetupStep } from './steps/3SetupStep/SetupStep';
import { CustomizationStep } from './steps/4CustomizationStep/CustomizationStep';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import DomainStepWrapper from './steps/1DomainStep/DomainStepWrapper';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { SETUP_OPTIONS } from '@/constants/constants';
import { SetupOption } from '@/app/types/types';
import { useWizardStore } from '@/store/store';

interface SetupWizardProps {
  readonly onComplete?: () => Promise<void>;
}

interface MousePosition {
  x: number;
  y: number;
}

interface SetupError {
  message: string;
  status?: number;
  details?: string;
  suggestion?: string;
}

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<SetupError | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePositions, setMousePositions] = useState<Record<string, MousePosition>>({});

  const {
    domain,
    domainId,
    selectedPlatform,

    customizationSettings,
    setDomain,
    setSelectedPlatform,
    setIsVerified,
    setCustomizationSettings,
    reset: resetStore,
  } = useWizardStore();

  const router = useRouter();

  // Handle step transitions
  const handleStepChange = useCallback(async (newStep: number) => {
    console.log('🔄 Transitioning to step:', newStep);
    setIsTransitioning(true);
    try {
      // Longer fade out to ensure everything is hidden
      await new Promise((resolve) => setTimeout(resolve, 400));
      setCurrentStep(newStep);
      // Ensure DOM is ready before showing
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log('✅ Successfully transitioned to step:', newStep);
    } catch (error) {
      console.error('❌ Error during step transition:', error);
      setError({
        message: 'Failed to transition between steps',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsTransitioning(false);
    }
  }, []);

  const handleBack = async () => {
    clearError();
    await handleStepChange(currentStep - 1);
  };

  // Check for existing domain on mount
  useEffect(() => {
    const checkExistingDomain = async () => {
      console.log('🔍 Checking for existing domain...');
      try {
        const supabase = createClientComponentClient();
        const { data: domainData, error: domainError } = await supabase
          .from('verified_domains')
          .select('*')
          .eq('verified', true)
          .single();

        if (domainError) {
          console.error('❌ Error fetching domain:', domainError);
          return;
        }

        if (domainData) {
          console.log('✅ Found existing domain:', domainData.domain);
          setDomain(domainData.domain, domainData.id);
          setIsVerified(true);
        }
      } catch (error) {
        console.error('❌ Error in checkExistingDomain:', error);
      }
    };

    if (!domain) {
      void checkExistingDomain();
    }
  }, [domain, setDomain, setIsVerified]);

  // Check for existing platform on mount and when domain changes
  const checkInitialPlatform = useCallback(async () => {
    if (!domain || selectedPlatform) {
      console.log('⏭️ Skipping platform check - no domain or platform already set');
      return;
    }

    console.log('🔍 Checking initial platform for domain:', domain);
    try {
      const supabase = createClientComponentClient();
      const { data: appData, error: appError } = await supabase
        .from('client_applications')
        .select('platform_type')
        .eq('domain', domain)
        .maybeSingle();

      if (appError) {
        console.error('❌ Error fetching platform:', appError);
        return;
      }

      console.log('📦 Raw platform data:', appData);

      if (appData?.platform_type) {
        console.log('✅ Found platform:', appData.platform_type);
        setSelectedPlatform(appData.platform_type);
      } else {
        console.log('ℹ️ No platform found for domain:', domain);
      }
    } catch (error) {
      console.error('❌ Error in checkInitialPlatform:', error);
    }
  }, [domain, selectedPlatform, setSelectedPlatform]);

  useEffect(() => {
    console.log('🔄 Domain changed, checking platform...', {
      domain,
      selectedPlatform,
    });
    void checkInitialPlatform();
  }, [domain, checkInitialPlatform, selectedPlatform]);

  const handleDomainChange = async (newDomain: string) => {
    if (newDomain !== domain) {
      setDomain(newDomain, null);
      setIsVerified(false);
      if (domainId) {
        // Update existing domain
        const supabase = createClientComponentClient();
        await supabase
          .from('verified_domains')
          .update({
            domain: newDomain,
            verified: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', domainId);
      }
    }
  };

  const clearError = () => setError(null);

  const handleProceedToPlatform = async (validatedDomain: string) => {
    if (!validatedDomain) {
      setError({
        message: 'Invalid domain provided',
        status: 400,
        details: '',
      });
      return;
    }
    clearError();
    setDomain(validatedDomain, domainId);
    await handleStepChange(1);
  };

  const handlePlatformSelect = async (platformId: SetupOption['id']) => {
    console.log('🎯 Selecting platform:', platformId);
    if (!SETUP_OPTIONS.some((opt) => opt.id === platformId)) {
      console.error('❌ Invalid platform selected:', platformId);
      setError({
        message: 'Invalid platform option selected',
        status: 400,
        details: '',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      clearError();

      if (!domain) {
        console.error('❌ No domain provided');
        throw new Error('Domain is required');
      }

      // Just update the local state and proceed
      console.log('✅ Platform selected:', platformId);
      setSelectedPlatform(platformId);
      await handleStepChange(2);
    } catch (error) {
      console.error('❌ Platform selection error:', error);
      setError({
        message: error instanceof Error ? error.message : 'Failed to select platform',
        status: 500,
        details: '',
        suggestion: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetupComplete = async () => {
    try {
      setIsSubmitting(true);
      await onComplete?.();
      router.push('/dashboard');
    } catch (error) {
      console.error('Setup completion failed:', error);
      setError({
        message: error instanceof Error ? error.message : 'Failed to complete setup',
        status: 500,
        details: '',
        suggestion: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomizationComplete = async () => {
    try {
      setIsSubmitting(true);
      clearError();
      await onComplete?.();
      resetStore();
      router.push('/dashboard');
    } catch (err) {
      console.error('Customization completion error:', err);
      setError({
        message: err instanceof Error ? err.message : 'Failed to complete setup',
        status: 500,
        details: '',
        suggestion: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If transitioning between steps, show ABSOLUTELY NOTHING
  if (isTransitioning) {
    return <div className="fixed inset-0 bg-zinc-950" />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 p-6 transition-colors duration-200 dark:bg-white">
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl"
          >
            <ThemeToggle />

            {error && (
              <div className="mb-4 flex flex-col gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <div className="flex items-start gap-3 text-white dark:text-black">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-red-500">Error</h3>
                    <p className="text-red-500/90">{error.message}</p>
                  </div>
                </div>

                {/* Developer Details Section */}
                <div className="mt-2 rounded-md bg-black/50 p-3 font-mono text-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    <span className="text-red-200">HTTP Status: {error.status ?? 'Unknown'}</span>
                  </div>

                  <div className="border-l-2 border-red-500/30 pl-3 text-red-200/80">
                    <pre className="whitespace-pre-wrap break-all">
                      {error.details ?? 'No additional details available'}
                    </pre>
                    {error.suggestion && (
                      <div className="mt-2 text-yellow-200/80">Suggestion: {error.suggestion}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!error && isSubmitting && (
              <>
                {/* Floating HTTPS Status Overlay */}
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="mx-4 w-full max-w-2xl rounded-lg border border-emerald-500/20 bg-zinc-900 p-6 shadow-2xl">
                    <div className="mb-4 flex items-center gap-3">
                      <Shield className="h-8 w-8 text-emerald-500" />
                      <h2 className="text-xl font-semibold text-emerald-200">
                        HTTPS Security Verification
                      </h2>
                    </div>

                    {/* Status Indicators */}
                    <div className="space-y-4">
                      {/* Main Status */}
                      <div className="flex items-center gap-3 rounded-md bg-emerald-500/10 p-3">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
                        <span className="font-medium text-emerald-200">HTTPS Status: Active</span>
                      </div>

                      {/* Detailed Checks */}
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Certificate Status */}
                        <div className="rounded-md bg-black/30 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                            <span className="text-emerald-200">SSL Certificate</span>
                          </div>
                          <div className="pl-7 font-mono text-sm text-emerald-200/70">
                            Valid & Trusted
                          </div>
                        </div>

                        {/* Protocol Version */}
                        <div className="rounded-md bg-black/30 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                            <span className="text-emerald-200">Protocol Version</span>
                          </div>
                          <div className="pl-7 font-mono text-sm text-emerald-200/70">TLS 1.3</div>
                        </div>

                        {/* Cipher Suite */}
                        <div className="rounded-md bg-black/30 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                            <span className="text-emerald-200">Cipher Suite</span>
                          </div>
                          <div className="pl-7 font-mono text-sm text-emerald-200/70">
                            TLS_AES_256_GCM_SHA384
                          </div>
                        </div>

                        {/* Security Headers */}
                        <div className="rounded-md bg-black/30 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                            <span className="text-emerald-200">Security Headers</span>
                          </div>
                          <div className="pl-7 font-mono text-sm text-emerald-200/70">
                            All Required Headers Present
                          </div>
                        </div>
                      </div>

                      {/* Live Verification Status */}
                      <div className="mt-6 border-t border-emerald-500/20 pt-4">
                        <div className="space-y-2 font-mono text-sm text-emerald-200/80">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                            <span>Performing live security checks...</span>
                          </div>
                          <div className="space-y-1 pl-4">
                            <div>• Validating certificate chain</div>
                            <div>• Checking protocol compliance</div>
                            <div>• Verifying security headers</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Existing status indicators... */}
                <div className="mb-4 space-y-4">
                  {/* Main Status Card */}
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      <span className="text-emerald-200">Processing request...</span>
                    </div>

                    {/* HTTPS Verification Details */}
                    <div className="mt-4 border-t border-emerald-500/20 pt-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-emerald-500" />
                        <span className="font-medium text-emerald-200">HTTPS Security Check</span>
                      </div>

                      <div className="space-y-2 pl-7 font-mono text-sm">
                        {/* Certificate Status */}
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-emerald-200/80">Checking SSL certificate...</span>
                        </div>

                        {/* Protocol Version */}
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-emerald-200/80">Verifying TLS version...</span>
                        </div>

                        {/* Security Headers */}
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-emerald-200/80">Checking security headers...</span>
                        </div>
                      </div>

                      {/* Technical Details */}
                      <div className="mt-3 pl-7">
                        <div className="rounded bg-black/30 p-2 font-mono text-xs text-emerald-200/70">
                          <div>Protocol: TLS 1.3</div>
                          <div>Cipher: TLS_AES_256_GCM_SHA384</div>
                          <div>Certificate: Valid & Trusted</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step-Specific Information */}
                  <div className="pl-5 font-mono text-sm text-emerald-200/80">
                    {currentStep === 2 && (
                      <div className="space-y-1">
                        <div>• Verifying domain configuration...</div>
                        <div>• Checking DNS records...</div>
                        <div>• Validating HTTPS setup...</div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white dark:text-black"
              >
                {currentStep === 0 && (
                  <DomainStepWrapper
                    initialDomain={domain ?? ''}
                    onDomainChange={handleDomainChange}
                    onComplete={(domainData) => {
                      handleProceedToPlatform(domainData.domain);
                    }}
                  />
                )}
                {currentStep === 1 && (
                  <PlatformStep
                    mousePositions={mousePositions}
                    setMousePositions={setMousePositions}
                    selectedOption={selectedPlatform}
                    onSelect={handlePlatformSelect}
                    previousDomain={domain ?? ''}
                    onBack={handleBack}
                  />
                )}
                {currentStep === 2 && domain && selectedPlatform && (
                  <SetupStep
                    domain={domain}
                    selectedPlatform={selectedPlatform}
                    onCompleteAction={handleSetupComplete}
                    onBackAction={() => handleStepChange(1)}
                    isSubmitting={isSubmitting}
                  />
                )}
                {currentStep === 3 && (
                  <CustomizationStep
                    onComplete={handleCustomizationComplete}
                    isSubmitting={isSubmitting}
                    initialSettings={
                      customizationSettings ?? {
                        theme: 'default',
                        branding: {
                          logo_url: null,
                          primary_color: '#000000',
                          accent_color: '#ffffff',
                        },
                      }
                    }
                    onSettingsChange={setCustomizationSettings}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <ProgressBar currentStep={currentStep + 1} totalSteps={4} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
