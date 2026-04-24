import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://zshkxhixuyixfgojjpla.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_OGjsNI-10sZnqBOE9RJ6SA_C0nso5y_'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
