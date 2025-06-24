// src/lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr'

// Nota: Agora usamos createBrowserClient
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
