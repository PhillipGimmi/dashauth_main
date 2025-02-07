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
  readonly question: string;
  readonly answer: string;
  readonly tags: ReadonlyArray<FAQTag>;
}

export const FAQ_ITEMS: ReadonlyArray<FAQItem> = [
  // React and React Native
  {
    question: 'I use React. What should I select?',
    answer:
      "If your React app uses client-side routing (e.g., react-router) and dynamically updates without full page reloads, select 'Single Page Application'. If it uses server-side rendering (e.g., with Next.js), select 'Traditional Web App'.",
    tags: ['react', 'spa', 'traditional', 'nextjs'],
  },
  {
    question: 'I use React Native. What should I select?',
    answer:
      "React Native builds native apps for iOS and Android. If your app handles platform-specific authentication workflows (e.g., native SDKs for OAuth, biometric login), choose 'iOS App' or 'Android App' based on the platform. However, if you want a unified backend authentication flow using a centralized API, select 'Traditional Web App' for cross-platform compatibility.",
    tags: ['react-native', 'mobile', 'traditional'],
  },

  // Angular, Vue, Svelte
  {
    question: 'I use Angular or Vue. What should I select?',
    answer:
      "If your Angular or Vue app uses client-side routing, choose 'Single Page Application'. For server-rendered apps (e.g., Angular Universal or Nuxt.js), select 'Traditional Web App'.",
    tags: ['angular', 'vue', 'spa', 'server-side', 'nuxtjs'],
  },
  {
    question: 'I use Svelte. What should I select?',
    answer:
      "If your Svelte app updates dynamically on the client, select 'Single Page Application'. For apps rendered on the server with SvelteKit, select 'Traditional Web App'.",
    tags: ['svelte', 'spa', 'server-side'],
  },

  // Backend Frameworks
  {
    question: 'I use Django or Flask. What should I select?',
    answer: "Django and Flask apps are server-rendered. Select 'Traditional Web App'.",
    tags: ['django', 'flask', 'traditional'],
  },
  {
    question: 'I use Ruby on Rails. What should I select?',
    answer: "Rails apps render content on the server. Choose 'Traditional Web App'.",
    tags: ['rails', 'traditional'],
  },

  // CMS Platforms
  {
    question: 'I use WordPress. What should I select?',
    answer:
      "For standard WordPress sites, select 'Traditional Web App'. If you use WordPress as a headless CMS with a custom JavaScript frontend, select 'Single Page Application'.",
    tags: ['wordpress', 'traditional', 'spa'],
  },
  {
    question: 'I use Shopify. What should I select?',
    answer:
      "For a default Shopify store, select 'Traditional Web App'. If you use a headless storefront like Hydrogen, choose 'Single Page Application'.",
    tags: ['shopify', 'traditional', 'spa'],
  },
  {
    question: 'I use Squarespace or Wix. What should I select?',
    answer:
      "Squarespace and Wix sites are typically server-rendered. Select 'Traditional Web App'.",
    tags: ['squarespace', 'wix', 'traditional'],
  },

  // Static Site Generators
  {
    question: 'I use Gatsby or Eleventy. What should I select?',
    answer: "Both Gatsby and Eleventy generate static HTML. Select 'Traditional Web App'.",
    tags: ['gatsby', 'eleventy', 'static-site', 'traditional'],
  },
  {
    question: 'I use Astro. What should I select?',
    answer:
      "Astro apps typically generate static sites or server-rendered content. Select 'Traditional Web App'.",
    tags: ['astro', 'static-site', 'traditional'],
  },

  // JavaScript Frameworks
  {
    question: 'I use Vanilla JavaScript. What should I select?',
    answer:
      "For Vanilla JavaScript apps, select 'Single Page Application' if your app dynamically updates content. For server-rendered or static sites, select 'Traditional Web App'.",
    tags: ['vanilla-js', 'spa', 'traditional'],
  },
  {
    question: 'I use jQuery. What should I select?',
    answer:
      "jQuery-based apps are typically server-rendered and enhance static HTML. Select 'Traditional Web App'.",
    tags: ['jquery', 'traditional'],
  },
  {
    question: 'I use Alpine.js. What should I select?',
    answer: "Alpine.js apps typically enhance server-rendered HTML. Select 'Traditional Web App'.",
    tags: ['alpinejs', 'traditional'],
  },
  {
    question: 'I use Ember.js. What should I select?',
    answer: "Ember.js apps are typically SPAs. Select 'Single Page Application'.",
    tags: ['emberjs', 'spa'],
  },
  {
    question: 'I use Solid.js. What should I select?',
    answer: "Solid.js apps are typically SPAs. Select 'Single Page Application'.",
    tags: ['solidjs', 'spa'],
  },
  {
    question: 'I use HTMX. What should I select?',
    answer:
      "HTMX enhances server-rendered pages with dynamic updates. Select 'Traditional Web App'.",
    tags: ['htmx', 'traditional'],
  },

  // Mobile App Frameworks
  {
    question: 'I use Flutter. What should I select?',
    answer:
      "For Flutter mobile apps, choose 'iOS App' or 'Android App' based on your target platform. For web builds, select 'Traditional Web App'.",
    tags: ['flutterflow', 'mobile', 'web'],
  },
  {
    question: 'I use Blazor. What should I select?',
    answer:
      "If your Blazor app uses WebAssembly and updates dynamically, choose 'Single Page Application'. If it's server-hosted, select 'Traditional Web App'.",
    tags: ['blazor', 'spa', 'traditional'],
  },
  {
    question: 'I use Elm. What should I select?',
    answer: "Elm apps are typically SPAs. Select 'Single Page Application'.",
    tags: ['elm', 'spa'],
  },

  // Desktop Apps
  {
    question: 'I am building a desktop app for Windows. What should I select?',
    answer:
      "For a native Windows desktop app, choose 'Traditional Web App' if it relies on a centralized API for authentication. For Windows-specific native authentication workflows (e.g., Active Directory, Microsoft Authentication Library), ensure integration with your chosen backend service.",
    tags: ['windows', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app for macOS. What should I select?',
    answer:
      "For a native macOS desktop app, choose 'Traditional Web App' for centralized API authentication. For macOS-specific workflows (e.g., Keychain, Touch ID), integrate these with your backend service.",
    tags: ['macos', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app for Linux. What should I select?',
    answer:
      "For a native Linux desktop app, choose 'Traditional Web App' if your authentication is API-based. If your app integrates with platform-specific workflows (e.g., PAM for authentication), ensure compatibility with your backend.",
    tags: ['linux', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app with Electron.js. What should I select?',
    answer:
      "For Electron.js apps, choose 'Traditional Web App' since Electron typically uses centralized API authentication for both desktop and web compatibility. You can also integrate platform-specific authentication workflows, such as biometric login, using Electron's native modules.",
    tags: ['electron', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app with Flutter Desktop. What should I select?',
    answer:
      "Flutter Desktop apps for Windows, macOS, and Linux should use 'Traditional Web App' for centralized API-based authentication. If you need platform-specific features like biometric login (e.g., Face ID or Windows Hello), integrate them via platform channels and connect to your backend service.",
    tags: ['flutterflow', 'desktop', 'windows', 'macos', 'linux', 'traditional'],
  },
  {
    question: 'I am building a desktop app with Tauri. What should I select?',
    answer:
      "Tauri apps, which combine Rust and web technologies, should use 'Traditional Web App' for authentication via a centralized API. For platform-specific workflows like biometric login, integrate these through Tauri's native bindings and ensure backend compatibility.",
    tags: ['tauri', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app with NW.js. What should I select?',
    answer:
      "NW.js apps, like Electron.js, typically rely on centralized API authentication for cross-platform compatibility. Select 'Traditional Web App' and use native modules for platform-specific features if needed.",
    tags: ['nwjs', 'desktop', 'traditional'],
  },
  {
    question:
      'I am building a desktop app with Qt for Python (PySide or PyQt). What should I select?',
    answer:
      "For apps built with PySide or PyQt, select 'Traditional Web App' if using centralized API-based authentication. For local authentication workflows, ensure integration with your backend where applicable.",
    tags: ['pyside', 'pyqt', 'python', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app with Unity. What should I select?',
    answer:
      "For Unity desktop apps, choose 'Traditional Web App' if using a centralized API for authentication. For apps with local-only workflows, you may need to customize backend integration as Unity is not inherently tied to web authentication standards.",
    tags: ['unity', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app with Godot. What should I select?',
    answer:
      "Godot desktop apps should use 'Traditional Web App' for centralized API-based authentication. For platform-specific workflows, integrate native extensions where needed and connect them to your backend service.",
    tags: ['godot', 'desktop', 'traditional'],
  },
  {
    question: 'I am building a desktop app with Windows Forms or WPF. What should I select?',
    answer:
      "For apps built with Windows Forms or WPF, choose 'Traditional Web App' to use centralized API-based authentication. If you require integration with Active Directory or other Windows-specific workflows, ensure compatibility with your backend.",
    tags: ['windows', 'desktop', 'traditional'],
  },
] as const;

// Add domain verification FAQs
export const DOMAIN_VERIFICATION_FAQ = [
  {
    question: 'What is a TXT record?',
    answer:
      "A TXT record is a type of DNS record that allows you to store text information in your domain's DNS settings. It's commonly used for domain verification, email security, and other domain ownership proofs.",
    tags: ['txt', 'dns', 'record', 'basics'],
  },
  {
    question: 'How long does verification take?',
    answer:
      'DNS changes can take anywhere from a few minutes to 48 hours to propagate globally. This is known as DNS propagation time. We recommend waiting at least 5-10 minutes after adding the TXT record before verifying.',
    tags: ['time', 'propagation', 'dns'],
  },
  {
    question: 'Where do I add TXT records?',
    answer:
      "TXT records are added in your domain registrar's DNS settings or DNS hosting provider (like Cloudflare, GoDaddy, or Namecheap). Look for 'DNS Management', 'DNS Settings', or 'Advanced DNS' in your provider's dashboard.",
    tags: ['setup', 'dns', 'provider'],
  },
  {
    question: 'Verification keeps failing?',
    answer:
      "Common issues include: incorrect record name/value, DNS propagation not complete, or copying extra spaces. Double-check the exact values and ensure you've waited for DNS propagation.",
    tags: ['troubleshooting', 'error', 'failed'],
  },
];

interface DNSProvider {
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

export const DNS_PROVIDERS: DNSProvider[] = [
  // DNS Providers (Global)
  {
    name: 'Akamai Edge DNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Enterprise DNS services...',
  },
  {
    name: 'Amazon Route 53',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'AWS Route 53 DNS setup...',
  },
  {
    name: 'Azure DNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Microsoft Azure DNS setup...',
  },
  {
    name: 'Cloudflare',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Cloudflare DNS setup...',
  },
  {
    name: 'ClouDNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Cloud DNS services...',
  },
  {
    name: 'DigitalOcean DNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'DO DNS setup...',
  },
  {
    name: 'DNS Made Easy',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Enterprise DNS services...',
  },
  {
    name: 'DNSimple',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Simple DNS management...',
  },
  {
    name: 'DynDNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Dynamic DNS provider...',
  },
  {
    name: 'EasyDNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Premium DNS services...',
  },
  {
    name: 'F5 DNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Enterprise DNS management...',
  },
  {
    name: 'FreeDNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Free DNS hosting services...',
  },
  {
    name: 'Google Cloud DNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'GCP DNS setup...',
  },
  {
    name: 'Hetzner DNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Hetzner Cloud DNS setup...',
  },
  {
    name: 'Hurricane Electric DNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Free DNS hosting...',
  },
  {
    name: 'Linode DNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Linode DNS management...',
  },
  {
    name: 'No-IP',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Dynamic DNS services...',
  },
  {
    name: 'Oracle Cloud DNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Oracle DNS setup...',
  },
  {
    name: 'PowerDNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Self-hosted DNS server...',
  },
  {
    name: 'UltraDNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Enterprise DNS services...',
  },
  {
    name: 'Vultr DNS',
    category: 'DNS Provider',
    region: 'Global',
    instructions: 'Vultr DNS configuration...',
  },

  // Domain Registrars (Global)
  {
    name: 'Domain.com',
    category: 'Domain Registrar',
    region: 'Global',
    instructions: 'Domain registration setup...',
  },
  {
    name: 'GoDaddy',
    category: 'Domain Registrar',
    region: 'Global',
    instructions: 'GoDaddy DNS setup...',
  },
  {
    name: 'Google Domains',
    category: 'Domain Registrar',
    region: 'Global',
    instructions: 'Google Domains setup...',
  },
  {
    name: 'Hover',
    category: 'Domain Registrar',
    region: 'Global',
    instructions: 'Domain service setup...',
  },
  {
    name: 'Name.com',
    category: 'Domain Registrar',
    region: 'Global',
    instructions: 'Domain registration setup...',
  },
  {
    name: 'Namecheap',
    category: 'Domain Registrar',
    region: 'Global',
    instructions: 'Namecheap DNS setup...',
  },
  {
    name: 'Network Solutions',
    category: 'Domain Registrar',
    region: 'Global',
    instructions: 'Domain management setup...',
  },
  {
    name: 'Register.com',
    category: 'Domain Registrar',
    region: 'Global',
    instructions: 'Registration service setup...',
  },

  // Regional Domain Registrars - Africa
  {
    name: 'AfriRegister',
    category: 'Domain Registrar',
    region: 'Africa',
    instructions: 'African domain registration...',
  },
  {
    name: 'Domain.co.za',
    category: 'Domain Registrar',
    region: 'Africa',
    instructions: 'South African domain registration...',
  },
  {
    name: 'Kenya.co.ke',
    category: 'Domain Registrar',
    region: 'Africa',
    instructions: 'Kenyan domain services...',
  },
  {
    name: 'Web4Africa',
    category: 'Domain Registrar',
    region: 'Africa',
    instructions: 'Pan-African domain services...',
  },

  // Regional Domain Registrars - Asia
  {
    name: 'Alibaba Cloud DNS',
    category: 'DNS Provider',
    region: 'Asia',
    instructions: 'Alibaba Cloud DNS setup...',
  },
  {
    name: 'BigRock',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Indian domain service...',
  },
  {
    name: 'DNSPod',
    category: 'DNS Provider',
    region: 'Asia',
    instructions: 'Chinese DNS service...',
  },
  {
    name: 'Exabytes',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Singapore domain service...',
  },
  {
    name: 'FirstCom',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Korean domain provider...',
  },
  {
    name: 'GabiaDNS',
    category: 'DNS Provider',
    region: 'Asia',
    instructions: 'Korean DNS service...',
  },
  {
    name: 'GMO',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Japanese domain service...',
  },
  {
    name: 'Hostinger Asia',
    category: 'Web Host',
    region: 'Asia',
    instructions: 'Asian hosting service...',
  },
  {
    name: 'Korea Server Hosting',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Korean domain service...',
  },
  {
    name: 'Onamae.com',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Japanese domain service...',
  },
  {
    name: 'Sakura Internet',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Japanese hosting provider...',
  },
  {
    name: 'Tencent Cloud DNS',
    category: 'DNS Provider',
    region: 'Asia',
    instructions: 'Tencent Cloud DNS configuration...',
  },
  {
    name: 'Value Domain',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Japanese domain provider...',
  },
  {
    name: 'WebNIC',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Malaysian domain service...',
  },
  {
    name: 'XSERVER',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Japanese hosting service...',
  },
  {
    name: 'Z.com',
    category: 'Domain Registrar',
    region: 'Asia',
    instructions: 'Asian domain provider...',
  },

  // Regional Domain Registrars - Europe
  {
    name: '1&1 IONOS',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'European domain service...',
  },
  {
    name: 'Aruba.it',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'Italian hosting and domains...',
  },
  {
    name: 'Gandi.net',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'French domain service...',
  },
  {
    name: 'Hetzner',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'German domain service...',
  },
  {
    name: 'Infomaniak',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'Swiss domain service...',
  },
  {
    name: 'Inwx',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'German domain services...',
  },
  {
    name: 'Key-Systems',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'German domain services...',
  },
  {
    name: 'One.com',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'Danish domain service...',
  },
  {
    name: 'OVHcloud',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'European domain service...',
  },
  {
    name: 'Register.it',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'Italian domain service...',
  },
  {
    name: 'Strato',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'German domain service...',
  },
  {
    name: 'TransIP',
    category: 'Domain Registrar',
    region: 'Europe',
    instructions: 'Dutch domain service...',
  },

  // Regional Domain Registrars - Middle East
  {
    name: 'Beget',
    category: 'Web Host',
    region: 'Middle East',
    instructions: 'Russian/Middle Eastern hosting...',
  },
  {
    name: 'Etisalat',
    category: 'Domain Registrar',
    region: 'Middle East',
    instructions: 'UAE domain services...',
  },
  {
    name: 'QCloud',
    category: 'DNS Provider',
    region: 'Middle East',
    instructions: 'Qatari cloud services...',
  },
  {
    name: 'SaudiNet',
    category: 'Domain Registrar',
    region: 'Middle East',
    instructions: 'Saudi Arabian domain services...',
  },

  // Regional Domain Registrars - Oceania
  {
    name: 'Crazy Domains',
    category: 'Domain Registrar',
    region: 'Oceania',
    instructions: 'Australian domain provider...',
  },
  {
    name: 'Digital Pacific',
    category: 'Domain Registrar',
    region: 'Oceania',
    instructions: 'Australian hosting service...',
  },
  {
    name: 'Domainz',
    category: 'Domain Registrar',
    region: 'Oceania',
    instructions: 'New Zealand domain provider...',
  },
  {
    name: 'Synergy Wholesale',
    category: 'Domain Registrar',
    region: 'Oceania',
    instructions: 'Australian domain service...',
  },
  {
    name: 'TPP Wholesale',
    category: 'Domain Registrar',
    region: 'Oceania',
    instructions: 'Australian domain reseller...',
  },
  {
    name: 'Umbrellar',
    category: 'Domain Registrar',
    region: 'Oceania',
    instructions: 'New Zealand domain service...',
  },
  {
    name: 'VentraIP',
    category: 'Domain Registrar',
    region: 'Oceania',
    instructions: 'Australian domain service...',
  },
  {
    name: 'Web Central',
    category: 'Domain Registrar',
    region: 'Oceania',
    instructions: 'Australian domain service...',
  },
  {
    name: 'Web24',
    category: 'Domain Registrar',
    region: 'Oceania',
    instructions: 'Australian hosting service...',
  },

  // Regional Domain Registrars - South America
  {
    name: 'InterNetX America',
    category: 'Domain Registrar',
    region: 'South America',
    instructions: 'Latin American domain services...',
  },
  {
    name: 'Locaweb',
    category: 'Domain Registrar',
    region: 'South America',
    instructions: 'Brazilian hosting and domains...',
  },
  {
    name: 'Mi.com.co',
    category: 'Domain Registrar',
    region: 'South America',
    instructions: 'Colombian domain services...',
  },
  {
    name: 'NIC.br',
    category: 'Domain Registrar',
    region: 'South America',
    instructions: 'Brazilian domain registry...',
  },
  {
    name: 'UOL Host',
    category: 'Web Host',
    region: 'South America',
    instructions: 'Brazilian hosting services...',
  },

  // Web Hosting Providers
  {
    name: 'A2 Hosting',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Web hosting DNS setup...',
  },
  {
    name: 'Bluehost',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Web hosting DNS setup...',
  },
  {
    name: 'cPanel',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Hosting control panel...',
  },
  {
    name: 'DirectAdmin',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Hosting control panel...',
  },
  {
    name: 'DreamHost',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Web hosting DNS setup...',
  },
  {
    name: 'HostGator',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Web hosting DNS setup...',
  },
  {
    name: 'InMotion Hosting',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Web hosting DNS setup...',
  },
  {
    name: 'Kinsta',
    category: 'Web Host',
    region: 'Global',
    instructions: 'WordPress hosting DNS...',
  },
  {
    name: 'Liquid Web',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Web hosting DNS setup...',
  },
  {
    name: 'Plesk',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Hosting control panel...',
  },
  {
    name: 'SiteGround',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Web hosting DNS setup...',
  },
  {
    name: 'Webmin',
    category: 'Web Host',
    region: 'Global',
    instructions: 'Server control panel...',
  },
  {
    name: 'WP Engine',
    category: 'Web Host',
    region: 'Global',
    instructions: 'WordPress hosting DNS...',
  },

  // Platform Providers
  {
    name: 'Netlify DNS',
    category: 'Platform Provider',
    region: 'Global',
    instructions: 'Netlify DNS configuration...',
    propagationTime: '0-5 minutes',
    steps: ['Go to Domain settings in Netlify', 'Click on DNS settings', 'Add TXT record'],
  },
  {
    name: 'Vercel DNS',
    category: 'Platform Provider',
    region: 'Global',
    instructions: 'Vercel DNS configuration...',
    propagationTime: '0-5 minutes',
  },
  {
    name: 'Render DNS',
    category: 'Platform Provider',
    region: 'Global',
    instructions: 'Render DNS setup...',
    propagationTime: '1-5 minutes',
  },
  {
    name: 'Heroku DNS',
    category: 'Platform Provider',
    region: 'Global',
    instructions: 'Heroku DNS configuration...',
    propagationTime: '5-10 minutes',
  },
  {
    name: 'Platform.sh DNS',
    category: 'Platform Provider',
    region: 'Global',
    instructions: 'Platform.sh DNS setup...',
    propagationTime: '1-5 minutes',
  },

  // Additional Control Panel Providers
  {
    name: 'ISPConfig',
    category: 'Control Panel',
    region: 'Global',
    instructions: 'ISPConfig DNS management...',
    propagationTime: '1-48 hours',
  },
  {
    name: 'Virtualmin',
    category: 'Control Panel',
    region: 'Global',
    instructions: 'Virtualmin DNS setup...',
    propagationTime: '1-48 hours',
  },
  {
    name: 'Aapanel',
    category: 'Control Panel',
    region: 'Global',
    instructions: 'Aapanel DNS configuration...',
    propagationTime: '1-48 hours',
  },
  {
    name: 'Kloxo-MR',
    category: 'Control Panel',
    region: 'Global',
    instructions: 'Kloxo-MR DNS setup...',
    propagationTime: '1-48 hours',
  },

  // Caribbean Providers
  {
    name: 'BVI Registrar',
    category: 'Domain Registrar',
    region: 'Caribbean',
    instructions: 'BVI domain services...',
    propagationTime: '24-48 hours',
  },
  {
    name: 'Jamaica NIC',
    category: 'Domain Registrar',
    region: 'Caribbean',
    instructions: 'Jamaican domain services...',
    propagationTime: '24-48 hours',
  },

  // Central American Providers
  {
    name: 'NIC.CR',
    category: 'Domain Registrar',
    region: 'Central America',
    instructions: 'Costa Rica domain services...',
    propagationTime: '24-48 hours',
  },
  {
    name: 'NIC.PA',
    category: 'Domain Registrar',
    region: 'Central America',
    instructions: 'Panama domain services...',
    propagationTime: '24-48 hours',
  },

  // Central Asian Providers
  {
    name: 'KazNIC',
    category: 'Domain Registrar',
    region: 'Central Asia',
    instructions: 'Kazakhstan domain services...',
    propagationTime: '24-48 hours',
  },
  {
    name: 'UzNIC',
    category: 'Domain Registrar',
    region: 'Central Asia',
    instructions: 'Uzbekistan domain services...',
    propagationTime: '24-48 hours',
  },
];
