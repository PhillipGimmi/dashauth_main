// Core interfaces
export interface AuthXeroUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  active?: boolean;
  isConfigured?: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
  refreshToken?: string;
}

// Response types
export interface BaseResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface AuthResponse extends BaseResponse {
  token?: string;
  refreshToken?: string;
  user?: AuthXeroUser;
  requiresVerification?: boolean;
  email?: string;
}

export interface VerifyEmailResponse extends BaseResponse {
  status: string;
}

export interface AuthXeroError {
  message: string;
  status: number;
  code?: string;
}

// Auth types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends AuthCredentials {
  name: string;
  confirmPassword?: string;
}

// Context types
export interface AuthContextType {
  user: AuthXeroUser | null;
  loading: boolean;
  error: AuthXeroError | null;
  isVerified: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthResponse>;
  signup: (credentials: SignUpCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  verifyEmail: (code: string) => Promise<VerifyEmailResponse>;
  refreshToken: () => Promise<void>;
}

export interface AuthState {
  user: AuthXeroUser | null;
  loading: boolean;
  error: AuthXeroError | null;
  isVerified: boolean;
  isLoggingOut: boolean;
}

// Form types
export type AuthMode = 'signin' | 'signup';

export interface FormState {
  loading: boolean;
  error: string | null;
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  verificationCode: string;
  verificationAttempts: number;
  verificationTimer: number | null;
  showResendButton: boolean;
  touched: Record<string, boolean>;
  attempts: number;
  showVerificationField: boolean;
  showHelp: boolean;
  success: boolean;
}

// Add these with the other response types
export interface TokenResponse extends BaseResponse {
  token: string;
  refreshToken: string;
}

export interface AuthXeroLoginResponse extends BaseResponse {
  token: string;
  refreshToken: string;
  user: AuthXeroUser;
}

export interface AuthErrorResponse {
  status: string;
  message: string;
  error_code?: string;
  status_code?: number;
}

export interface EmailVerificationResponse extends BaseResponse {
  status: string;
  verified: boolean;
}
