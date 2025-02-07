import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthMode, FormState } from '@/types/auth';
import { useAuthStore } from '@/store/authStore';

const initialState: FormState = {
  loading: false,
  error: null,
  email: '',
  password: '',
  name: '',
  confirmPassword: '',
  verificationCode: '',
  verificationAttempts: 0,
  verificationTimer: null,
  showResendButton: false,
  touched: {},
  attempts: 0,
  showVerificationField: false,
  showHelp: false,
  success: false,
};

export function useAuthForm(initialMode: AuthMode = 'signin') {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [formState, setFormState] = useState<FormState>(initialState);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      console.log('handleInputChange called:', { name, value });

      if (name === 'verificationCode') {
        const newValue = value.replace(/\D/g, '').slice(0, 6);
        console.log('Processing verification code:', {
          original: value,
          processed: newValue,
        });

        // Update form state with new code
        setFormState((prev) => ({
          ...prev,
          verificationCode: newValue,
          touched: { ...prev.touched, [name]: true },
        }));

        // If code is complete (6 digits), verify it
        if (newValue.length === 6) {
          setFormState((prev) => ({ ...prev, loading: true, error: null }));

          // Only verify the code, don't send a new one
          fetch('/api/auth/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: newValue,
              email: formState.email,
              verify_only: true,
            }),
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.success) {
                setUser(result.user);
                setFormState((prev) => ({
                  ...prev,
                  loading: false,
                  success: true,
                }));
                router.push('/dashboard');
              } else {
                setFormState((prev) => ({
                  ...prev,
                  loading: false,
                  verificationCode: '',
                  error: result.error || 'Verification failed',
                  verificationAttempts: prev.verificationAttempts + 1,
                }));
              }
            })
            .catch((error) => {
              console.error('Verification error:', error);
              setFormState((prev) => ({
                ...prev,
                loading: false,
                error: 'Failed to verify code. Please try again.',
                verificationAttempts: prev.verificationAttempts + 1,
              }));
            });
        }
        return;
      }

      // Handle other input changes
      setFormState((prev) => ({
        ...prev,
        [name]: value,
        touched: { ...prev.touched, [name]: true },
      }));
    },
    [router, formState.email, setUser]
  );

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      console.log('Sending verification email to:', email);
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log('Verification email response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send verification email');
      }

      setFormState((prev) => ({
        ...prev,
        showVerificationField: true,
        verificationTimer: 60,
        showResendButton: false,
        loading: false,
      }));

      return result;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormState((prev) => ({ ...prev, loading: true, error: '' }));

      try {
        const response = await fetch(`/api/auth/${mode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formState.email,
            password: formState.password,
            ...(mode === 'signup' && { name: formState.name }),
          }),
        });

        const result = await response.json();

        if (result.success) {
          if (result.requiresVerification && !formState.showVerificationField) {
            // Only send verification email if we're not already in verification mode
            setFormState((prev) => ({
              ...prev,
              showVerificationField: true,
              verificationTimer: 60,
              verificationCode: '',
              loading: true,
            }));

            try {
              await sendVerificationEmail(formState.email);
              setFormState((prev) => ({
                ...prev,
                loading: false,
                showResendButton: true,
              }));
            } catch (error) {
              setFormState((prev) => ({
                ...prev,
                error: 'Failed to send verification email. Please try again.',
                loading: false,
                showVerificationField: false,
              }));
            }
          } else {
            setUser(result.user);
            setFormState((prev) => ({
              ...prev,
              loading: false,
              success: true,
            }));
            router.push('/dashboard');
          }
          return {
            success: true,
            user: result.user,
            token: result.token,
            requiresVerification: result.requiresVerification,
          };
        }

        setFormState((prev) => ({
          ...prev,
          loading: false,
          error: result.message ?? 'Authentication failed',
          attempts: prev.attempts + 1,
        }));

        return { success: false, error: result.message };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unexpected error occurred';
        setFormState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          attempts: prev.attempts + 1,
        }));
        return { success: false, error: errorMessage };
      }
    },
    [
      mode,
      formState.email,
      formState.password,
      formState.name,
      formState.showVerificationField,
      router,
      sendVerificationEmail,
      setUser,
    ]
  );

  const getButtonText = useCallback(() => {
    if (formState.loading) {
      if (formState.showVerificationField) {
        return 'Verifying...';
      }
      return 'Sending verification email...';
    }
    if (formState.success) {
      if (formState.showVerificationField) {
        return 'Verified!';
      }
      return 'Email sent!';
    }
    return mode === 'signup' ? 'Sign Up' : 'Sign In';
  }, [mode, formState.loading, formState.success, formState.showVerificationField]);

  const handleBackToLogin = useCallback(() => {
    setMode('signin');
    setFormState({
      ...initialState,
      loading: false,
    });
  }, []);

  const handleResendCode = useCallback(async () => {
    try {
      setFormState((prev) => ({ ...prev, loading: true }));
      await sendVerificationEmail(formState.email);
      setFormState((prev) => ({
        ...prev,
        loading: false,
        showResendButton: false,
        verificationTimer: 60,
        error: null,
      }));
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to resend verification code',
      }));
    }
  }, [formState.email, sendVerificationEmail]);

  return {
    mode,
    setMode,
    formState,
    setFormState,
    handleInputChange,
    handleSubmit,
    getButtonText,
    handleBackToLogin,
    handleResendCode,
  };
}
