export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type TokenStatus = 'pending' | 'used' | 'expired';

export interface TokenData {
  token: string;
  status: TokenStatus;
  created_at: string;
  expires_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          name: string;
          role: string | null;
          active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          email_verified: boolean | null;
          last_login_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          name: string;
          role?: string | null;
          active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          email_verified?: boolean | null;
          last_login_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          name?: string;
          role?: string | null;
          active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          email_verified?: boolean | null;
          last_login_at?: string | null;
          deleted_at?: string | null;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          expires_at: string;
          created_at: string | null;
          last_used_at: string | null;
          refresh_token: string | null;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          token: string;
          expires_at: string;
          created_at?: string | null;
          last_used_at?: string | null;
          refresh_token?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          token?: string;
          expires_at?: string;
          created_at?: string | null;
          last_used_at?: string | null;
          refresh_token?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
      };
      password_reset_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          status: TokenStatus;
          created_at: string;
          expires_at: string;
          used_at: string | null;
          client_info: JsonValue;
          ip_address: string | null;
          attempts: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          token: string;
          status?: TokenStatus;
          created_at?: string;
          expires_at?: string;
          used_at?: string | null;
          client_info?: JsonValue;
          ip_address?: string | null;
          attempts?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          token?: string;
          status?: TokenStatus;
          created_at?: string;
          expires_at?: string;
          used_at?: string | null;
          client_info?: JsonValue;
          ip_address?: string | null;
          attempts?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      reset_token_status: TokenStatus;
    };
  };
}
