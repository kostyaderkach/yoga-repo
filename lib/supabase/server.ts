import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://zshkxhixuyixfgojjpla.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_OGjsNI-10sZnqBOE9RJ6SA_C0nso5y_'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server components cannot always set cookies; middleware refreshes sessions.
        }
      },
    },
  })
}
