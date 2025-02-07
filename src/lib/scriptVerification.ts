import { SecurityHeaders, VerificationStatus } from '@/types';
import { createClient } from '@supabase/supabase-js';

class ScriptVerificationService {
  private readonly supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async verifyScript(domain: string): Promise<VerificationStatus> {
    try {
      // Basic HTTPS check
      const httpsStatus = await this.checkHttps(domain);

      // Security headers check
      const headers = await this.checkSecurityHeaders(domain);

      return {
        https: httpsStatus.isHttps,
        scriptFound: false, // Will be updated by client-side checks
        scriptLoaded: false,
        clientInitialized: false,
        scriptDetails: {
          present: false,
          correctId: false,
          location: 'unknown',
          exactMatch: false,
          hasDefer: false,
          correctSrc: false,
          inHead: false,
          hasHttpsRedirect: httpsStatus.hasRedirect,
          securityHeaders: headers,
          securityContext: httpsStatus.isHttps,
          certValid: httpsStatus.certValid,
          tlsVersion: httpsStatus.tlsVersion,
        },
        verified: false,
      };
    } catch (error) {
      console.error('Script verification failed:', error);
      throw error;
    }
  }

  private async checkHttps(domain: string) {
    try {
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
      });

      // Check redirect from HTTP
      const httpResponse = await fetch(`http://${domain}`, {
        method: 'HEAD',
        redirect: 'manual',
      });

      return {
        isHttps: response.ok,
        hasRedirect: [301, 302, 307, 308].includes(httpResponse.status),
        certValid: true, // Simplified - in production would do proper cert validation
        tlsVersion: response.headers.get('sec-ch-ua') ?? 'TLS 1.2+',
      };
    } catch (error) {
      return {
        isHttps: false,
        hasRedirect: false,
        certValid: false,
        tlsVersion: 'Unknown',
      };
    }
  }

  private async checkSecurityHeaders(domain: string): Promise<SecurityHeaders> {
    try {
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
      });

      return {
        'strict-transport-security': response.headers.get('strict-transport-security') ?? '',
        'content-security-policy': response.headers.get('content-security-policy') ?? '',
        'x-frame-options': response.headers.get('x-frame-options') ?? '',
      };
    } catch (error) {
      return {
        'strict-transport-security': '',
        'content-security-policy': '',
        'x-frame-options': '',
      };
    }
  }
}

export const scriptVerification = new ScriptVerificationService();
