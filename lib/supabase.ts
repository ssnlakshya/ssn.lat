import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      urls: {
        Row: {
          id: string
          long_url: string
          short_code: string
          custom_alias: string | null
          created_at: string
          click_count: number
        }
        Insert: {
          id?: string
          long_url: string
          short_code: string
          custom_alias?: string | null
          created_at?: string
          click_count?: number
        }
        Update: {
          id?: string
          long_url?: string
          short_code?: string
          custom_alias?: string | null
          created_at?: string
          click_count?: number
        }
      }
    }
  }
}