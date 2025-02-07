export interface CommandCategory {
  name: string;
  commands: string[];
}

export interface Feature {
  name: string;
  items: string[];
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
}

export interface ServiceStatus {
  name: string;
  status: string;
}

export interface SdkVersion {
  name: string;
  version: string;
}

export interface Command {
  name: string;
  description: string;
  action: () => string;
}

export interface ContactInfo {
  channel: string;
  value: string;
}

const formatSection = (title: string, content: string): string => `${title}
      -------------------
  ${content}`;

const formatItems = (items: string[]): string => {
  return items.map((item) => '• ' + item).join('\n    ');
};

const formatCategory = (category: Feature): string => {
  return category.name + ':\n    ' + formatItems(category.items);
};

const formatFeatures = (features: Feature[]): string => {
  return features.map(formatCategory).join('\n\n    ');
};

const formatList = (items: string[]): string => {
  return items.map((item) => `• ${item}`).join('\n    ');
};

export const initialMessages = [
  'Welcome to DashAuth Terminal',
  'Initializing secure connection...',
  'Verifying environment...',
  'Loading security protocols...',
  'Establishing encrypted channel...',
  'Connection established',
  'Type "help" to see available commands.',
];

const authFeatures: Feature[] = [
  {
    name: 'Core Features',
    items: [
      'JWT-based authentication',
      'Passwordless authentication',
      'Social login integration',
      'Custom authentication flows',
      'Brute force protection',
      'Account linking',
      'Custom claims support',
    ],
  },
  {
    name: 'Security Features',
    items: [
      'Automatic password hashing',
      'Session management',
      'Rate limiting',
      'IP blocking',
      'Device fingerprinting',
      'Risk-based authentication',
    ],
  },
  {
    name: 'Integration Methods',
    items: [
      'REST API',
      'GraphQL API',
      'WebSocket support',
      'Mobile SDK',
      'Web SDK',
      'Server-side libraries',
    ],
  },
];

const securityFeatures: Feature[] = [
  {
    name: 'Encryption',
    items: [
      'AES-256 data encryption',
      'RSA public/private key',
      'End-to-end encryption',
      'At-rest encryption',
      'In-transit encryption',
    ],
  },
  {
    name: 'Protection',
    items: [
      'DDoS mitigation',
      'WAF integration',
      'Rate limiting',
      'Fraud detection',
      'Bot protection',
      'XSS prevention',
      'CSRF protection',
    ],
  },
  {
    name: 'Compliance',
    items: [
      'SOC2 Type II',
      'ISO 27001',
      'GDPR compliant',
      'HIPAA ready',
      'PCI DSS Level 1',
      'CCPA compliant',
    ],
  },
  {
    name: 'Monitoring',
    items: [
      '24/7 security monitoring',
      'Automatic threat detection',
      'Security alerts',
      'Audit logging',
      'Access monitoring',
    ],
  },
];

const mfaFeatures: Feature[] = [
  {
    name: 'Supported Methods',
    items: [
      'TOTP (Google Auth)',
      'SMS verification',
      'Email codes',
      'Security keys (FIDO2)',
      'Biometric',
      'Push notifications',
      'Hardware tokens',
    ],
  },
  {
    name: 'Features',
    items: [
      'Multiple factor support',
      'Custom factor rules',
      'Risk-based MFA',
      'Backup codes',
      'Remember device',
      'Force MFA policy',
      'Custom challenges',
    ],
  },
  {
    name: 'Integration',
    items: [
      'REST API support',
      'SDK integration',
      'WebAuthn support',
      'Custom UI options',
      'Branded experience',
    ],
  },
];

const ssoFeatures: Feature[] = [
  {
    name: 'Supported Protocols',
    items: ['SAML 2.0', 'OpenID Connect', 'OAuth 2.0', 'WS-Federation'],
  },
  {
    name: 'Identity Providers',
    items: ['Active Directory', 'Azure AD', 'Okta', 'Google Workspace', 'Custom IdP'],
  },
  {
    name: 'Features',
    items: [
      'Just-in-time provisioning',
      'Attribute mapping',
      'Role mapping',
      'Group sync',
      'Custom claims',
      'IdP-initiated login',
      'SP-initiated login',
    ],
  },
  {
    name: 'Enterprise Features',
    items: [
      'Multiple IdP support',
      'Automatic user sync',
      'Custom attributes',
      'Advanced mapping',
      'Identity federation',
    ],
  },
];

