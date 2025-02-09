import { Shield, Lock, FileCheck } from 'lucide-react';

export interface Framework {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  features: { id: string; text: string }[];
  businessValue: string;
  requirements: { id: string; text: string }[];
}

const createFeature = (frameworkId: string, index: number, text: string) => ({
  id: `${frameworkId}-f${index + 1}`,
  text,
});

const createRequirement = (frameworkId: string, index: number, text: string) => ({
  id: `${frameworkId}-r${index + 1}`,
  text,
});

const createFramework = (
  id: string,
  name: string,
  description: string,
  icon: React.ElementType,
  features: string[],
  businessValue: string,
  requirements: string[]
): Framework => ({
  id,
  name,
  description,
  icon,
  features: features.map((text, index) => createFeature(id, index, text)),
  businessValue,
  requirements: requirements.map((text, index) => createRequirement(id, index, text)),
});

export const frameworks: Framework[] = [
  createFramework(
    'soc2',
    'SOC 2',
    'Security, Availability, Processing Integrity, Confidentiality, and Privacy',
    Shield,
    [
      'Access Control & Authentication',
      'System Operations & Monitoring',
      'Risk Management & Security',
      'Data Protection & Privacy',
      'Incident Response Plans',
    ],
    'SOC 2 compliance is crucial for B2B SaaS companies. Our integrated solution provides continuous monitoring, automated evidence collection, and real-time compliance dashboards, saving your team countless hours of manual work.',
    ['Annual Audit', 'Continuous Monitoring', 'Security Controls', 'Employee Training']
  ),
  createFramework(
    'gdpr',
    'GDPR',
    'European Union Data Protection and Privacy Standards',
    Lock,
    [
      'Data Processing Agreements',
      'User Consent Management',
      'Right to Data Portability',
      'Privacy by Design',
      'Data Breach Notifications',
    ],
    'GDPR compliance is mandatory for serving EU customers. Our platform handles all GDPR requirements out-of-the-box, including consent management, data portability, and automated privacy impact assessments.',
    [
      'DPO Assignment',
      'Privacy Impact Assessments',
      'Data Processing Records',
      'Breach Notifications',
    ]
  ),
  createFramework(
    'hipaa',
    'HIPAA',
    'Healthcare Data Security and Privacy',
    FileCheck,
    [
      'PHI Data Encryption',
      'Access Controls & Auditing',
      'Business Associate Agreements',
      'Security Risk Analysis',
      'Breach Notification Protocol',
    ],
    'Healthcare companies must maintain HIPAA compliance or face severe penalties. Our solution provides comprehensive HIPAA compliance features, including BAA management and PHI handling protocols.',
    ['Privacy Rule', 'Security Rule', 'Breach Notification', 'Regular Risk Assessments']
  ),
];
