// constants.ts
import { SetupOption } from '@/app/types/types';
import { Globe, Smartphone, TabletSmartphone } from 'lucide-react';

export const COMMON_EMAIL_PROVIDERS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'protonmail.com',
  'icloud.com',
] as const;

export const SETUP_OPTIONS: SetupOption[] = [
  {
    id: 'single_page_application',
    title: 'Single Page Application',
    description: 'React, Vue, Angular or any other modern JavaScript framework',
    icon: Globe,
    tags: [
      'react',
      'vue',
      'angular',
      'spa',
      'javascript',
      'typescript',
      'next.js',
      'nuxt',
      'gatsby',
    ],
  },
  {
    id: 'traditional_website',
    title: 'Traditional Website',
    description: 'PHP, Ruby, Python or any server-rendered website',
    icon: Globe,
    tags: ['php', 'ruby', 'python', 'laravel', 'django', 'rails', 'wordpress', 'server-side'],
  },
  {
    id: 'android_app',
    title: 'Android Application',
    description: 'Native Android or cross-platform mobile application',
    icon: Smartphone,
    tags: ['android', 'kotlin', 'java', 'react native', 'flutter', 'mobile'],
  },
  {
    id: 'ios_app',
    title: 'iOS Application',
    description: 'Native iOS or cross-platform mobile application',
    icon: TabletSmartphone,
    tags: ['ios', 'swift', 'objective-c', 'react native', 'flutter', 'mobile'],
  },
];
