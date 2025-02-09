// types.ts

export type PlatformId =
  | 'single_page_application'
  | 'traditional_website'
  | 'ios_app'
  | 'android_app';

export interface SetupDefaults {
  clientId: string;
  redirectUrl: string;
  configVersion: string;
  timestamp: string;
}

export interface SetupOption {
  id: 'single_page_application' | 'traditional_website' | 'android_app' | 'ios_app';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

export interface MousePosition {
  x: number;
  y: number;
}

// You might also want to add some additional type helpers
export type PlatformConfig = {
  [K in PlatformId]: {
    setupInstructions: string;
    requiredDependencies: string[];
    configurationSteps: string[];
  };
};

export interface AuthConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
}

export type SetupResponse = {
  success: boolean;
  platformId: PlatformId;
  config: SetupDefaults;
  timestamp: string;
};

export interface GenerateResponse {
  clientId: string;
  scriptUrl: string;
}

export interface CompleteResponse {
  success: boolean;
  message?: string;
}
