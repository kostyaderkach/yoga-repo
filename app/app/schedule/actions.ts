'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const timeZone = 'Europe/Zurich'

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function getTimeZoneOffset(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const zonedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  )

  return zonedAsUtc - date.getTime()
}

function localDateTimeToIso(dateValue: string, timeValue: string) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const [hour, minute] = timeValue.split(':').map(Number)
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0))
  const offset = getTimeZoneOffset(utcGuess, timeZone)
  return new Date(utcGuess.getTime() - offset).toISOString()
}

async function getUserClient() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return { supabase, user }
}

async function getAdminClient() {
  const { supabase, user } = await getUserClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/app/schedule')
  }

  return { supabase, user }
}

export async function createClassAction(formData: FormData) {
  const { supabase } = await getAdminClient()
  const date = getFormValue(formData, 'date')
  const time = getFormValue(formData, 'time')
  const practiceTypeId = getFormValue(formData, 'practice_type_id')

  if (!date || !time || !practiceTypeId) {
    redirect(`/app/schedule/new?date=${date || ''}&error=Date, time and practice type are required`)
  }

  const { error } = await supabase.from('classes').insert({
    practice_type_id: practiceTypeId,
    starts_at: localDateTimeToIso(date, time),
    duration_minutes: Number(getFormValue(formData, 'duration_minutes') || 60),
    zoom_url: getFormValue(formData, 'zoom_url') || null,
    status: 'published',
  })

  if (error) {
    redirect(`/app/schedule/new?date=${date}&error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/app/schedule')
  redirect(`/app/schedule?week=${date}&created=1`)
}

export async function updateClassAction(formData: FormData) {
  const { supabase } = await getAdminClient()
  const id = getFormValue(formData, 'id')
  const date = getFormValue(formData, 'date')
  const time = getFormValue(formData, 'time')
  const practiceTypeId = getFormValue(formData, 'practice_type_id')

  if (!id || !date || !time || !practiceTypeId) {
    redirect(`/app/schedule/${id}/edit?error=Date, time and practice type are required`)
  }

  const { error } = await supabase
    .from('classes')
    .update({
      practice_type_id: practiceTypeId,
      starts_at: localDateTimeToIso(date, time),
      duration_minutes: Number(getFormValue(formData, 'duration_minutes') || 60),
      zoom_url: getFormValue(formData, 'zoom_url') || null,
      status: 'published',
    })
    .eq('id', id)

  if (error) {
    redirect(`/app/schedule/${id}/edit?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/app/schedule')
  revalidatePath(`/app/schedule/${id}/edit`)
  redirect(`/app/schedule?week=${date}&updated=1`)
}

export async function deleteClassAction(formData: FormData) {
  const { supabase } = await getAdminClient()
  const id = getFormValue(formData, 'id')
  const weekStart = getFormValue(formData, 'week_start')

  if (!id) {
    redirect(`/app/schedule?week=${weekStart}&error=Class is required`)
  }

  const { error: bookingsError } = await supabase.from('bookings').delete().eq('class_id', id)

  if (bookingsError) {
    redirect(`/app/schedule?week=${weekStart}&error=${encodeURIComponent(bookingsError.message)}`)
  }

  const { error } = await supabase.from('classes').delete().eq('id', id)

  if (error) {
    redirect(`/app/schedule?week=${weekStart}&error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/app/schedule')
  redirect(`/app/schedule?week=${weekStart}&deleted=1`)
}

export async function bookClassAction(formData: FormData) {
  const { supabase, user } = await getUserClient()
  const classId = getFormValue(formData, 'class_id')
  const weekStart = getFormValue(formData, 'week_start')

  if (!classId) {
    redirect(`/app/schedule?week=${weekStart}&error=Class is required`)
  }

  const { data: existingBooking } = await supabase
    .from('bookings')
    .select('id')
    .eq('class_id', classId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingBooking) {
    redirect(`/app/schedule?week=${weekStart}&booked=1`)
  }

  const { error } = await supabase.from('bookings').insert({
    class_id: classId,
    user_id: user.id,
  })

  if (error) {
    redirect(`/app/schedule?week=${weekStart}&error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/app/schedule')
  redirect(`/app/schedule?week=${weekStart}&booked=1`)
}

export async function cancelBookingAction(formData: FormData) {
  const { supabase, user } = await getUserClient()
  const bookingId = getFormValue(formData, 'booking_id')
  const weekStart = getFormValue(formData, 'week_start')

  if (!bookingId) {
    redirect(`/app/schedule?week=${weekStart}&error=Booking is required`)
  }

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId).eq('user_id', user.id)

  if (error) {
    redirect(`/app/schedule?week=${weekStart}&error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/app/schedule')
  redirect(`/app/schedule?week=${weekStart}&canceled=1`)
}
