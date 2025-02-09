import { PlatformId } from '@/app/types/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PlatformConfig = {
  spa: {
    auth_persistence: 'local_storage' | 'session_storage';
    auto_refresh: boolean;
    silent_auth_enabled: boolean;
  };
  traditional_web: {
    session_storage: 'cookie';
    csrf_protection: boolean;
    secure_cookie_enabled: boolean;
  };
  mobile: {
    biometric_enabled: boolean;
    pin_fallback: boolean;
    offline_mode: boolean;
  };
};

interface WizardState {
  domain: string | null;
  domainId: string | null;
  selectedPlatform: PlatformId | null;
  isVerified: boolean;
  verificationData: {
    verification_token: string;
    status: string;
    verification_method?: 'dns';
    verification_attempts?: number;
  } | null;
  platformSpecificConfig: Partial<PlatformConfig> | null;
  customizationSettings: {
    theme: 'default' | 'custom';
    branding?: {
      logo_url: string | null;
      primary_color: string;
      accent_color: string;
    };
  } | null;
  showHelpPanel: boolean;
  setDomain: (domain: string | null, domainId: string | null) => void;
  setVerificationData: (data: WizardState['verificationData']) => void;
  setSelectedPlatform: (platform: PlatformId | null) => void;
  setIsVerified: (verified: boolean) => void;
  setPlatformConfig: (config: WizardState['platformSpecificConfig']) => void;
  setCustomizationSettings: (settings: WizardState['customizationSettings']) => void;
  setShowHelpPanel: (show: boolean) => void;
  reset: () => void;
}

const initialState = {
  domain: null,
  domainId: null,
  selectedPlatform: null,
  isVerified: false,
  verificationData: null,
  platformSpecificConfig: null,
  customizationSettings: null,
  showHelpPanel: false,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,
      setDomain: (domain, domainId) => set({ domain, domainId }),
      setVerificationData: (verificationData) => set({ verificationData }),
      setSelectedPlatform: (selectedPlatform) => set({ selectedPlatform }),
      setIsVerified: (isVerified) => set({ isVerified }),
      setPlatformConfig: (platformSpecificConfig) => set({ platformSpecificConfig }),
      setCustomizationSettings: (customizationSettings) => set({ customizationSettings }),
      setShowHelpPanel: (show) => set({ showHelpPanel: show }),
      reset: () => set(initialState),
    }),
    {
      name: 'setup-wizard-storage',
      partialize: (state) => ({
        domain: state.domain,
        domainId: state.domainId,
        selectedPlatform: state.selectedPlatform,
        isVerified: state.isVerified,
        customizationSettings: state.customizationSettings,
        showHelpPanel: state.showHelpPanel,
      }),
    }
  )
);
