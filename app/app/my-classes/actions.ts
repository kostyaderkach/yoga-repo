'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function cancelMyClassBookingAction(bookingId: string, classId: string) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (!bookingId) {
    return {
      ok: false,
      message: 'Booking is required.',
    }
  }

  const { data, error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .select('id')
    .maybeSingle()

  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }

  if (!data) {
    return {
      ok: false,
      message: 'Booking was not found.',
    }
  }

  revalidatePath('/app/my-classes')
  revalidatePath('/app/schedule')
  if (classId) {
    revalidatePath(`/app/schedule/${classId}`)
  }

  return {
    ok: true,
    message: 'Booking canceled.',
  }
}