const pricingTiers: PricingTier[] = [
  {
    name: 'Developer Plan',
    price: '$29/month',
    features: [
      '10,000 monthly active users',
      'Basic authentication',
      'Email/password + social login',
      'Community support',
      '99.9% uptime SLA',
    ],
  },
  {
    name: 'Business Plan',
    price: '$199/month',
    features: [
      '50,000 monthly active users',
      'Advanced authentication',
      'SSO + MFA',
      'Premium support',
      '99.95% uptime SLA',
      'Custom domains',
    ],
  },
  {
    name: 'Enterprise Plan',
    price: 'Custom pricing',
    features: [
      'Unlimited users',
      'Custom features',
      'Dedicated support',
      '99.99% uptime SLA',
      'Custom SLA',
      'Dedicated infrastructure',
      'Advanced security',
      'Custom compliance',
    ],
  },
];

const apiEndpoints = {
  auth: [
    'POST /auth/login',
    'POST /auth/register',
    'POST /auth/logout',
    'POST /auth/refresh',
    'GET  /auth/session',
  ],
  users: [
    'GET    /users',
    'POST   /users',
    'GET    /users/:id',
    'PATCH  /users/:id',
    'DELETE /users/:id',
  ],
  mfa: ['POST /mfa/enable', 'POST /mfa/disable', 'POST /mfa/verify', 'GET  /mfa/status'],
  roles: ['GET    /roles', 'POST   /roles', 'DELETE /roles/:id', 'PATCH  /roles/:id'],
};

const systemStatus = {
  metrics: {
    uptime: '99.99%',
    apiResponse: '45ms',
    errorRate: '0.001%',
  },
  regions: [
    { name: 'US-East', status: 'Operational' },
    { name: 'US-West', status: 'Operational' },
    { name: 'EU-Central', status: 'Operational' },
    { name: 'AP-South', status: 'Operational' },
    { name: 'AP-East', status: 'Operational' },
  ],
  services: [
    { name: 'Authentication', status: '✓' },
    { name: 'Database', status: '✓' },
    { name: 'API', status: '✓' },
    { name: 'MFA', status: '✓' },
    { name: 'SSO', status: '✓' },
    { name: 'Webhooks', status: '✓' },
  ],
};

const versionInfo = {
  current: '2.4.0',
  released: 'March 2024',
  build: '2024.03.15.1',
  sdks: [
    { name: 'Node.js', version: '2.4.0' },
    { name: 'Python', version: '2.4.0' },
    { name: 'Java', version: '2.4.0' },
    { name: 'Go', version: '2.4.0' },
    { name: 'Ruby', version: '2.4.0' },
    { name: 'PHP', version: '2.4.0' },
  ],
  compatibility: [
    { name: 'OAuth', version: '2.0' },
    { name: 'OIDC', version: '1.0' },
    { name: 'SAML', version: '2.0' },
  ],
};

const contactInfo = {
  support: [
    { channel: 'Email', value: 'support@dashauth.com' },
    { channel: 'Phone', value: '+1 (888) 555-0123' },
    { channel: 'Chat', value: 'dashboard.dashauth.com' },
    { channel: 'Docs', value: 'docs.dashauth.com' },
  ],
  responseTimes: [
    { channel: 'Enterprise', value: '1 hour' },
    { channel: 'Business', value: '4 hours' },
    { channel: 'Developer', value: '24 hours' },
  ],
  offices: [
    { location: 'SF HQ', address: '123 Tech St' },
    { location: 'NYC', address: '456 Dev Ave' },
    { location: 'London', address: '789 Auth Lane' },
  ],
  social: [
    { platform: 'Twitter', handle: '@dashauth' },
    { platform: 'GitHub', handle: 'github.com/dashauth' },
    { platform: 'LinkedIn', handle: 'linkedin.com/dashauth' },
  ],
};

const commandCategories = {
  authentication: ['auth', 'sso', 'mfa', 'oauth', 'session', 'tokens', 'passwordless'],
  security: [
    'security',
    'encryption',
    'audit',
    'compliance',
    '2fa',
    'recovery',
    'roles',
    'permissions',
  ],
  integration: ['api', 'sdk', 'webhooks', 'events', 'callbacks', 'libraries', 'frameworks'],
  infrastructure: ['setup', 'deploy', 'regions', 'scaling', 'monitoring', 'backup', 'migration'],
  billing: ['pricing', 'usage', 'limits', 'upgrade', 'enterprise'],
  support: ['contact', 'status', 'docs', 'examples', 'about', 'version', 'changelog'],
};

