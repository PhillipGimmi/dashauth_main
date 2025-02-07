'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Copy,
  X,
  Search,
  ChevronUp,
  ChevronDown,
  Check,
} from 'lucide-react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { StepHeader } from '../../StepHeader/StepHeader';
import { SetupOption } from '@/types/types';
import { cn } from '@/lib/utils';

interface SetupStepProps {
  readonly domain: string;
  readonly selectedPlatform: SetupOption['id'];
  readonly onCompleteAction: () => Promise<void>;
  readonly onBackAction: () => Promise<void>;
  readonly isSubmitting: boolean;
}

interface ClientConfig {
  scriptCode: string;
  envSetup: string;
  clientId: string;
  platformType: string;
  instructions: string[];
}

interface VerificationStatus {
  https: boolean;
  scriptFound: boolean;
  scriptLoaded: boolean;
  clientInitialized: boolean;
  scriptDetails?: {
    present: boolean;
    correctId: boolean;
    location: 'head' | 'body' | 'unknown';
    lastPing?: string;
    foundId?: string;
    expectedId?: string;
    exactMatch: boolean;
    hasDefer: boolean;
    correctSrc: boolean;
    inHead: boolean;
    loadTime?: string;
    securityContext?: boolean;
    heartbeat?: boolean;
    foundSrc?: string;
    expectedSrc?: string;
    certValid?: boolean;
    tlsVersion?: string;
    hasHttpsRedirect: boolean;
    securityHeaders: Record<string, string>;
  };
  verified: boolean;
  heartbeat?: {
    lastPing: string | null | undefined;
    status: 'active' | 'inactive';
  };
}

interface ScriptProvider {
  name: string;
  category: string;
  region: string;
  instructions: string;
  steps?: string[];
}

const SCRIPT_PROVIDERS: ScriptProvider[] = [
  {
    name: 'HTML/JavaScript',
    category: 'Frontend',
    region: 'Global',
    instructions: 'Add the script tag to your HTML head section',
    steps: [
      'Open your main HTML file or template',
      'Locate the <head> section',
      'Paste the script tag before the closing </head> tag',
      'Save and deploy your changes',
    ],
  },
  {
    name: 'React',
    category: 'Frontend',
    region: 'Global',
    instructions: 'Add the script to your React application',
    steps: [
      'Open your index.html in public folder',
      'Add the script tag to the head section',
      'For Next.js, use next/script component in _document.js',
      'Ensure the script loads before your application code',
    ],
  },
  {
    name: 'Vue',
    category: 'Frontend',
    region: 'Global',
    instructions: 'Integrate the script with your Vue application',
    steps: [
      'Add the script to index.html in public directory',
      'Place it in the head section before your app mounting',
      'For Nuxt.js, use the head property in nuxt.config.js',
    ],
  },
  {
    name: 'WordPress',
    category: 'CMS',
    region: 'Global',
    instructions: 'Add the script to your WordPress site',
    steps: [
      'Go to Appearance > Theme Editor',
      "Select your theme's header.php file",
      'Add the script tag before </head>',
      'Save changes and test',
    ],
  },
];

const groupProvidersByCategory = (providers: typeof SCRIPT_PROVIDERS) => {
  return providers.reduce(
    (acc, provider) => {
      const { category } = provider;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(provider);
      return acc;
    },
    {} as Record<string, typeof SCRIPT_PROVIDERS>
  );
};

