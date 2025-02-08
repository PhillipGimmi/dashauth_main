import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface FormInputProps {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly type: 'text' | 'email' | 'password' | 'tel';
  readonly placeholder?: string;
  readonly value: string;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
  readonly inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url';
  readonly autoComplete?: string;
  readonly showPasswordRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (value: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters long', test: (v) => v.length >= 8 },
  { label: 'Contains a number', test: (v) => /\d/.test(v) },
  {
    label: 'Contains a special character',
    test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
  },
  { label: 'Contains uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'Contains lowercase letter', test: (v) => /[a-z]/.test(v) },
];

export function FormInput({
  id,
  name,
  label,
  type,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  minLength,
  maxLength,
  pattern,
  inputMode,
  autoComplete,
  showPasswordRequirements = false,
}: FormInputProps) {
  const passwordChecks = useMemo(() => {
    if (!showPasswordRequirements || type !== 'password') return null;
    return passwordRequirements.map((req) => ({
      ...req,
      satisfied: req.test(value),
    }));
  }, [showPasswordRequirements, type, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Special handling for verification code
    if (name === 'verificationCode') {
      // Only allow numbers and limit to 6 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      onChange({
        ...e,
        target: { ...e.target, value: numericValue },
      });
      return;
    }

    // Default handling for other inputs
    onChange(e);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={name === 'verificationCode' ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="block w-full rounded-lg border border-zinc-600 bg-zinc-800/30 px-4 py-3 text-white placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
      />
      {passwordChecks && value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 space-y-2"
        >
          {passwordChecks.map((req) => (
            <div key={req.label} className="flex items-center space-x-2">
              {req.satisfied ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs ${req.satisfied ? 'text-green-500' : 'text-red-500'}`}>
                {req.label}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
