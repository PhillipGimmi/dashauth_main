import React, { useState, useEffect } from 'react';
import { DomainStep } from './DomainStep';
import { DomainVerificationStep } from './DomainVerificationStep';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion, AnimatePresence } from 'framer-motion';

interface DomainStepWrapperProps {
  readonly onComplete: (domain: { domain: string; id: string; platform_type: string }) => void;
  readonly initialDomain?: string;
  readonly onDomainChange?: (domain: string) => Promise<void>;
}

interface VerificationPromptProps {
  isOpen: boolean;
  domain: string;
  isLoading: boolean;
  onVerifyNow: () => void;
  onVerifyLater: () => void;
  onClose: () => void;
}

const VerificationPrompt: React.FC<VerificationPromptProps> = ({
  isOpen,
  domain,
  isLoading,
  onVerifyNow,
  onVerifyLater,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-[400px]"
        >
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-lg bg-white/10 blur-sm dark:bg-black/10" />
            <div className="relative rounded-lg bg-zinc-900 p-6 ring-1 ring-white/10 dark:bg-white dark:ring-black/10">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-center text-xl font-bold text-white dark:text-black"
              >
                Verify {domain}?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 text-center text-zinc-400 dark:text-gray-600"
              >
                Would you like to verify your domain configuration now or continue and verify later?
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <button
                  onClick={onVerifyLater}
                  className="group relative w-full px-4 py-2.5 font-medium text-slate-100 transition-colors duration-[400ms] hover:text-white dark:text-slate-800 dark:hover:text-black"
                >
                  <span>Verify Later</span>
                  <span className="absolute left-0 top-0 h-[2px] w-0 bg-white transition-all duration-100 group-hover:w-full dark:bg-black" />
                  <span className="absolute right-0 top-0 h-0 w-[2px] bg-white transition-all delay-100 duration-100 group-hover:h-full dark:bg-black" />
                  <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white transition-all delay-200 duration-100 group-hover:w-full dark:bg-black" />
                  <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-white transition-all delay-300 duration-100 group-hover:h-full dark:bg-black" />
                </button>

                <button
                  onClick={onVerifyNow}
                  className={`relative z-0 flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md border-[1px] 
                  border-zinc-800 px-4 py-2.5 font-medium text-neutral-300 transition-all duration-300 before:absolute before:inset-0
                  before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%] before:bg-white
                  before:transition-transform before:duration-1000 before:content-['']
                  hover:scale-105
                  hover:border-white hover:text-neutral-900 hover:before:translate-y-[0%]
                  active:scale-100 dark:border-gray-300 dark:text-gray-700 dark:before:bg-black dark:hover:border-black
                  dark:hover:text-white ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="relative z-10">{isLoading ? 'Verifying...' : 'Verify Now'}</span>
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function DomainStepWrapper({
  onComplete,
  initialDomain = '',
  onDomainChange,
}: DomainStepWrapperProps) {
  const [domain, setDomain] = useState(initialDomain);
  const [domainId, setDomainId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [verificationData, setVerificationData] = useState<{
    verification_token: string;
    status: 'pending' | 'verified' | 'failed';
    verification_method: 'dns';
  } | null>(null);
  const [platformType, setPlatformType] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingDomain, setPendingDomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing domain and platform data from database
  useEffect(() => {
    const loadDomainAndPlatform = async () => {
      if (!initialDomain) return;

      try {
        const supabase = createClientComponentClient();

        // Get client application data directly
        const { data: clientApp, error } = await supabase
          .from('client_applications')
          .select('id, domain, platform_type, domain_verified_at')
          .eq('domain', initialDomain)
          .maybeSingle();

        if (error) {
          console.error('Failed to fetch client application:', error);
          return;
        }

        if (clientApp) {
          setDomain(clientApp.domain);
          setDomainId(clientApp.id);
          setPlatformType(clientApp.platform_type);

          if (clientApp.domain_verified_at) {
            onComplete({
              domain: clientApp.domain,
              id: clientApp.id,
              platform_type: clientApp.platform_type,
            });
          }
        }
      } catch (error) {
        console.error('Failed to load domain data:', error);
      }
    };

    void loadDomainAndPlatform();
  }, [initialDomain, onComplete]);

  const handleDomainSubmit = async (submittedDomain: string) => {
    try {
      setError(undefined);
      const normalizedDomain = submittedDomain.toLowerCase();

      // Store the domain and show verification prompt
      setPendingDomain(normalizedDomain);
      setShowVerification(true);
    } catch (error) {
      console.error('Domain submission failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to process domain');
      throw error;
    }
  };

  const handleVerifyNow = async () => {
    if (!pendingDomain) return;

    setIsLoading(true);
    try {
      // Create initial verification data to show verification page immediately
      setVerificationData({
        verification_token: '', // Will be updated after API call
        status: 'pending',
        verification_method: 'dns',
      });

      const supabase = createClientComponentClient();
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error('Failed to get current user');
      }
      const user = await response.json();

      // Check both verified_domains and client_applications tables
      const [verifiedDomainsResult, clientAppsResult] = await Promise.all([
        supabase.from('verified_domains').select('*').eq('domain', pendingDomain).maybeSingle(),
        supabase.from('client_applications').select('*').eq('domain', pendingDomain).maybeSingle(),
      ]);

      // Handle any database errors
      if (verifiedDomainsResult.error) {
        console.error('Verified domains query error:', verifiedDomainsResult.error);
        throw new Error('Failed to check domain status');
      }

      if (clientAppsResult.error) {
        console.error('Client applications query error:', clientAppsResult.error);
        throw new Error('Failed to check domain status');
      }

      const existingVerifiedDomain = verifiedDomainsResult.data;
      const existingClientApp = clientAppsResult.data;

      // Case 1: Domain exists in verified_domains
      if (existingVerifiedDomain) {
        // If owned by another user, block
        if (existingVerifiedDomain.user_id !== user.id && existingVerifiedDomain.verified) {
          throw new Error('This domain has already been verified by another user');
        }

        // Use existing verification data if it exists
        setVerificationData({
          verification_token: existingVerifiedDomain.verification_token,
          status: existingVerifiedDomain.status,
          verification_method: existingVerifiedDomain.verification_method,
        });
        setDomainId(existingVerifiedDomain.id);
        return;
      }

      // Case 2: Domain exists in client_applications
      if (existingClientApp) {
        if (existingClientApp.user_id !== user.id) {
          throw new Error('This domain is already registered in an existing application');
        }
      }

      // Create new domain verification record only if it doesn't exist
      const verificationToken = crypto.randomUUID();
      const { data: newDomain, error: createError } = await supabase
        .from('verified_domains')
        .insert({
          domain: pendingDomain,
          verification_token: verificationToken,
          status: 'pending' as const,
          verification_method: 'dns' as const,
          user_id: user.id,
          verified: false,
          verification_attempts: 0,
          metadata: {
            initial_request: {
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
            },
            verification_instructions: {
              record_name: '_dashauth',
              record_type: 'TXT',
              record_value: verificationToken,
            },
          },
          settings: {},
          risk_level: 'low',
          data_classification: 'public',
          active: true,
        })
        .select()
        .single();

      if (createError) {
        console.error('Domain creation error:', createError);
        throw new Error('Failed to initiate domain verification');
      }

      setVerificationData({
        verification_token: verificationToken,
        status: 'pending',
        verification_method: 'dns',
      });
      setDomainId(newDomain.id);
    } catch (error) {
      console.error('Verification setup failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to setup verification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLater = async () => {
    setShowVerification(false);
    if (!pendingDomain) return;

    // Notify parent of domain change if needed
    if (onDomainChange) {
      await onDomainChange(pendingDomain);
    }

    // Proceed without verification
    onComplete({
      domain: pendingDomain,
      id: domainId ?? crypto.randomUUID(),
      platform_type: platformType ?? 'unknown',
    });
  };

  return (
    <div>
      {!verificationData && showVerification ? (
        <VerificationPrompt
          isOpen={true}
          domain={pendingDomain ?? ''}
          isLoading={isLoading}
          onVerifyNow={handleVerifyNow}
          onVerifyLater={handleVerifyLater}
          onClose={() => setShowVerification(false)}
        />
      ) : verificationData ? (
        <DomainVerificationStep
          domain={pendingDomain ?? ''}
          verificationData={verificationData}
          isVerified={verificationData?.status === 'verified'}
          onSkip={async () => {
            if (!pendingDomain) return;

            if (onDomainChange) {
              await onDomainChange(pendingDomain);
            }

            onComplete({
              domain: pendingDomain,
              id: domainId ?? crypto.randomUUID(),
              platform_type: platformType ?? 'unknown',
            });
          }}
          onBack={() => {
            setVerificationData(null);
            setShowVerification(true);
            setError(undefined);
            setDomainId(null);
          }}
          initialError={error}
        />
      ) : (
        <DomainStep initialValue={domain} onProceedAction={handleDomainSubmit} />
      )}
    </div>
  );
}
