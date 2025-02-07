import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  readonly password: string;
}

interface Requirement {
  label: string;
  validator: (password: string) => boolean;
}

const requirements: Requirement[] = [
  {
    label: 'At least 8 characters',
    validator: (password) => password.length >= 8,
  },
  {
    label: 'One uppercase letter',
    validator: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'One lowercase letter',
    validator: (password) => /[a-z]/.test(password),
  },
  {
    label: 'One number',
    validator: (password) => /\d/.test(password),
  },
  {
    label: 'One special character',
    validator: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <motion.ul
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 space-y-1 text-sm text-zinc-400"
    >
      {requirements.map(({ label, validator }, index) => {
        const isValid = validator(password);
        return (
          <motion.li
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-2 ${isValid ? 'text-green-500' : ''}`}
          >
            {isValid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4 text-zinc-600" />}
            {label}
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
