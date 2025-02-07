import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Copy, Check, CheckCircleIcon, XCircleIcon, ChevronDownIcon } from 'lucide-react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { StepHeader } from '../../StepHeader/StepHeader';

import { TooltipProvider, TooltipTrigger, Tooltip } from '@/components/Tooltip';

import { DNS_PROVIDERS, DOMAIN_VERIFICATION_FAQ } from '@/data/faqData';

type VerificationStep =
  | 'idle'
  | 'fetching'
  | 'checking_txt'
  | 'verifying_match'
  | 'complete'
  | 'error';

interface DnsRecord {
  type: string;
  name: string;
  data: string;
}

interface DnsVerifyResponse {
  success: boolean;
  records: DnsRecord[];
  error?: string;
  details?: {
    message: string;
    details: string;
    attempts?: Array<{
      type: string;
      domain: string;
      success: boolean;
      errors?: Array<{
        provider: string;
        error: string;
      }>;
      records?: string[];
    }>;
  };
  _debug?: {
    rawLookup: string[][] | { error: string };
    timestamp: string;
    resolvers: {
      system: string[];
      google: string[];
      cloudflare: string[];
    };
  };
}

interface VerificationDetails {
  message: string;
  details: string;
  attempts?: Array<{
    type: string;
    domain: string;
    success: boolean;
    errors?: Array<{
      provider: string;
      error: string;
    }>;
    records?: string[];
  }>;
}

interface DomainVerificationStepProps {
  domain: string;
  verificationData: {
    verification_token: string;
    status: 'pending' | 'verified' | 'failed';
    verification_method: 'dns';
    id?: string;
    user_id?: string;
    domain?: string;
    verified?: boolean;
    verification_attempts?: number;
    last_verification_attempt?: string;
    verification_error?: string;
    metadata?: {
      initial_request?: {
        timestamp: string;
        ip_address: string;
        user_agent: string;
      };
      verification_instructions?: {
        record_name: string;
        record_type: string;
        record_value: string;
      };
    };
  };
  isVerified: boolean;
  onSkip: () => void;
  onBack: () => void;
  initialError?: string;
}

interface DnsProvider {
  name: string;
  category: string;
  instructions?: string;
  steps?: string[];
  propagationTime?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const AnimatedTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    className={`
      z-50 overflow-hidden rounded-lg 
      border border-zinc-800/50 
      bg-zinc-900/95 shadow-xl
      backdrop-blur-sm dark:border-zinc-200/50 dark:bg-zinc-100/95
      ${className}
    `}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-[280px] p-3 text-sm text-zinc-100 dark:text-zinc-900 sm:max-w-[320px]"
    >
      {children}
    </motion.div>
  </TooltipPrimitive.Content>
));
AnimatedTooltipContent.displayName = 'AnimatedTooltipContent';

