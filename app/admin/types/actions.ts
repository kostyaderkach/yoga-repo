'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

async function getAdminClient() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/app')
  }

  return supabase
}

export async function createPracticeTypeAction(formData: FormData) {
  const supabase = await getAdminClient()

  const titleEn = getFormValue(formData, 'title_en')
  const titleUa = getFormValue(formData, 'title_ua')

  if (!titleEn || !titleUa) {
    redirect('/admin/types/new?error=Title EN and UA are required')
  }

  const { error } = await supabase.from('practice_types').insert({
    title_en: titleEn,
    title_ua: titleUa,
    description_en: getFormValue(formData, 'description_en') || null,
    description_ua: getFormValue(formData, 'description_ua') || null,
    default_difficulty: getFormValue(formData, 'default_difficulty') || null,
    color: getFormValue(formData, 'color') || null,
    image_url: getFormValue(formData, 'image_url') || null,
  })

  if (error) {
    redirect(`/admin/types/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/types')
  redirect('/admin/types?created=1')
}

export async function updatePracticeTypeAction(formData: FormData) {
  const supabase = await getAdminClient()
  const id = getFormValue(formData, 'id')
  const titleEn = getFormValue(formData, 'title_en')
  const titleUa = getFormValue(formData, 'title_ua')

  if (!id) {
    redirect('/admin/types?error=Practice type id is required')
  }

  if (!titleEn || !titleUa) {
    redirect(`/admin/types/${id}/edit?error=Title EN and UA are required`)
  }

  const { error } = await supabase
    .from('practice_types')
    .update({
      title_en: titleEn,
      title_ua: titleUa,
      description_en: getFormValue(formData, 'description_en') || null,
      description_ua: getFormValue(formData, 'description_ua') || null,
      default_difficulty: getFormValue(formData, 'default_difficulty') || null,
      color: getFormValue(formData, 'color') || null,
      image_url: getFormValue(formData, 'image_url') || null,
    })
    .eq('id', id)

  if (error) {
    redirect(`/admin/types/${id}/edit?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/types')
  revalidatePath(`/admin/types/${id}/edit`)
  redirect('/admin/types?updated=1')
}
