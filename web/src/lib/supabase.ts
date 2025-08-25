import { createClient } from '@supabase/supabase-js'

export const supabaseBrowser = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || url === 'your_supabase_project_url') {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured. Please set up your Supabase project.')
  }
  
  if (!key || key === 'your_supabase_anon_key') {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured. Please set up your Supabase project.')
  }
  
  return createClient(url, key)
}

export const supabaseServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || url === 'your_supabase_project_url') {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured. Please set up your Supabase project.')
  }
  
  if (!key || key === 'your_supabase_service_role_key') {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured. Please set up your Supabase project.')
  }
  
  return createClient(url, key, { auth: { persistSession: false }})
}

// Keep the original export for backward compatibility
export const supabase = supabaseBrowser()
