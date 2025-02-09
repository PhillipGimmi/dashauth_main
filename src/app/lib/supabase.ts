import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Implement full Storage interface
class CustomStorage implements Storage {
  private store: { [key: string]: string } = {};
  length = 0;

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
    this.length = Object.keys(this.store).length;
  }

  removeItem(key: string): void {
    delete this.store[key];
    this.length = Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
    this.length = 0;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const customStorage = new CustomStorage();

// Helper function to check if localStorage is available
const hasLocalStorage = () => {
  try {
    return typeof window !== 'undefined' && window.localStorage !== null;
  } catch {
    return false;
  }
};

// Add environment variable validation
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing required Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: hasLocalStorage(),
    storage: hasLocalStorage() ? localStorage : customStorage,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Prefer: 'return=minimal',
    },
  },
});

// Create service role client (for server-side operations)
export const getServiceRoleClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
    return null;
  }

  try {
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            Prefer: 'return=minimal',
          },
        },
      }
    );
  } catch (error) {
    console.error('❌ Failed to create Supabase service role client:', error);
    return null;
  }
};

export default supabase;
