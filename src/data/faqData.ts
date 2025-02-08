export type FAQTag =
  | 'react'
  | 'react-19'
  | 'spa'
  | 'traditional'
  | 'server-side'
  | 'client-side'
  | 'webapp'
  | 'mobile'
  | 'desktop'
  | 'nocode'
  | 'webflow'
  | 'framer'
  | 'flutterflow'
  | 'electron'
  | 'lowcode'
  | 'angular'
  | 'vue'
  | 'svelte'
  | 'nextjs'
  | 'nuxtjs'
  | 'blazor'
  | 'django'
  | 'flask'
  | 'rails'
  | 'wordpress'
  | 'shopify'
  | 'static-site'
  | 'gatsby'
  | 'eleventy'
  | 'web'
  | 'tauri'
  | 'react-native'
  | 'vanilla-js'
  | 'jquery'
  | 'alpinejs'
  | 'astro'
  | 'emberjs'
  | 'handlebars'
  | 'qwik'
  | 'lit'
  | 'preact'
  | 'htmx'
  | 'solidjs'
  | 'elm'
  | 'nwjs'
  | 'squarespace'
  | 'wix'
  | 'windows'
  | 'macos'
  | 'linux'
  | 'unity'
  | 'godot'
  | 'pyqt'
  | 'pyside'
  | 'python'
  | 'txt'
  | 'dns'
  | 'record'
  | 'basics'
  | 'time'
  | 'propagation'
  | 'setup'
  | 'troubleshooting'
  | 'error'
  | 'failed';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

// Create reusable answer templates
const ANSWER_TEMPLATES = {
  traditionalOnly: (platform: string) => 
    `${platform} apps render content on the server. Choose 'Traditional Web App'.`,
  
  traditionalOrSpa: (platform: string, spaCondition: string) =>
    `For standard ${platform}, select 'Traditional Web App'. If you use ${spaCondition}, select 'Single Page Application'.`,
  
  desktopApp: (platform: string, specificFeatures: string) =>
    `For a native ${platform} desktop app, choose 'Traditional Web App' for centralized API authentication. For ${platform}-specific workflows (${specificFeatures}), integrate these with your backend service.`
};

// Group similar FAQs
const createServerFrameworkFaq = (id: string, platform: string) => ({
  id: `faq-${id}`,
  question: `I use ${platform}. What should I select?`,
  answer: ANSWER_TEMPLATES.traditionalOnly(platform),
  tags: [platform.toLowerCase().replace(/\s+/g, ''), 'traditional'],
});

const createCmsFaq = (id: string, platform: string, spaCondition: string) => ({
  id: `faq-${id}`,
  question: `I use ${platform}. What should I select?`,
  answer: ANSWER_TEMPLATES.traditionalOrSpa(platform, spaCondition),
  tags: [platform.toLowerCase().replace(/\s+/g, ''), 'traditional', 'spa'],
});

const createDesktopFaq = (id: string, platform: string, specificFeatures: string) => ({
  id: `faq-${id}`,
  question: `I am building a desktop app for ${platform}. What should I select?`,
  answer: ANSWER_TEMPLATES.desktopApp(platform, specificFeatures),
  tags: [platform.toLowerCase().replace(/\s+/g, ''), 'desktop', 'traditional'],
});

