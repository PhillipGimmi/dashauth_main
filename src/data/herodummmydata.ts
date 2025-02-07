import { Building2, Stethoscope, ShoppingBag, Users } from 'lucide-react';

interface BusinessContext {
  icon: React.ComponentType;
  title: string;
  subtitle: string;
  description: string;
  compliance: string[];
  terminalMessages: string[];
}

export type BusinessContexts = {
  [key in 'enterprise' | 'healthcare' | 'ecommerce' | 'workforce']: BusinessContext;
};

export const businessContexts: BusinessContexts = {
  enterprise: {
    icon: Building2,
    title: 'Enterprise-grade authentication',
    subtitle: 'Without enterprise-grade complexity',
    description:
      'Deploy compliant authentication across your organization in minutes, not months. Get real-time visibility into access patterns and compliance status through intuitive dashboards.',
    compliance: ['ISO 27001', 'SOC 2', 'GDPR'],
    terminalMessages: [
      'Initializing compliance scan...',
      'Authentication protocols: Active ✓',
      'SSO integration: Verified',
      'Compliance dashboard: Live',
      'Risk assessment: Completed',
      'Access patterns: Monitored',
      'Authentication ready',
    ],
  },
  healthcare: {
    icon: Stethoscope,
    title: 'HIPAA-ready authentication',
    subtitle: 'Implementation in hours, not weeks',
    description:
      'Meet HIPAA requirements out of the box with our pre-configured authentication system. Monitor compliance in real-time and generate audit reports with one click.',
    compliance: ['HIPAA', 'HITECH', 'SOC 2'],
    terminalMessages: [
      'HIPAA compliance check...',
      'Authentication protocol: Verified ✓',
      'Audit logs: Enabled',
      'Access controls: Configured',
      'Compliance reporting: Active',
      'Provider verification: Ready',
      'Secure access established',
    ],
  },
  ecommerce: {
    icon: ShoppingBag,
    title: 'Frictionless authentication',
    subtitle: 'Security without sacrificing conversion',
    description:
      'Add secure authentication to your platform in minutes. Get detailed insights into user patterns and maintain compliance without managing complex infrastructure.',
    compliance: ['PCI DSS', 'GDPR', 'SOC 2'],
    terminalMessages: [
      'Configuring auth flow...',
      'User verification: Active ✓',
      'Session management: Secured',
      'Authentication metrics: Live',
      'Compliance status: Green',
      'User patterns: Tracked',
      'Auth system ready',
    ],
  },
  workforce: {
    icon: Users,
    title: 'Unified team authentication',
    subtitle: 'Set up once, scale endlessly',
    description:
      'Centralize authentication across all your tools and teams. Monitor access patterns, maintain compliance, and manage permissions through a single dashboard.',
    compliance: ['ISO 27001', 'SOC 2', 'CCPA'],
    terminalMessages: [
      'Setting up team auth...',
      'Role-based access: Configured ✓',
      'Team permissions: Mapped',
      'Access monitoring: Active',
      'Compliance dashboard: Ready',
      'Auth patterns: Tracked',
      'Team access secured',
    ],
  },
};