const VerificationSteps: React.FC<{
  currentStep: VerificationStep;
  error?: string;
  details?: VerificationDetails;
  verificationResponse?: DnsVerifyResponse;
  isVerified: boolean;
}> = ({ currentStep, error, details, verificationResponse, isVerified }) => {
  const [showDetails, setShowDetails] = useState(false);

  const steps = [
    {
      key: 'fetching',
      label: 'Fetching DNS Records',
      tooltip:
        'We are querying multiple DNS providers to fetch the TXT records for your domain. This ensures we can verify your domain across different DNS networks.',
    },
    {
      key: 'checking_txt',
      label: 'Checking TXT Records',
      tooltip:
        "We are looking for the specific _dashauth TXT record in your domain's DNS records. This record proves your ownership of the domain.",
    },
    {
      key: 'verifying_match',
      label: 'Verifying Record Match',
      tooltip:
        'We are comparing the verification token in your TXT record with our expected value to confirm domain ownership.',
    },
    {
      key: 'complete',
      label: 'Completing Verification',
      tooltip:
        'Final step to confirm all checks have passed and update your domain verification status.',
    },
  ];

  const getStepStatus = (step: string) => {
    const stepOrder = ['fetching', 'checking_txt', 'verifying_match', 'complete'];
    const currentStepIndex = stepOrder.indexOf(currentStep);
    const thisStepIndex = stepOrder.indexOf(step);

    // Track success/failure state for each step
    const stepStates = {
      fetching: {
        completed: verificationResponse?.success ?? false,
        failed: verificationResponse?.success === false,
      },
      checking_txt: {
        completed: (verificationResponse?.records?.length ?? 0) > 0,
        failed:
          verificationResponse &&
          (!verificationResponse.records || verificationResponse.records.length === 0),
      },
      verifying_match: {
        completed:
          verificationResponse?.records?.some(
            (record: DnsRecord) => record.name.includes('_dashauth') && record.type === 'TXT'
          ) ?? false,
        failed:
          verificationResponse?.records?.every(
            (record: DnsRecord) => !record.name.includes('_dashauth') || record.type !== 'TXT'
          ) ?? false,
      },
      complete: {
        completed: isVerified,
        failed: error?.includes('TXT record value does not match') ?? false,
      },
    };

    const currentState = stepStates[step as keyof typeof stepStates];

    // Return status based on step state
    if (currentState.failed || (step === 'complete' && error)) {
      return 'error';
    }
    if (currentState.completed) {
      return 'complete';
    }
    if (step === currentStep) {
      return 'current';
    }
    if (thisStepIndex > currentStepIndex) {
      return 'pending';
    }
    return 'pending';
  };

  return (
    <div className="space-y-4">
      <motion.div
        className="space-y-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {steps.map(({ key, label, tooltip }) => {
          const status = getStepStatus(key);
          return (
            <TooltipProvider key={key} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="group relative flex items-center space-x-3 rounded-md p-2 hover:bg-zinc-800/50 dark:hover:bg-zinc-200/50"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    {status === 'complete' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </motion.div>
                    )}
                    {status === 'current' && (
                      <motion.div
                        className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}
                    {status === 'error' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      </motion.div>
                    )}
                    {status === 'pending' && (
                      <div className="h-5 w-5 rounded-full border-2 border-zinc-300" />
                    )}
                    <span
                      className={
                        status === 'current'
                          ? 'font-medium'
                          : status === 'error'
                            ? 'text-red-500'
                            : status === 'complete'
                              ? 'text-green-500'
                              : 'text-zinc-500'
                      }
                    >
                      {label}
                    </span>
                  </motion.div>
                </TooltipTrigger>
                <AnimatedTooltipContent>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    <p className="font-medium">{label}</p>
                    <p className="leading-relaxed text-zinc-400 dark:text-zinc-600">{tooltip}</p>
                  </motion.div>
                </AnimatedTooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </motion.div>

      {error && (
        <div className="mt-4">
          <div className="font-medium text-red-500">{error}</div>
          {details && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-2 flex items-center space-x-1 text-sm text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
            >
              <ChevronDownIcon
                className={`h-4 w-4 transform transition-transform ${showDetails ? 'rotate-180' : ''}`}
              />
              <span>Technical Details</span>
            </button>
          )}
          {showDetails && details && (
            <div className="mt-2 space-y-2 rounded-md bg-zinc-900 p-4 text-sm dark:bg-zinc-200">
              <div className="text-zinc-100 dark:text-zinc-900">
                <strong>Details:</strong> {details.details}
                {details.details.includes('Found') && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">Current Value:</span>
                      <code className="rounded bg-zinc-800 px-2 py-0.5 dark:bg-zinc-300">
                        {(() => {
                          const foundMatch = /Found "(.*?)"/.exec(details.details);
                          return foundMatch?.[1] ?? '';
                        })()}
                      </code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Expected Value:</span>
                      <code className="rounded bg-zinc-800 px-2 py-0.5 dark:bg-zinc-300">
                        {(() => {
                          const expectedMatch = /expected "(.*?)"/.exec(details.details);
                          return expectedMatch?.[1] ?? '';
                        })()}
                      </code>
                    </div>
                  </div>
                )}
              </div>
              {details.attempts?.map((attempt, i) => (
                <div key={i} className="ml-2 text-zinc-100 dark:text-zinc-900">
                  <div>
                    <strong>{attempt.type}</strong> lookup for {attempt.domain}:
                  </div>
                  {attempt.success ? (
                    <div className="ml-4 text-green-500">Successful</div>
                  ) : (
                    <div className="ml-4">
                      {attempt.errors?.map((err, j) => (
                        <div key={j} className="text-red-500">
                          {err.provider}: {err.error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AnimatedText = ({ text }: { text: string }) => {
  return (
    <span className="inline-flex">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: i * 0.05,
            ease: [0.33, 1, 0.68, 1],
          }}
          className="font-medium text-white dark:text-black"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const GlowingCard: React.FC<{
  children: React.ReactNode;
  status?: 'success' | 'error';
}> = ({ children, status }) => {
  return (
    <motion.div
      className={`card h-full w-full p-6 ${status ?? ''}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1], // Custom easing for premium feel
      }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.99 }}
      layout // Smooth layout transitions
      layoutId={`card-${status}`} // Smooth transitions between states
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 5000; // 5 seconds

export const DomainVerificationStep: React.FC<DomainVerificationStepProps> = ({
  domain,
  verificationData,
  isVerified,
  onSkip,
  onBack,
  initialError,
}) => {
  const [verificationStep, setVerificationStep] = useState<VerificationStep>('idle');
  const [verificationError, setVerificationError] = useState<string | undefined>(initialError);
  const [verificationDetails, setVerificationDetails] = useState<VerificationDetails | undefined>(
    undefined
  );
  const [verificationResponse, setVerificationResponse] = useState<DnsVerifyResponse | undefined>(
    undefined
  );
  const [showHelp, setShowHelp] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Add state for copy success indicators
  const [copiedStates, setCopiedStates] = useState({
    recordName: false,
    recordValue: false,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowHelp(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVerifyClick = async (): Promise<void> => {
    try {
      setVerificationStep('fetching');
      setVerificationError(undefined);
      setVerificationDetails(undefined);
      setVerificationResponse(undefined);

      let retryCount = 0;

      const verifyWithRetry = async (attempt: number): Promise<DnsVerifyResponse> => {
        try {
          const response = await fetch(`/api/domains/verify?domain=${domain}`);
          const data: DnsVerifyResponse = await response.json();
          return data;
        } catch (error) {
          if (attempt < MAX_RETRIES) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt); // Exponential backoff
            console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return verifyWithRetry(attempt + 1);
          }
          throw error;
        }
      };

      try {
        // Step 1: Fetch DNS Records with retry logic
        console.log('🔍 Step 1: Fetching DNS records for:', domain);
        const data = await verifyWithRetry(0);
        console.log('📊 DNS Response:', data);
        setVerificationResponse(data);

        // Check if DNS lookup was successful
        if (!data.success) {
          console.error('❌ DNS lookup failed:', data);

          // If we have attempts data and any were successful, retry
          if (data.details?.attempts?.some((a) => a.success)) {
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount - 1);
              console.log(`Partial success detected. Retrying in ${delay}ms...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
              return handleVerifyClick(); // Retry the whole verification
            }
          }

          setVerificationStep('error');
          const retriesText = retryCount > 0 ? ` (after ${retryCount} retries)` : '';
          setVerificationError('Failed to verify domain' + retriesText);
          setVerificationDetails({
            message: 'DNS Lookup Failed',
            details: `${data.details?.details ?? 'Unable to retrieve DNS records'} (After ${retryCount} retries)`,
            attempts: data.details?.attempts,
          });
          return;
        }

        // Mark DNS fetch as successful
        console.log('✅ Step 1 Complete: Successfully fetched DNS records');

        // Step 2: Check for TXT Records
        setVerificationStep('checking_txt');
        if (!data.records || data.records.length === 0) {
          console.error('❌ No TXT records found');
          setVerificationStep('error');
          setVerificationError('No TXT records found for this domain');
          setVerificationDetails({
            message: 'Missing TXT Records',
            details:
              'No TXT records were found for your domain. Please add the required TXT record.',
            attempts: data.details?.attempts,
          });
          return;
        }

        console.log('✅ Step 2 Complete: Found TXT records:', data.records);

        // Step 3: Verify _dashauth Record Exists
        setVerificationStep('verifying_match');
        const dashAuthRecord = data.records.find(
          (record) => record.name.includes('_dashauth') && record.type === 'TXT'
        );

        if (!dashAuthRecord) {
          console.error('❌ No _dashauth TXT record found');
          setVerificationStep('error');
          setVerificationError('Missing _dashauth TXT record');
          setVerificationDetails({
            message: 'Missing Required Record',
            details:
              'The _dashauth TXT record was not found. Please add the record exactly as shown.',
            attempts: data.details?.attempts,
          });
          return;
        }

        console.log('✅ Step 3 Complete: Found _dashauth record:', dashAuthRecord);

        // Step 4: Verify Token Match
        const expectedToken = verificationData.verification_token;
        const foundToken = dashAuthRecord.data.trim();

        console.log('🔍 Step 4: Comparing tokens:', {
          found: foundToken,
          expected: expectedToken,
          rawLookup: data._debug?.rawLookup,
        });

        if (foundToken === expectedToken) {
          // All steps successful
          console.log('✅ Step 4 Complete: Tokens match');
          console.log('🎉 All verification steps completed successfully');

          try {
            // Update Supabase with verification success
            const supabase = createClientComponentClient();
            await supabase
              .from('verified_domains')
              .update({
                verified: true,
                verified_at: new Date().toISOString(),
                status: 'verified',
                last_verification_attempt: new Date().toISOString(),
                verification_attempts: verificationData.verification_attempts
                  ? verificationData.verification_attempts + 1
                  : 1,
                verification_error: null,
              })
              .eq('domain', domain);

            setVerificationStep('complete');
            setVerificationError(undefined);
            setVerificationDetails(undefined);
            setVerificationResponse(data);
          } catch (error) {
            console.error('Failed to update verification status:', error);
            setVerificationStep('error');
            setVerificationError('Failed to save verification status');
          }
        } else {
          console.error('❌ Token mismatch');
          setVerificationStep('error');
          setVerificationError('TXT record value does not match expected value');
          setVerificationDetails({
            message: 'Token Mismatch',
            details: `Found "${foundToken}" but expected "${expectedToken}". Please ensure you've copied the exact verification token.`,
            attempts: data.details?.attempts,
          });

          // Update Supabase with verification failure
          const supabase = createClientComponentClient();
          await supabase
            .from('verified_domains')
            .update({
              verification_error: `TXT record value does not match. Found "${foundToken}" but expected "${expectedToken}"`,
              last_verification_attempt: new Date().toISOString(),
              verification_attempts: verificationData.verification_attempts
                ? verificationData.verification_attempts + 1
                : 1,
            })
            .eq('domain', domain);

          return;
        }
      } catch (error) {
        console.error('❌ Verification failed:', error);
        setVerificationStep('error');
        const retriesText = retryCount > 0 ? ` (after ${retryCount} retries)` : '';
        setVerificationError('Failed to verify domain' + retriesText);
        setVerificationDetails({
          message: 'Verification Error',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationError(error instanceof Error ? error.message : 'Verification failed');
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleCopy = async (text: string, field: 'recordName' | 'recordValue') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [field]: true }));

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const txtRecord =
    verificationData.metadata?.verification_instructions?.record_name ?? '_dashauth';
  const txtValue = verificationData.verification_token;

  const handleContinue = (onSkip: () => void) => {
    onSkip();
  };

  return (
    <>
      <HelpSidebar isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <div className="fixed inset-0 bg-zinc-950 text-white dark:bg-white dark:text-black">
        <div className="h-full overflow-y-auto">
          <div className="mx-auto min-h-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
            <div className="relative pb-16">
              <StepHeader
                title="Verify Your Domain"
                subtitle="Add a TXT record to verify domain ownership"
                backLabel="Back"
                showHelp={showHelp}
                onBack={onBack}
                onHelp={() => setShowHelp(!showHelp)}
              />

              <div className="absolute inset-x-0 bottom-10 flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="rounded-full bg-zinc-800/50 px-6 py-3 backdrop-blur-sm dark:bg-zinc-200/50">
                    <AnimatedText text={domain} />
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="mt-12 space-y-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <motion.div
                    className="space-y-2 text-center lg:text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-lg text-zinc-400 dark:text-gray-600">
                      To verify your domain ownership, you&apos;ll need to add a TXT record to your
                      DNS settings.
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white dark:text-black">
                        TXT Record Name
                      </p>
                      <div className="rounded-lg bg-zinc-800/70 p-6 backdrop-blur-sm dark:bg-zinc-200/70">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-lg text-white dark:text-black">
                            {txtRecord}
                          </p>
                          <button
                            onClick={() => handleCopy(txtRecord, 'recordName')}
                            className="group rounded-lg p-2 transition-all duration-200 hover:bg-zinc-700/50 dark:hover:bg-zinc-300/50"
                          >
                            <AnimatePresence mode="wait">
                              {copiedStates.recordName ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="text-green-500"
                                >
                                  <Check className="h-5 w-5" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="copy"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <Copy className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-white dark:text-gray-600 dark:group-hover:text-black" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-white dark:text-black">
                        TXT Record Value
                      </p>
                      <div className="rounded-lg bg-zinc-800/70 p-6 backdrop-blur-sm dark:bg-zinc-200/70">
                        <div className="flex items-center justify-between">
                          <p className="break-all font-mono text-lg text-white dark:text-black">
                            {txtValue}
                          </p>
                          <button
                            onClick={() => handleCopy(txtValue, 'recordValue')}
                            className="group rounded-lg p-2 transition-all duration-200 hover:bg-zinc-700/50 dark:hover:bg-zinc-300/50"
                          >
                            <AnimatePresence mode="wait">
                              {copiedStates.recordValue ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="text-green-500"
                                >
                                  <Check className="h-5 w-5" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="copy"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <Copy className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-white dark:text-gray-600 dark:group-hover:text-black" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>
                      </div>
                    </div>

                    {verificationError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-4"
                      >
                        <p className="text-center text-sm text-red-500">{verificationError}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                <div className="relative">
                  {verificationStep !== 'idle' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full"
                    >
                      <GlowingCard
                        status={
                          verificationStep === 'complete'
                            ? isVerified
                              ? 'success'
                              : 'error'
                            : undefined
                        }
                      >
                        <div className="flex flex-col space-y-6">
                          <div className="flex items-center gap-3">
                            {verificationStep === 'complete' && isVerified ? (
                              <CheckCircleIcon className="h-8 w-8 text-green-500" />
                            ) : verificationStep === 'error' ||
                              (verificationStep === 'complete' && !isVerified) ? (
                              <XCircleIcon className="h-8 w-8 text-red-500" />
                            ) : (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                                className="h-8 w-8 rounded-full border-2 border-zinc-500 border-t-transparent"
                              />
                            )}
                            <h3 className="text-xl font-semibold text-zinc-100 dark:text-zinc-900">
                              {verificationStep === 'complete'
                                ? isVerified
                                  ? 'Domain Verified!'
                                  : 'Verification Failed'
                                : verificationStep === 'error'
                                  ? 'Verification Failed'
                                  : 'Verifying Domain...'}
                            </h3>
                          </div>

                          <div className="space-y-4">
                            <p className="text-sm text-zinc-400 dark:text-zinc-600">
                              {(() => {
                                switch (verificationStep) {
                                  case 'fetching':
                                    return 'Fetching DNS records...';
                                  case 'checking_txt':
                                    return 'Checking for TXT records...';
                                  case 'verifying_match':
                                    return 'Verifying record matches...';
                                  case 'complete':
                                    return isVerified
                                      ? `Successfully verified domain ownership for ${domain}`
                                      : 'Verification failed. Please check the details below.';
                                  case 'error':
                                    return (
                                      verificationError ?? 'An error occurred during verification'
                                    );
                                  default:
                                    return 'Verifying domain...';
                                }
                              })()}
                            </p>

                            <VerificationSteps
                              currentStep={verificationStep}
                              error={verificationError}
                              details={verificationDetails}
                              verificationResponse={verificationResponse}
                              isVerified={isVerified}
                            />
                          </div>
                        </div>
                      </GlowingCard>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-full items-center justify-center"
                    >
                      <div className="text-center text-zinc-500 dark:text-zinc-400">
                        <p>Click &quot;Verify Now&quot; to start the verification process</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-md">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onSkip}
                  className="group relative w-full px-4 py-2.5 font-medium text-slate-100 transition-colors duration-[400ms] hover:text-white dark:text-slate-800 dark:hover:text-black"
                >
                  <span>Skip for Now</span>
                  <span className="absolute left-0 top-0 h-[2px] w-0 bg-white transition-all duration-100 group-hover:w-full dark:bg-black" />
                  <span className="absolute right-0 top-0 h-0 w-[2px] bg-white transition-all delay-100 duration-100 group-hover:h-full dark:bg-black" />
                  <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white transition-all delay-200 duration-100 group-hover:w-full dark:bg-black" />
                  <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-white transition-all delay-300 duration-100 group-hover:h-full dark:bg-black" />
                </button>

                {verificationStep === 'complete' && verificationData.status === 'verified' ? (
                  <button
                    onClick={() => handleContinue(onSkip)}
                    className="relative z-0 flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md border-[1px]
                    border-zinc-800 px-4 py-2.5 font-medium text-neutral-300 transition-all duration-300 before:absolute before:inset-0
                    before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%] before:bg-white
                    before:transition-transform before:duration-1000 before:content-['']
                    hover:scale-105
                    hover:border-white hover:text-neutral-900 hover:before:translate-y-[0%]
                    active:scale-100 dark:border-gray-300 dark:text-gray-700 dark:before:bg-black dark:hover:border-black
                    dark:hover:text-white"
                  >
                    <span className="relative z-10">Continue</span>
                  </button>
                ) : (
                  <button
                    onClick={handleVerifyClick}
                    disabled={verificationStep !== 'idle' && verificationStep !== 'error'}
                    className="relative z-0 flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md border-[1px]
                    border-zinc-800 px-4 py-2.5 font-medium text-neutral-300 transition-all duration-300 before:absolute before:inset-0
                    before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%] before:bg-white
                    before:transition-transform before:duration-1000 before:content-['']
                    hover:scale-105
                    hover:border-white hover:text-neutral-900 hover:before:translate-y-[0%]
                    active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-300 dark:text-gray-700
                    dark:before:bg-black dark:hover:border-black dark:hover:text-white"
                  >
                    <span className="relative z-10">
                      {verificationStep !== 'idle' && verificationStep !== 'error'
                        ? 'Verifying...'
                        : 'Verify Now'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const HelpSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'general' | 'providers' | 'faq'>('general');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const providersByCategory = DNS_PROVIDERS.reduce(
    (acc: Record<string, DnsProvider[]>, provider: DnsProvider) => {
      if (!acc[provider.category]) {
        acc[provider.category] = [];
      }
      acc[provider.category].push(provider);
      return acc;
    },
    {} as Record<string, DnsProvider[]>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm dark:bg-white/20"
            onClick={onClose}
          />

          <motion.div
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-zinc-800 bg-zinc-900 dark:border-zinc-200 dark:bg-white"
          >
            <div className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white dark:text-black">
                  Domain Verification Help
                </h2>
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-white dark:hover:text-black"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex space-x-2 border-b border-zinc-800 dark:border-zinc-200">
                {(['general', 'providers', 'faq'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      selectedTab === tab
                        ? 'border-b-2 border-white text-white dark:border-black dark:text-black'
                        : 'text-zinc-400 hover:text-white dark:hover:text-black'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {selectedTab === 'providers' && (
                  <div className="space-y-6">
                    {Object.entries(providersByCategory)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([category, providers]) => {
                        const sortedProviders = [...providers].sort((a, b) =>
                          a.name.localeCompare(b.name)
                        );
                        return (
                          <div key={category} className="space-y-2">
                            <button
                              onClick={() =>
                                setSelectedCategory(selectedCategory === category ? null : category)
                              }
                              className="flex w-full items-center justify-between rounded-md p-2 font-medium text-white hover:bg-zinc-800/50 dark:text-black dark:hover:bg-zinc-200/50"
                            >
                              <span>{category}</span>
                              <ChevronDownIcon
                                className={`h-5 w-5 transition-transform ${
                                  selectedCategory === category ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            <AnimatePresence>
                              {selectedCategory === category && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-2 pl-4">
                                    {sortedProviders.map((provider) => (
                                      <details key={provider.name} className="group">
                                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-md p-2 hover:bg-zinc-800/30 dark:hover:bg-zinc-200/30">
                                          <span className="text-zinc-300 dark:text-zinc-700">
                                            {provider.name}
                                          </span>
                                          <ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="space-y-2 pb-1 pl-4 pt-2 text-sm text-zinc-400 dark:text-zinc-600">
                                          {provider.instructions && <p>{provider.instructions}</p>}
                                          {provider.steps && (
                                            <ol className="list-inside list-decimal space-y-1">
                                              {provider.steps.map((step, index) => (
                                                <li key={index}>{step}</li>
                                              ))}
                                            </ol>
                                          )}
                                          {provider.propagationTime && (
                                            <p className="text-xs text-zinc-500">
                                              Propagation Time: {provider.propagationTime}
                                            </p>
                                          )}
                                        </div>
                                      </details>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                  </div>
                )}

                {selectedTab === 'faq' && (
                  <div className="space-y-4">
                    {DOMAIN_VERIFICATION_FAQ.map((faq: FaqItem, index: number) => (
                      <details key={index} className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-md p-2 hover:bg-zinc-800/30 dark:hover:bg-zinc-200/30">
                          <span className="font-medium text-white dark:text-black">
                            {faq.question}
                          </span>
                          <ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="pb-1 pl-4 pt-2 text-sm text-zinc-400 dark:text-zinc-600">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                )}

                {selectedTab === 'general' && (
                  <div className="space-y-6 text-zinc-300 dark:text-zinc-700">
                    <div>
                      <h3 className="mb-2 font-medium text-white dark:text-black">
                        What is DNS Verification?
                      </h3>
                      <p>
                        DNS verification is a security measure that proves you own or control a
                        domain by adding a specific TXT record to your domain&apos;s DNS settings.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium text-white dark:text-black">
                        How to Add a TXT Record
                      </h3>
                      <ol className="list-inside list-decimal space-y-2">
                        <li>Log in to your domain registrar or DNS provider</li>
                        <li>Find the DNS settings or DNS management section</li>
                        <li>Look for an option to add a new DNS record</li>
                        <li>Select TXT as the record type</li>
                        <li>Enter &quot;_dashauth&quot; as the record name/host</li>
                        <li>Copy and paste the verification token as the record value</li>
                        <li>Save the changes</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