export const FAQ_ITEMS: FAQItem[] = [
  // React and React Native
  {
    id: 'faq-1',
    question: 'I use React. What should I select?',
    answer:
      "If your React app uses client-side routing (e.g., react-router) and dynamically updates without full page reloads, select 'Single Page Application'. If it uses server-side rendering (e.g., with Next.js), select 'Traditional Web App'.",
    tags: ['react', 'spa', 'traditional', 'nextjs'],
  },
  {
    id: 'faq-2',
    question: 'I use React Native. What should I select?',
    answer:
      "React Native builds native apps for iOS and Android. If your app handles platform-specific authentication workflows (e.g., native SDKs for OAuth, biometric login), choose 'iOS App' or 'Android App' based on the platform. However, if you want a unified backend authentication flow using a centralized API, select 'Traditional Web App' for cross-platform compatibility.",
    tags: ['react-native', 'mobile', 'traditional'],
  },

  // Angular, Vue, Svelte
  {
    id: 'faq-3',
    question: 'I use Angular or Vue. What should I select?',
    answer:
      "If your Angular or Vue app uses client-side routing, choose 'Single Page Application'. For server-rendered apps (e.g., Angular Universal or Nuxt.js), select 'Traditional Web App'.",
    tags: ['angular', 'vue', 'spa', 'server-side', 'nuxtjs'],
  },
  {
    id: 'faq-4',
    question: 'I use Svelte. What should I select?',
    answer:
      "If your Svelte app updates dynamically on the client, select 'Single Page Application'. For apps rendered on the server with SvelteKit, select 'Traditional Web App'.",
    tags: ['svelte', 'spa', 'server-side'],
  },

  // Server Frameworks
  createServerFrameworkFaq('5', 'Django/Flask'),
  createServerFrameworkFaq('6', 'Ruby on Rails'),

  // CMS Platforms
  createCmsFaq('7', 'WordPress', 'WordPress as a headless CMS with a custom JavaScript frontend'),
  createCmsFaq('8', 'Shopify', 'a headless storefront like Hydrogen'),
  createServerFrameworkFaq('9', 'Squarespace or Wix'),

  // Static Site Generators
  {
    id: 'faq-10',
    question: 'I use Gatsby or Eleventy. What should I select?',
    answer: "Both Gatsby and Eleventy generate static HTML. Select 'Traditional Web App'.",
    tags: ['gatsby', 'eleventy', 'static-site', 'traditional'],
  },
  {
    id: 'faq-11',
    question: 'I use Astro. What should I select?',
    answer:
      "Astro apps typically generate static sites or server-rendered content. Select 'Traditional Web App'.",
    tags: ['astro', 'static-site', 'traditional'],
  },

  // JavaScript Frameworks
  {
    id: 'faq-12',
    question: 'I use Vanilla JavaScript. What should I select?',
    answer:
      "For Vanilla JavaScript apps, select 'Single Page Application' if your app dynamically updates content. For server-rendered or static sites, select 'Traditional Web App'.",
    tags: ['vanilla-js', 'spa', 'traditional'],
  },
  {
    id: 'faq-13',
    question: 'I use jQuery. What should I select?',
    answer:
      "jQuery-based apps are typically server-rendered and enhance static HTML. Select 'Traditional Web App'.",
    tags: ['jquery', 'traditional'],
  },
  {
    id: 'faq-14',
    question: 'I use Alpine.js. What should I select?',
    answer: "Alpine.js apps typically enhance server-rendered HTML. Select 'Traditional Web App'.",
    tags: ['alpinejs', 'traditional'],
  },
  {
    id: 'faq-15',
    question: 'I use Ember.js. What should I select?',
    answer: "Ember.js apps are typically SPAs. Select 'Single Page Application'.",
    tags: ['emberjs', 'spa'],
  },
  {
    id: 'faq-16',
    question: 'I use Solid.js. What should I select?',
    answer: "Solid.js apps are typically SPAs. Select 'Single Page Application'.",
    tags: ['solidjs', 'spa'],
  },
  {
    id: 'faq-17',
    question: 'I use HTMX. What should I select?',
    answer:
      "HTMX enhances server-rendered pages with dynamic updates. Select 'Traditional Web App'.",
    tags: ['htmx', 'traditional'],
  },

  // Mobile App Frameworks
  {
    id: 'faq-18',
    question: 'I use Flutter. What should I select?',
    answer:
      "For Flutter mobile apps, choose 'iOS App' or 'Android App' based on your target platform. For web builds, select 'Traditional Web App'.",
    tags: ['flutterflow', 'mobile', 'web'],
  },
  {
    id: 'faq-19',
    question: 'I use Blazor. What should I select?',
    answer:
      "If your Blazor app uses WebAssembly and updates dynamically, choose 'Single Page Application'. If it's server-hosted, select 'Traditional Web App'.",
    tags: ['blazor', 'spa', 'traditional'],
  },
  {
    id: 'faq-20',
    question: 'I use Elm. What should I select?',
    answer: "Elm apps are typically SPAs. Select 'Single Page Application'.",
    tags: ['elm', 'spa'],
  },

  // Desktop Apps
  createDesktopFaq('21', 'Windows', 'e.g., Active Directory, Microsoft Authentication Library'),
  createDesktopFaq('22', 'macOS', 'e.g., Keychain, Touch ID'),
  createDesktopFaq('23', 'Linux', 'e.g., PAM for authentication'),
  {
    id: 'faq-24',
    question: 'I am building a desktop app with Electron.js. What should I select?',
    answer:
      "For Electron.js apps, choose 'Traditional Web App' since Electron typically uses centralized API authentication for both desktop and web compatibility. You can also integrate platform-specific authentication workflows, such as biometric login, using Electron's native modules.",
    tags: ['electron', 'desktop', 'traditional'],
  },
  {
    id: 'faq-25',
    question: 'I am building a desktop app with Flutter Desktop. What should I select?',
    answer:
      "Flutter Desktop apps for Windows, macOS, and Linux should use 'Traditional Web App' for centralized API-based authentication. If you need platform-specific features like biometric login (e.g., Face ID or Windows Hello), integrate them via platform channels and connect to your backend service.",
    tags: ['flutterflow', 'desktop', 'windows', 'macos', 'linux', 'traditional'],
  },
  {
    id: 'faq-26',
    question: 'I am building a desktop app with Tauri. What should I select?',
    answer:
      "Tauri apps, which combine Rust and web technologies, should use 'Traditional Web App' for authentication via a centralized API. For platform-specific workflows like biometric login, integrate these through Tauri's native bindings and ensure backend compatibility.",
    tags: ['tauri', 'desktop', 'traditional'],
  },
  {
    id: 'faq-27',
    question: 'I am building a desktop app with NW.js. What should I select?',
    answer:
      "NW.js apps, like Electron.js, typically rely on centralized API authentication for cross-platform compatibility. Select 'Traditional Web App' and use native modules for platform-specific features if needed.",
    tags: ['nwjs', 'desktop', 'traditional'],
  },
  {
    id: 'faq-28',
    question:
      'I am building a desktop app with Qt for Python (PySide or PyQt). What should I select?',
    answer:
      "For apps built with PySide or PyQt, select 'Traditional Web App' if using centralized API-based authentication. For local authentication workflows, ensure integration with your backend where applicable.",
    tags: ['pyside', 'pyqt', 'python', 'desktop', 'traditional'],
  },
  {
    id: 'faq-29',
    question: 'I am building a desktop app with Unity. What should I select?',
    answer:
      "For Unity desktop apps, choose 'Traditional Web App' if using a centralized API for authentication. For apps with local-only workflows, you may need to customize backend integration as Unity is not inherently tied to web authentication standards.",
    tags: ['unity', 'desktop', 'traditional'],
  },
  {
    id: 'faq-30',
    question: 'I am building a desktop app with Godot. What should I select?',
    answer:
      "Godot desktop apps should use 'Traditional Web App' for centralized API-based authentication. For platform-specific workflows, integrate native extensions where needed and connect them to your backend service.",
    tags: ['godot', 'desktop', 'traditional'],
  },
  {
    id: 'faq-31',
    question: 'I am building a desktop app with Windows Forms or WPF. What should I select?',
    answer:
      "For apps built with Windows Forms or WPF, choose 'Traditional Web App' to use centralized API-based authentication. If you require integration with Active Directory or other Windows-specific workflows, ensure compatibility with your backend.",
    tags: ['windows', 'desktop', 'traditional'],
  },
] as const;