const ProviderCard: React.FC<{ provider: ScriptProvider }> = ({ provider }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-lg border border-zinc-800 dark:border-gray-200"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-zinc-800/50 dark:hover:bg-gray-50"
      >
        <div>
          <h3 className="font-semibold text-white dark:text-gray-900">{provider.name}</h3>
          <span className="text-sm text-zinc-400 dark:text-gray-500">{provider.region}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-zinc-400 dark:text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-400 dark:text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-800/50 p-4 dark:bg-gray-50/50"
        >
          <div className="space-y-4 text-zinc-300 dark:text-gray-700">
            <p>{provider.instructions}</p>
            {provider.steps && (
              <ol className="list-inside list-decimal space-y-2">
                {provider.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const AnimatedTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={4}
    className={cn(
      'z-[999999]',
      'fixed',
      'overflow-hidden rounded-xl',
      'bg-zinc-900/90 dark:bg-zinc-100/90',
      'shadow-2xl backdrop-blur-lg',
      'border border-zinc-800/30 dark:border-zinc-200/30',
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="min-w-[320px] max-w-[420px] p-5"
    >
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3 text-[15px] text-zinc-100 dark:text-zinc-800"
      >
        {children}
      </motion.div>
    </motion.div>
  </TooltipPrimitive.Content>
));
AnimatedTooltipContent.displayName = 'AnimatedTooltipContent';

const VerificationItem = ({
  title,
  status,
  details,
  description,
}: {
  title: React.ReactNode;
  status: { success: boolean; text: string };
  details?: React.ReactNode;
  description: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Header section - keep at same z-index */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsExpanded(!isExpanded);
          }
        }}
        className={cn(
          'relative w-full cursor-pointer rounded-lg p-4 text-left',
          'bg-black/30 dark:bg-zinc-200/30',
          'hover:bg-black/40 dark:hover:bg-zinc-200/40',
          'transition-colors duration-200'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status.success ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium text-white dark:text-gray-900">{title}</span>
          </div>
          <span className={status.success ? 'text-green-500' : 'text-red-500'}>{status.text}</span>
        </div>
      </button>

      {/* Expanded content - ensure it doesn't stack above other elements */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={cn(
              'relative w-full rounded-b-lg',
              'border border-zinc-800/50 dark:border-gray-200/50',
              'bg-gradient-to-b from-zinc-900/95 to-zinc-900/90',
              'dark:from-white/95 dark:to-white/90',
              'shadow-xl backdrop-blur-sm',
              'z-10' // Set explicit z-index
            )}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative space-y-4 p-6" style={{ overflow: 'visible' }}>
              {details}
              {description && (
                <div className="border-t border-zinc-800/30 pt-4 dark:border-gray-200/30">
                  <div className="text-sm text-zinc-400 dark:text-gray-600">{description}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Update the script source based on environment
const getScriptSrc = () => {
  // Always return the production URL since that's what we tell users to use
  return 'https://dashauth.com/secure.js';
};

// Update the DashAuth interface
declare global {
  interface Window {
    DashAuth?: {
      _state: {
        initialized: boolean;
        securityContext: {
          lastVerified: string | null;
          secure: boolean;
        } | null;
        heartbeatInterval: number | null;
      };
      _scriptElement: HTMLScriptElement | null;
      _clientId: string | null;
      _startTime: number;
    };
  }
}

interface DashAuthStatus {
  scriptLoaded: boolean;
  initialized: boolean;
  securityContext: boolean;
  lastVerified: string | null;
  heartbeat: boolean;
}

export const SetupStep: React.FC<SetupStepProps> = ({
  domain,
  selectedPlatform,
  onCompleteAction,
  onBackAction,
  isSubmitting,
}) => {
  const [clientConfig, setClientConfig] = useState<ClientConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [copiedStates, setCopiedStates] = useState({
    scriptCode: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleVerifyScript = useCallback(async () => {
    if (!clientConfig?.clientId) return;

    try {
      setIsLoading(true);
      setError(null);
      setVerificationStatus(null);

      // First check if script exists and is loaded
      const scriptResponse = await fetch(`/api/domains/${domain}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientConfig.clientId,
          domain,
        }),
      });

      if (!scriptResponse.ok) {
        throw new Error(`Domain verification failed: ${scriptResponse.status}`);
      }

      const scriptData = await scriptResponse.json();

      // Check if DashAuth is initialized on the client
      const dashAuthStatus: DashAuthStatus = {
        scriptLoaded: false,
        initialized: false,
        securityContext: false,
        lastVerified: null,
        heartbeat: false,
      };

      // Check for script tag presence and attributes
      const scriptTags = document.querySelectorAll('script[src*="dashauth.com/secure.js"]');
      const scriptTag = Array.from(scriptTags).find(
        (script) => script.getAttribute('id') === clientConfig.clientId
      );

      if (scriptTag) {
        dashAuthStatus.scriptLoaded = true;
        dashAuthStatus.securityContext = scriptTag.parentElement?.tagName.toLowerCase() === 'head';
      }

      // Check DashAuth object initialization
      if (window.DashAuth) {
        dashAuthStatus.initialized = window.DashAuth._state?.initialized ?? false;
        dashAuthStatus.lastVerified = window.DashAuth._state?.securityContext?.lastVerified ?? null;
        dashAuthStatus.heartbeat = window.DashAuth._state?.heartbeatInterval !== null;
      }

      // Update verification status
      const newStatus: VerificationStatus = {
        https: scriptData.https,
        scriptFound: dashAuthStatus.scriptLoaded,
        scriptLoaded: dashAuthStatus.initialized,
        clientInitialized: dashAuthStatus.initialized,
        scriptDetails: {
          ...scriptData.scriptDetails,
          present: dashAuthStatus.scriptLoaded,
          correctId: scriptTag?.getAttribute('id') === clientConfig.clientId,
          location: scriptTag?.parentElement?.tagName.toLowerCase() === 'head' ? 'head' : 'body',
          inHead: scriptTag?.parentElement?.tagName.toLowerCase() === 'head',
          hasDefer: scriptTag?.hasAttribute('defer') ?? false,
          correctSrc: scriptTag?.getAttribute('src') === 'https://dashauth.com/secure.js',
          securityContext: dashAuthStatus.securityContext,
          heartbeat: dashAuthStatus.heartbeat,
          lastVerified: dashAuthStatus.lastVerified,
          lastPing: scriptData.scriptDetails?.lastPing ?? null,
          hasHttpsRedirect: scriptData.hasHttpsRedirect,
          securityHeaders: scriptData.securityHeaders || {},
        },
        verified: dashAuthStatus.initialized && dashAuthStatus.scriptLoaded,
        heartbeat: {
          lastPing: scriptData.scriptDetails?.lastPing ?? null,
          status: scriptData.scriptDetails?.heartbeat ? 'active' : 'inactive',
        },
      };

      setVerificationStatus(newStatus);

      if (newStatus.verified) {
        await onCompleteAction();
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setError(err instanceof Error ? err.message : 'Verification failed');
      setVerificationStatus((prev) =>
        prev
          ? {
              ...prev,
              verified: false,
              scriptLoaded: false,
              clientInitialized: false,
            }
          : null
      );
    } finally {
      setIsLoading(false);
    }
  }, [clientConfig, domain, onCompleteAction]);

  // Add polling to check script status
  useEffect(() => {
    if (!verificationStatus || !clientConfig?.clientId) return;

    const checkInterval = setInterval(() => {
      if (window.DashAuth?._state?.initialized) {
        handleVerifyScript();
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [verificationStatus, clientConfig, handleVerifyScript]); // Add handleVerifyScript

  const fetchClientConfig = useCallback(async () => {
    if (!domain) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching config for domain:', domain);
      const response = await fetch(`/api/domains/${domain}/config`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Config fetched successfully:', data);

      if (!data.scriptCode) {
        throw new Error('Script code is required');
      }

      setClientConfig(data);
      setError(null);
    } catch (error) {
      console.error('❌ Error fetching client config:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch configuration');
      setClientConfig(null);
    } finally {
      setIsLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    if (domain) {
      fetchClientConfig();
    }
  }, [domain, fetchClientConfig]);

  useEffect(() => {
    if (clientConfig && selectedPlatform) {
      try {
        console.log('🔄 Processing platform:', selectedPlatform);
        console.log('✅ Platform processed successfully');
      } catch (error) {
        console.error('❌ Error processing platform:', error);
        setError(error instanceof Error ? error.message : 'Failed to process platform');
      }
    }
  }, [clientConfig, selectedPlatform]);

  const handleCopy = async (text: string, field: 'scriptCode') => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowHelp(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update the verification status check
  useEffect(() => {
    if (!window.DashAuth) return;

    const checkVerificationStatus = () => {
      const dashAuth = window.DashAuth;
      if (!dashAuth?._state?.securityContext) return;

      const state = dashAuth._state;
      const scriptElement = dashAuth._scriptElement;
      const securityContext = state.securityContext;

      // Early return if security context is null
      if (!securityContext) return;

      setVerificationStatus({
        https: true,
        scriptFound: !!scriptElement,
        scriptLoaded: true,
        clientInitialized: state.initialized,
        scriptDetails: {
          present: !!scriptElement,
          correctId: true,
          location:
            scriptElement?.parentElement?.tagName.toLowerCase() === 'head' ? 'head' : 'body',
          lastPing: securityContext.lastVerified ?? undefined,
          foundId: dashAuth._clientId ?? undefined,
          expectedId: clientConfig?.clientId,
          exactMatch: true,
          hasDefer: scriptElement?.hasAttribute('defer') ?? false,
          correctSrc: true,
          inHead: scriptElement?.parentElement?.tagName.toLowerCase() === 'head',
          loadTime: String(Date.now() - dashAuth._startTime),
          securityContext: securityContext.secure,
          heartbeat: !!state.heartbeatInterval,
          certValid: true,
          tlsVersion: '1.3',
          hasHttpsRedirect: true,
          securityHeaders: {},
        },
        verified: state.initialized,
        heartbeat: {
          lastPing: securityContext.lastVerified ?? undefined,
          status: state.heartbeatInterval ? 'active' : 'inactive',
        },
      });
    };

    const interval = setInterval(checkVerificationStatus, 1000);
    return () => clearInterval(interval);
  }, [clientConfig?.clientId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border-2 border-zinc-500 border-t-transparent"
        />
        <p className="mt-4 text-zinc-400">Loading configuration...</p>
      </div>
    );
  }

  return (
    <TooltipPrimitive.Provider>
      <div className="fixed inset-0 bg-zinc-950 text-white dark:bg-white dark:text-black">
        <div className="h-full overflow-y-auto">
          <div className="mx-auto min-h-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
            <StepHeader
              title="Integration Setup"
              subtitle="Follow the steps below to integrate DashAuth"
              backLabel={domain}
              showHelp={showHelp}
              onBack={onBackAction}
              onHelp={() => setShowHelp(!showHelp)}
            />

            <div className="mt-8 space-y-8">
              <div className="rounded-lg bg-zinc-900/50 p-6 shadow-lg dark:bg-white/90">
                <h3 className="mb-6 text-lg font-medium text-white motion-safe:animate-fadeIn dark:text-zinc-700">
                  <TooltipPrimitive.Root>
                    <TooltipPrimitive.Trigger>
                      <span className="transition-opacity hover:opacity-80">
                        Script Installation
                      </span>
                    </TooltipPrimitive.Trigger>
                    <AnimatedTooltipContent>
                      <p>Add this script to your website to enable DashAuth authentication:</p>
                      <ul className="mt-2 list-inside list-disc">
                        <li>Place in the head section</li>
                        <li>Loads before page content</li>
                        <li>Enables secure authentication</li>
                      </ul>
                    </AnimatedTooltipContent>
                  </TooltipPrimitive.Root>
                </h3>
                <div className="space-y-6">
                  <p className="text-lg text-zinc-400 dark:text-gray-600">
                    To complete the integration, add this script to the &lt;head&gt; section of your
                    website.
                  </p>

                  <div className="rounded-lg bg-zinc-800/70 p-6 backdrop-blur-sm dark:bg-zinc-200/70">
                    <div className="flex items-center justify-between">
                      <p className="break-all font-mono text-base text-white dark:text-black">
                        {clientConfig?.scriptCode ?? 'Loading...'}
                      </p>
                      <button
                        onClick={() => handleCopy(clientConfig?.scriptCode ?? '', 'scriptCode')}
                        className="group ml-4 flex-shrink-0 rounded-lg p-2 transition-all duration-200 hover:bg-zinc-700/50 dark:hover:bg-zinc-300/50"
                      >
                        <AnimatePresence mode="wait">
                          {copiedStates.scriptCode ? (
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

                  <button
                    onClick={handleVerifyScript}
                    disabled={isSubmitting || !clientConfig?.clientId}
                    className={cn(
                      'justify-center... relative z-0 flex w-full flex-col items-center',
                      error ? 'border-red-500' : 'border-zinc-800 dark:border-gray-300'
                    )}
                  >
                    <motion.span className="relative z-10">
                      {isSubmitting ? 'Verifying...' : error ? 'Try Again' : 'Check Integration'}
                    </motion.span>
                    {error && <span className="mt-2 text-sm text-red-500">{error}</span>}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {verificationStatus && !isLoading ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="relative grid grid-cols-1 gap-6 lg:grid-cols-2"
                  >
                    {/* Public Verification Column */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-lg bg-zinc-900 p-6 dark:bg-white"
                    >
                      <h3 className="mb-6 text-lg font-medium text-white dark:text-zinc-700">
                        Public Verification
                      </h3>
                      <div className="space-y-4">
                        <VerificationItem
                          title={
                            <TooltipPrimitive.Root>
                              <TooltipPrimitive.Trigger className="w-full text-left">
                                <span>HTTPS Status</span>
                              </TooltipPrimitive.Trigger>
                              <AnimatedTooltipContent
                                side="right"
                                align="start"
                                className="w-[400px]"
                              >
                                <div className="space-y-3">
                                  <div>
                                    <p className="mb-2 font-medium">What we check:</p>
                                    <ul className="space-y-1.5 text-sm">
                                      <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>
                                          HTTPS Availability: We verify your site loads securely
                                          over HTTPS
                                        </span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>
                                          HTTP Redirect: We ensure HTTP traffic redirects to HTTPS
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </AnimatedTooltipContent>
                            </TooltipPrimitive.Root>
                          }
                          status={{
                            success: verificationStatus?.https ?? false,
                            text: verificationStatus?.https ? 'Enabled' : 'Not Enabled',
                          }}
                          details={
                            <div className="rounded-lg bg-black/30 p-4 dark:bg-zinc-200/30">
                              <p className="mb-2 text-white dark:text-black">HTTPS Requirements:</p>
                              <ul className="space-y-2">
                                <TooltipPrimitive.Root>
                                  <TooltipPrimitive.Trigger className="w-full">
                                    <li className="flex items-center gap-2">
                                      {verificationStatus?.scriptDetails?.securityContext ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                      )}
                                      <span className="text-white dark:text-black">
                                        HTTPS Access
                                      </span>
                                    </li>
                                  </TooltipPrimitive.Trigger>
                                  <AnimatedTooltipContent>
                                    <p className="mb-1 font-medium">HTTPS Accessibility</p>
                                    <p className="text-sm">
                                      We verify your site can be accessed over HTTPS at{' '}
                                      {`https://${domain}`}
                                    </p>
                                  </AnimatedTooltipContent>
                                </TooltipPrimitive.Root>

                                <TooltipPrimitive.Root>
                                  <TooltipPrimitive.Trigger className="w-full">
                                    <li className="flex items-center gap-2">
                                      {verificationStatus?.scriptDetails?.hasHttpsRedirect ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                      )}
                                      <span className="text-white dark:text-black">
                                        HTTP to HTTPS Redirect
                                      </span>
                                    </li>
                                  </TooltipPrimitive.Trigger>
                                  <AnimatedTooltipContent>
                                    <p className="mb-1 font-medium">Redirect Check</p>
                                    <p className="text-sm">
                                      We verify that HTTP requests automatically redirect to HTTPS
                                      for security
                                    </p>
                                  </AnimatedTooltipContent>
                                </TooltipPrimitive.Root>
                              </ul>
                            </div>
                          }
                          description="Verifies HTTPS configuration for secure authentication"
                        />

                        <VerificationItem
                          title={
                            <TooltipPrimitive.Root>
                              <TooltipPrimitive.Trigger className="transition-opacity hover:opacity-80">
                                Script Source
                              </TooltipPrimitive.Trigger>
                              <AnimatedTooltipContent>
                                <p className="mb-1 font-medium">Source URL Verification</p>
                                <p className="mb-2 text-sm">We verify that:</p>
                                <ul className="list-inside list-disc space-y-1 text-sm">
                                  <li>Script source matches: https://dashauth.com/secure.js</li>
                                  <li>Script is present in the HTML</li>
                                  <li>Script has correct client ID</li>
                                </ul>
                              </AnimatedTooltipContent>
                            </TooltipPrimitive.Root>
                          }
                          status={{
                            success: verificationStatus?.scriptDetails?.exactMatch ?? false,
                            text: verificationStatus?.scriptDetails?.exactMatch
                              ? 'All Checks Passed'
                              : 'Issues Found',
                          }}
                          details={
                            <div className="space-y-4">
                              <div className="rounded-lg bg-black/30 p-4 dark:bg-zinc-200/30">
                                <p className="mb-3">Required elements:</p>
                                <div className="space-y-3">
                                  <TooltipPrimitive.Root>
                                    <TooltipPrimitive.Trigger className="w-full">
                                      <div className="flex items-center gap-2">
                                        {verificationStatus?.scriptDetails?.correctSrc ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span>Correct source URL</span>
                                      </div>
                                    </TooltipPrimitive.Trigger>
                                    <AnimatedTooltipContent>
                                      <p className="mb-1 font-medium">Source URL Check</p>
                                      <p className="text-sm">
                                        Script must use exact URL: https://dashauth.com/secure.js
                                      </p>
                                    </AnimatedTooltipContent>
                                  </TooltipPrimitive.Root>

                                  <TooltipPrimitive.Root>
                                    <TooltipPrimitive.Trigger className="w-full">
                                      <div className="flex items-center gap-2">
                                        {verificationStatus?.scriptDetails?.correctId ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span>Correct client ID</span>
                                      </div>
                                    </TooltipPrimitive.Trigger>
                                    <AnimatedTooltipContent>
                                      <p className="mb-1 font-medium">Client ID Check</p>
                                      <p className="text-sm">
                                        Script must include your client ID: {clientConfig?.clientId}
                                      </p>
                                    </AnimatedTooltipContent>
                                  </TooltipPrimitive.Root>

                                  <TooltipPrimitive.Root>
                                    <TooltipPrimitive.Trigger className="w-full">
                                      <div className="flex items-center gap-2">
                                        {verificationStatus?.scriptDetails?.hasDefer ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span>Has defer attribute</span>
                                      </div>
                                    </TooltipPrimitive.Trigger>
                                    <AnimatedTooltipContent>
                                      <p className="mb-1 font-medium">Defer Attribute Check</p>
                                      <p className="text-sm">
                                        Script tag must include the defer attribute
                                      </p>
                                    </AnimatedTooltipContent>
                                  </TooltipPrimitive.Root>

                                  <TooltipPrimitive.Root>
                                    <TooltipPrimitive.Trigger className="w-full">
                                      <div className="flex items-center gap-2">
                                        {verificationStatus?.scriptDetails?.inHead ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span>Located in head section</span>
                                      </div>
                                    </TooltipPrimitive.Trigger>
                                    <AnimatedTooltipContent>
                                      <p className="mb-1 font-medium">Script Location Check</p>
                                      <p className="text-sm">
                                        Script must be placed in the &lt;head&gt; section of your
                                        HTML
                                      </p>
                                    </AnimatedTooltipContent>
                                  </TooltipPrimitive.Root>
                                </div>
                              </div>

                              <div className="w-full rounded-lg bg-black/30 p-4 dark:bg-zinc-200/30">
                                <p className="mb-2">Expected format:</p>
                                <pre className="overflow-x-auto whitespace-pre rounded bg-zinc-800/50 p-4 font-mono text-sm dark:bg-gray-200/50">
                                  <code>{`<script
  src="${getScriptSrc()}"
  id="${clientConfig?.clientId}"
  defer
></script>`}</code>
                                </pre>
                              </div>
                            </div>
                          }
                          description="Validates script implementation and configuration"
                        />
                      </div>
                    </motion.div>

                    {/* Private Verification Column */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="rounded-lg bg-zinc-900 p-6 dark:bg-white"
                    >
                      <h3 className="mb-6 text-lg font-medium text-white dark:text-zinc-700">
                        Private Verification
                      </h3>
                      <div className="space-y-4">
                        <VerificationItem
                          title={
                            <TooltipPrimitive.Root>
                              <TooltipPrimitive.Trigger className="transition-opacity hover:opacity-80">
                                Script Status
                              </TooltipPrimitive.Trigger>
                              <AnimatedTooltipContent>
                                <p className="mb-1 font-medium">Runtime Verification</p>
                                <p className="mb-2 text-sm">
                                  Monitors script execution and security:
                                </p>
                                <ul className="list-inside list-disc space-y-1 text-sm">
                                  <li>Validates script loading</li>
                                  <li>Verifies security context</li>
                                  <li>Monitors heartbeat status</li>
                                  <li>Checks initialization state</li>
                                </ul>
                              </AnimatedTooltipContent>
                            </TooltipPrimitive.Root>
                          }
                          status={{
                            success: verificationStatus?.scriptLoaded ?? false,
                            text: verificationStatus?.scriptLoaded ? 'Loaded' : 'Not Loaded',
                          }}
                          details={
                            <div className="space-y-4">
                              <div className="rounded-lg bg-black/30 p-4 dark:bg-zinc-200/30">
                                <p className="mb-3">Runtime Checks:</p>
                                <div className="space-y-3">
                                  <TooltipPrimitive.Root>
                                    <TooltipPrimitive.Trigger className="w-full">
                                      <div className="flex items-center gap-2">
                                        {verificationStatus?.scriptDetails?.loadTime ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span>Initial Load</span>
                                      </div>
                                    </TooltipPrimitive.Trigger>
                                    <AnimatedTooltipContent>
                                      <p className="mb-1 font-medium">Script Loading Check</p>
                                      <p className="mb-2 text-sm">Verifies:</p>
                                      <ul className="list-inside list-disc space-y-1 text-sm">
                                        <li>Script loaded successfully</li>
                                        <li>Proper execution context</li>
                                        <li>No loading errors</li>
                                        <li>Correct initialization order</li>
                                      </ul>
                                      {!verificationStatus?.scriptDetails?.loadTime && (
                                        <div className="mt-2 rounded bg-red-500/10 p-2">
                                          <p className="text-sm text-red-400">How to fix:</p>
                                          <ul className="list-inside list-disc text-sm">
                                            <li>Check browser console for errors</li>
                                            <li>Verify script is not blocked</li>
                                            <li>Ensure proper script placement</li>
                                          </ul>
                                        </div>
                                      )}
                                    </AnimatedTooltipContent>
                                  </TooltipPrimitive.Root>

                                  <TooltipPrimitive.Root>
                                    <TooltipPrimitive.Trigger className="w-full">
                                      <div className="flex items-center gap-2">
                                        {verificationStatus?.scriptDetails?.securityContext ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span>Security Context</span>
                                      </div>
                                    </TooltipPrimitive.Trigger>
                                    <AnimatedTooltipContent>
                                      <p className="mb-1 font-medium">HTTPS Verification</p>
                                      <p className="mb-2 text-sm">Current Status:</p>
                                      <ul className="list-inside list-disc space-y-1 text-sm">
                                        <li>
                                          Protocol:{' '}
                                          {verificationStatus?.scriptDetails?.securityContext
                                            ? 'HTTPS'
                                            : 'HTTP'}
                                        </li>
                                        <li>
                                          HTTP to HTTPS Redirect:{' '}
                                          {verificationStatus?.scriptDetails?.hasHttpsRedirect
                                            ? 'Yes'
                                            : 'No'}
                                        </li>
                                        <li>
                                          URL:{' '}
                                          {domain.startsWith('http') ? domain : `https://${domain}`}
                                        </li>
                                      </ul>
                                      {verificationStatus?.scriptDetails?.hasHttpsRedirect && (
                                        <div className="mt-3 rounded bg-emerald-500/10 p-2 text-sm">
                                          <p className="text-emerald-400">
                                            ✓ Site properly enforces HTTPS
                                          </p>
                                        </div>
                                      )}
                                    </AnimatedTooltipContent>
                                  </TooltipPrimitive.Root>

                                  <TooltipPrimitive.Root>
                                    <TooltipPrimitive.Trigger className="w-full">
                                      <div className="flex items-center gap-2">
                                        {verificationStatus?.scriptDetails?.heartbeat ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span>Active Heartbeat</span>
                                      </div>
                                    </TooltipPrimitive.Trigger>
                                    <AnimatedTooltipContent>
                                      <p className="mb-1 font-medium">Heartbeat Monitoring</p>
                                      <p className="mb-2 text-sm">Checks:</p>
                                      <ul className="list-inside list-disc space-y-1 text-sm">
                                        <li>5-minute ping interval</li>
                                        <li>Continuous verification</li>
                                        <li>Connection health</li>
                                        <li>Script activity status</li>
                                      </ul>
                                      {!verificationStatus?.scriptDetails?.heartbeat && (
                                        <div className="mt-2 rounded bg-red-500/10 p-2">
                                          <p className="text-sm text-red-400">Troubleshooting:</p>
                                          <ul className="list-inside list-disc text-sm">
                                            <li>Check network connectivity</li>
                                            <li>Verify no content blockers</li>
                                            <li>Ensure script stays loaded</li>
                                          </ul>
                                        </div>
                                      )}
                                    </AnimatedTooltipContent>
                                  </TooltipPrimitive.Root>
                                </div>
                              </div>

                              <div className="rounded-lg bg-black/30 p-4 dark:bg-zinc-200/30">
                                <p className="mb-2">Verification Process:</p>
                                <div className="space-y-2 text-sm text-zinc-400 dark:text-zinc-600">
                                  <p>1. Script loads and validates security context</p>
                                  <p>2. Initializes with server verification</p>
                                  <p>3. Establishes heartbeat monitoring</p>
                                  <p>4. Maintains continuous runtime checks</p>
                                </div>
                              </div>
                            </div>
                          }
                          description={
                            <TooltipPrimitive.Root>
                              <TooltipPrimitive.Trigger className="w-full text-left">
                                Confirms that our script has loaded and is running securely.
                              </TooltipPrimitive.Trigger>
                              <AnimatedTooltipContent>
                                <p className="mb-2 text-sm">The script performs:</p>
                                <ul className="list-inside list-disc space-y-1 text-sm">
                                  <li>Security context validation</li>
                                  <li>Integrity verification</li>
                                  <li>Continuous health checks</li>
                                  <li>Runtime monitoring</li>
                                </ul>
                              </AnimatedTooltipContent>
                            </TooltipPrimitive.Root>
                          }
                        />

                        <VerificationItem
                          title={
                            <TooltipPrimitive.Root>
                              <TooltipPrimitive.Trigger className="transition-opacity hover:opacity-80">
                                Client Initialization
                              </TooltipPrimitive.Trigger>
                              <AnimatedTooltipContent>
                                <p className="mb-1 font-medium">Client Setup Status</p>
                                <p className="mb-2 text-sm">Verifies complete initialization:</p>
                                <ul className="list-inside list-disc space-y-1 text-sm">
                                  <li>Configuration loaded</li>
                                  <li>Security context established</li>
                                  <li>Services connected</li>
                                  <li>Ready for auth flows</li>
                                </ul>
                              </AnimatedTooltipContent>
                            </TooltipPrimitive.Root>
                          }
                          status={{
                            success: verificationStatus?.clientInitialized ?? false,
                            text: verificationStatus?.clientInitialized
                              ? 'Initialized'
                              : 'Not Initialized',
                          }}
                          details={
                            <div className="space-y-4">
                              <div className="rounded-lg bg-black/30 p-4 dark:bg-zinc-200/30">
                                <p className="mb-3">Initialization Checks:</p>
                                <div className="space-y-3">
                                  <TooltipPrimitive.Root>
                                    <TooltipPrimitive.Trigger className="w-full">
                                      <div className="flex items-center gap-2">
                                        {verificationStatus?.clientInitialized ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span>Configuration Loaded</span>
                                      </div>
                                    </TooltipPrimitive.Trigger>
                                    <AnimatedTooltipContent>
                                      <p className="mb-1 font-medium">Config Verification</p>
                                      <p className="mb-2 text-sm">We verify that:</p>
                                      <ul className="list-inside list-disc space-y-1 text-sm">
                                        <li>Client settings loaded</li>
                                        <li>Environment configured</li>
                                        <li>Valid configuration</li>
                                      </ul>
                                      {!verificationStatus?.clientInitialized && (
                                        <div className="mt-2 rounded bg-red-500/10 p-2">
                                          <p className="text-sm text-red-400">How to fix:</p>
                                          <ul className="list-inside list-disc text-sm">
                                            <li>Check client ID matches</li>
                                            <li>Verify account status</li>
                                            <li>Review configuration</li>
                                          </ul>
                                        </div>
                                      )}
                                    </AnimatedTooltipContent>
                                  </TooltipPrimitive.Root>

                                  {/* Add similar tooltips for Security Context, Services Connection, etc. */}
                                </div>
                              </div>

                              <div className="rounded-lg bg-black/30 p-4 dark:bg-zinc-200/30">
                                <p className="mb-2">Initialization Process:</p>
                                <div className="space-y-2 text-sm text-zinc-400 dark:text-zinc-600">
                                  <p>1. Load and validate configuration</p>
                                  <p>2. Establish security context</p>
                                  <p>3. Connect required services</p>
                                  <p>4. Initialize authentication flows</p>
                                </div>
                              </div>
                            </div>
                          }
                          description={
                            <TooltipPrimitive.Root>
                              <TooltipPrimitive.Trigger className="w-full text-left">
                                Verifies complete client initialization and readiness.
                              </TooltipPrimitive.Trigger>
                              <AnimatedTooltipContent>
                                <p className="mb-2 text-sm">Initialization ensures:</p>
                                <ul className="list-inside list-disc space-y-1 text-sm">
                                  <li>Proper configuration</li>
                                  <li>Security measures active</li>
                                  <li>Services connected</li>
                                  <li>Ready for auth flows</li>
                                </ul>
                              </AnimatedTooltipContent>
                            </TooltipPrimitive.Root>
                          }
                        />
                      </div>
                      <div className="mt-6 space-y-4">
                        {/* <HeartbeatMonitor
                          status={heartbeatStatus}
                          scriptDetails={verificationStatus?.scriptDetails}
                          onRetry={handleVerifyScript}
                        />
                        <BeaconTracker
                          events={beaconEvents}
                          isConnected={!!verificationStatus?.scriptDetails?.heartbeat}
                          maxEvents={5}
                        /> */}
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg bg-zinc-900/50 p-8 dark:bg-zinc-100/95"
                  >
                    <div className="mx-auto max-w-2xl space-y-4 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="mb-2 text-xl font-medium text-white dark:text-gray-900">
                          Ready to Verify Your Integration?
                        </h3>
                        <p className="text-lg text-zinc-400 dark:text-zinc-600">
                          Add the script to your website and click &quot;Check Integration&quot; to
                          verify the installation. We&apos;ll run a comprehensive check of both
                          public and private verification metrics.
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400"
                      >
                        <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                        <span>Waiting for verification</span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showHelp && (
                <motion.div
                  ref={sidebarRef}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="fixed right-0 top-0 z-40 h-full w-full overflow-y-auto border-l border-zinc-800 bg-zinc-950 dark:border-gray-200 dark:bg-white sm:w-[480px]"
                >
                  <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white dark:text-gray-900">
                        Integration Guide
                      </h2>
                      <button
                        onClick={() => setShowHelp(false)}
                        className="p-2 text-zinc-400 transition-colors hover:text-white dark:hover:text-black"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-zinc-400 dark:text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search frameworks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-10 pr-4 text-white placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-gray-200 dark:bg-gray-50 dark:text-gray-900 dark:placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-6">
                      {Object.entries(groupProvidersByCategory(SCRIPT_PROVIDERS)).map(
                        ([category, providers]: [string, ScriptProvider[]]) => (
                          <div key={category} className="space-y-2">
                            <h3 className="font-medium text-white dark:text-black">{category}</h3>
                            <div className="space-y-2">
                              {providers.map((provider) => (
                                <ProviderCard key={provider.name} provider={provider} />
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </TooltipPrimitive.Provider>
  );
};
