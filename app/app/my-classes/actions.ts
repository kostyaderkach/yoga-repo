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

  let query = supabase
    .from('bookings')
    .delete()
    .eq('user_id', user.id)
    .select('id')

  query = bookingId ? query.eq('id', bookingId) : query.eq('class_id', classId)

  const { data, error } = await query

  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }

  if (!data?.length) {
    return {
      ok: false,
      message: 'Booking could not be canceled. Check bookings delete policy.',
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
