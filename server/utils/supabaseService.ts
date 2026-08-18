import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function getSupabaseServiceClient(): SupabaseClient {
  const config = useRuntimeConfig()
  const url = String(config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || '')
  const key = String(config.supabaseServiceKey || process.env.NUXT_SUPABASE_SERVICE_KEY || '')

  if (!url || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase service key is not configured',
    })
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
