export interface SecurityHeaders {
  'strict-transport-security': string;
  'content-security-policy': string;
  'x-frame-options': string;
}

export interface VerificationStatus {
  https: boolean;
  scriptFound: boolean;
  scriptLoaded: boolean;
  clientInitialized: boolean;
  scriptDetails: {
    present: boolean;
    correctId: boolean;
    location: 'head' | 'body' | 'unknown';
    exactMatch: boolean;
    hasDefer: boolean;
    correctSrc: boolean;
    inHead: boolean;
    hasHttpsRedirect: boolean;
    securityHeaders: SecurityHeaders;
    securityContext: boolean;
    certValid: boolean;
    tlsVersion?: string;
  };
  verified: boolean;
}

export interface VerificationPayload {
  domain: string;
  clientId: string;
  timestamp?: number;
}