// Create base interface for DNS providers
interface BaseDNSProvider {
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

// Create template strings for common instructions
const INSTRUCTION_TEMPLATES = {
  dns: (service: string) => `${service} DNS setup...`,
  domain: (service: string) => `${service} domain service...`,
  hosting: (service: string) => `${service} hosting service...`,
  registry: (region: string) => `${region} domain registry...`,
} as const;

// Create provider categories
const CATEGORIES = {
  DNS: 'DNS Provider',
  REGISTRAR: 'Domain Registrar',
  HOST: 'Web Host',
  PLATFORM: 'Platform Provider',
  CONTROL: 'Control Panel',
} as const;

// Create regions
const REGIONS = {
  GLOBAL: 'Global',
  AFRICA: 'Africa',
  ASIA: 'Asia',
  EUROPE: 'Europe',
  MIDDLE_EAST: 'Middle East',
  OCEANIA: 'Oceania',
  SOUTH_AMERICA: 'South America',
  CARIBBEAN: 'Caribbean',
  CENTRAL_AMERICA: 'Central America',
  CENTRAL_ASIA: 'Central Asia',
} as const;

// Create type for category keys
type CategoryKey = keyof typeof CATEGORIES;
type RegionKey = keyof typeof REGIONS;

// Update PROVIDERS type
interface ProviderGroups {
  global: {
    dns: string[];
    registrars: string[];
    hosting: string[];
  };
  asia: {
    dns: string[];
    registrars: string[];
  };
  // Add other regions as needed
}

const PROVIDERS: ProviderGroups = {
  global: {
    dns: [
      'Akamai Edge DNS',
      'Amazon Route 53',
      'Azure DNS',
      'Cloudflare',
      'Google Cloud DNS',
    ],
    registrars: [
      'Domain.com',
      'GoDaddy',
      'Namecheap',
    ],
    hosting: [
      'A2 Hosting',
      'Bluehost',
      'HostGator',
    ]
  },
  asia: {
    dns: [
      'Alibaba Cloud DNS',
      'Tencent Cloud DNS',
    ],
    registrars: [
      'BigRock',
      'GMO',
      'Onamae.com',
    ]
  },
} as const;

// Helper function to get step status
const getStepStatusHelper = (
  step: string,
  currentStep: string,
  verificationResponse?: any,
  error?: string,
  isVerified?: boolean
) => {
  const stepStates = {
    fetching: {
      completed: verificationResponse?.success ?? false,
      failed: verificationResponse?.success === false,
    },
    checking_txt: {
      completed: (verificationResponse?.records?.length ?? 0) > 0,
      failed: verificationResponse && (!verificationResponse.records || verificationResponse.records.length === 0),
    },
    verifying_match: {
      completed: verificationResponse?.records?.some(
        (record: any) => record.name.includes('_dashauth') && record.type === 'TXT'
      ) ?? false,
      failed: verificationResponse?.records?.every(
        (record: any) => !record.name.includes('_dashauth') || record.type !== 'TXT'
      ) ?? false,
    },
    complete: {
      completed: isVerified,
      failed: error?.includes('TXT record value does not match') ?? false,
    },
  };

  const currentState = stepStates[step as keyof typeof stepStates];

  if (currentState.failed || (step === 'complete' && error)) {
    return 'error';
  }
  if (currentState.completed) {
    return 'complete';
  }
  if (step === currentStep) {
    return 'current';
  }
  return 'pending';
};

// Provider type definitions
interface ProviderBase {
  name: string;
  propagationTime?: string;
  steps?: string[];
}

// Create provider templates to reduce duplication
const createProviderTemplate = (region: string, category: string) => 
  (name: string, additionalProps: Partial<ProviderBase> = {}): BaseDNSProvider => ({
    name,
    category,
    region,
    instructions: INSTRUCTION_TEMPLATES[category === CATEGORIES.DNS ? 'dns' : 'domain'](name),
    ...additionalProps
  });

// Update createProviders function with proper type safety
const createProviders = () => {
  const providers: BaseDNSProvider[] = [];
  
  // Process global providers
  Object.entries(PROVIDERS.global).forEach(([category, names]) => {
    const categoryKey = category.toUpperCase() as CategoryKey;
    const template = createProviderTemplate(REGIONS.GLOBAL, CATEGORIES[categoryKey]);
    names.forEach((name: string) => providers.push(template(name)));
  });
  
  // Process regional providers
  Object.entries(PROVIDERS).forEach(([region, categories]) => {
    if (region !== 'global') {
      Object.entries(categories as Record<string, string[]>).forEach(([category, names]) => {
        const regionKey = region.toUpperCase() as RegionKey;
        const categoryKey = category.toUpperCase() as CategoryKey;
        const template = createProviderTemplate(
          REGIONS[regionKey],
          CATEGORIES[categoryKey]
        );
        names.forEach((name) => providers.push(template(name)));
      });
    }
  });
  
  return providers;
};

export const DNS_PROVIDERS = createProviders();

// Add domain verification FAQs
export const DOMAIN_VERIFICATION_FAQ = [
  {
    id: 'faq-32',
    question: 'What is a TXT record?',
    answer:
      "A TXT record is a type of DNS record that allows you to store text information in your domain's DNS settings. It's commonly used for domain verification, email security, and other domain ownership proofs.",
    tags: ['txt', 'dns', 'record', 'basics'],
  },
  {
    id: 'faq-33',
    question: 'How long does verification take?',
    answer:
      'DNS changes can take anywhere from a few minutes to 48 hours to propagate globally. This is known as DNS propagation time. We recommend waiting at least 5-10 minutes after adding the TXT record before verifying.',
    tags: ['time', 'propagation', 'dns'],
  },
  {
    id: 'faq-34',
    question: 'Where do I add TXT records?',
    answer:
      "TXT records are added in your domain registrar's DNS settings or DNS hosting provider (like Cloudflare, GoDaddy, or Namecheap). Look for 'DNS Management', 'DNS Settings', or 'Advanced DNS' in your provider's dashboard.",
    tags: ['setup', 'dns', 'provider'],
  },
  {
    id: 'faq-35',
    question: 'Verification keeps failing?',
    answer:
      "Common issues include: incorrect record name/value, DNS propagation not complete, or copying extra spaces. Double-check the exact values and ensure you've waited for DNS propagation.",
    tags: ['troubleshooting', 'error', 'failed'],
  },
];

export const faqData = {
  domainVerification: [
    {
      id: 'faq-36',
      question: "How do I verify my domain?",
      answer: "Follow these steps to verify your domain..."
    }
  ]
};
