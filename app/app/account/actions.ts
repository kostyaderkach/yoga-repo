'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function getValue(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

async function getAuthedClient() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return { supabase, user }
}

export async function updateProfileAction(formData: FormData) {
  const { supabase, user } = await getAuthedClient()
  const metadata = user.user_metadata ?? {}

  const { error } = await supabase.auth.updateUser({
    data: {
      ...metadata,
      full_name: getValue(formData, 'full_name'),
      phone: getValue(formData, 'phone'),
      gender: getValue(formData, 'gender'),
      birthdate: getValue(formData, 'birthdate'),
    },
  })

  if (error) {
    redirect(`/app/account/profile?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/app/account')
  revalidatePath('/app/account/profile')
  redirect('/app/account/profile?saved=1')
}

export async function updateBodyAction(formData: FormData) {
  const { supabase, user } = await getAuthedClient()
  const metadata = user.user_metadata ?? {}

  const { error } = await supabase.auth.updateUser({
    data: {
      ...metadata,
      body: {
        unit: getValue(formData, 'unit') || 'metric',
        height: getValue(formData, 'height'),
        weight: getValue(formData, 'weight'),
        target_weight: getValue(formData, 'target_weight'),
        age: getValue(formData, 'age'),
        gender: getValue(formData, 'gender'),
      },
    },
  })

  if (error) {
    redirect(`/app/account/my-body?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/app/account')
  revalidatePath('/app/account/my-body')
  redirect('/app/account/my-body?saved=1')
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