export const commands: Command[] = [
  {
    name: 'help',
    description: 'Show available commands',
    action: () => {
      const commandList = Object.entries(commandCategories)
        .map(([category, cmds]) => {
          const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
          const commandDetails = cmds
            .map((cmd) => {
              const description = commands.find((c) => c.name === cmd)?.description ?? '';
              return `${cmd.padEnd(12)} - ${description}`;
            })
            .join('\n      ');
          return `${categoryTitle}\n      ${commandDetails}`;
        })
        .join('\n\n    ');

      return formatSection('Available Commands', commandList);
    },
  },
  {
    name: 'auth',
    description: 'Authentication overview',
    action: () => formatSection('Authentication System Overview', formatFeatures(authFeatures)),
  },
  {
    name: 'security',
    description: 'Security features',
    action: () => formatSection('Security Features Overview', formatFeatures(securityFeatures)),
  },
  {
    name: 'pricing',
    description: 'Pricing information',
    action: () => {
      const pricingDetails = pricingTiers
        .map((tier) => {
          const features = formatList(tier.features);
          return `${tier.name}: ${tier.price}\n    ${features}`;
        })
        .join('\n\n    ');

      return formatSection('DashAuth Pricing Plans', pricingDetails);
    },
  },
  {
    name: 'mfa',
    description: 'MFA implementation',
    action: () => formatSection('Multi-Factor Authentication', formatFeatures(mfaFeatures)),
  },
  {
    name: 'api',
    description: 'API documentation',
    action: () => {
      const endpointsList = Object.entries(apiEndpoints)
        .map(([category, endpoints]) => {
          const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
          return `${categoryTitle}:\n    ${endpoints.join('\n    ')}`;
        })
        .join('\n\n    ');

      const rateLimits = [
        '• 1000 requests/min (free)',
        '• 10000 requests/min (pro)',
        '• Custom limits (enterprise)',
      ].join('\n      ');

      const content = [
        'Base URL: api.dashauth.com\n',
        endpointsList,
        '\n      Rate Limits:',
        rateLimits,
        '\n      For full documentation:',
        'docs.dashauth.com/api',
      ].join('\n      ');

      return formatSection('API Documentation', content);
    },
  },
  {
    name: 'sso',
    description: 'SSO implementation',
    action: () => formatSection('Single Sign-On (SSO)', formatFeatures(ssoFeatures)),
  },
  {
    name: 'status',
    description: 'System status',
    action: () => {
      const regionStatus = systemStatus.regions
        .map((r) => `• ${r.name.padEnd(12)}: ${r.status}`)
        .join('\n    ');

      const serviceHealth = systemStatus.services
        .map((s) => `• ${s.name.padEnd(12)}: ${s.status}`)
        .join('\n    ');

      const content = [
        'All Systems Operational\n',
        `Current Uptime: ${systemStatus.metrics.uptime}`,
        `API Response: ${systemStatus.metrics.apiResponse}`,
        `Error Rate: ${systemStatus.metrics.errorRate}\n`,
        'Region Status:',
        regionStatus,
        '\nService Health:',
        serviceHealth,
        '\nLast Incident: None',
        'Scheduled Maintenance: None',
      ].join('\n    ');

      return formatSection('System Status', content);
    },
  },
  {
    name: 'version',
    description: 'Version information',
    action: () => {
      const sdkVersions = versionInfo.sdks
        .map((sdk) => `• ${sdk.name.padEnd(8)}: ${sdk.version}`)
        .join('\n    ');

      const compatibility = versionInfo.compatibility
        .map((c) => `• ${c.name}: ${c.version}`)
        .join('\n    ');

      const content = [
        `Current Version: ${versionInfo.current}`,
        `Released: ${versionInfo.released}`,
        `Build: ${versionInfo.build}\n`,
        'SDK Versions:',
        sdkVersions,
        '\nCompatibility:',
        compatibility,
      ].join('\n    ');

      return formatSection('DashAuth Version Info', content);
    },
  },
  {
    name: 'contact',
    description: 'Contact information',
    action: () => {
      const supportChannels = contactInfo.support
        .map((s) => `• ${s.channel}: ${s.value}`)
        .join('\n    ');

      const responseTimes = contactInfo.responseTimes
        .map((rt) => `• ${rt.channel}: ${rt.value}`)
        .join('\n    ');

      const offices = contactInfo.offices
        .map((o) => `• ${o.location}: ${o.address}`)
        .join('\n    ');

      const social = contactInfo.social.map((s) => `• ${s.platform}: ${s.handle}`).join('\n    ');

      const content = [
        'Support Channels:',
        supportChannels,
        '\nResponse Times:',
        responseTimes,
        '\nOffice Locations:',
        offices,
        '\nSocial:',
        social,
      ].join('\n    ');

      return formatSection('Contact Information', content);
    },
  },
];
