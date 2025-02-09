import { VerificationPayload } from '@/app/types';

import { DNS_PROVIDERS, DOMAIN_VERIFICATION_FAQ } from '@/data/faqData';
import { scriptVerification } from '@/app/lib/scriptVerification';

export async function verifyDomainInstallation(payload: VerificationPayload) {
  try {
    const result = await scriptVerification.verifyScript(payload.domain);

    return {
      success: result.verified,
      details: result,
      error: result.verified ? null : 'Script verification failed',
    };
  } catch (error) {
    return {
      success: false,
      details: null,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

export interface DNSProvider {
  name: string;
  category: string;
  region: string;
  instructions: string;
  propagationTime?: string;
  steps?: string[];
  errorMessages?: {
    [key: string]: string;
  };
  validationRules?: {
    [key: string]: RegExp | ((value: string) => boolean);
  };
}

export { DNS_PROVIDERS, DOMAIN_VERIFICATION_FAQ };
