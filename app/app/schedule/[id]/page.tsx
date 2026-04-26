import Link from 'next/link'
import { ArrowLeft, Clock3, Gauge, Pencil, Timer, UsersRound } from 'lucide-react'
import { redirect } from 'next/navigation'
import type { CSSProperties } from 'react'
import { bookClassAction, cancelBookingAction } from '../actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type ClassDetailPageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ booked?: string; canceled?: string; error?: string }>
}

type PracticeType = {
  title_en?: string | null
  title_ua?: string | null
  description_en?: string | null
  description_ua?: string | null
  default_difficulty?: string | null
  image_url?: string | null
}

type ClassRow = {
  id: string
  starts_at: string
  duration_minutes: number | null
  zoom_url: string | null
  practice_types: PracticeType | PracticeType[] | null
}

type Booking = {
  id: string
  class_id: string
  user_id: string
}

const timeZone = 'Europe/Zurich'
const fallbackImage = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85'

function getPracticeType(value: ClassRow['practice_types']) {
  return Array.isArray(value) ? value[0] : value
}

function startOfWeek(date: Date) {
  const result = new Date(date)
  const day = result.getDay() || 7
  result.setHours(0, 0, 0, 0)
  result.setDate(result.getDate() - day + 1)
  return result
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatClassDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone,
  }).format(new Date(value))
}

function formatClassTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(new Date(value))
}

function participantLabel(booking: Booking, index: number, currentUserId: string) {
  return booking.user_id === currentUserId ? 'You' : `Student ${index + 1}`
}

function initials(label: string) {
  return label
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default async function ClassDetailPage({ params, searchParams }: ClassDetailPageProps) {
  const supabase = await createSupabaseServerClient()
  const { id } = await params
  const query = searchParams ? await searchParams : {}

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: classRow }, { data: bookingsRows }, { data: profile }] = await Promise.all([
    supabase
      .from('classes')
      .select('id, starts_at, duration_minutes, zoom_url, practice_types(title_en, title_ua, description_en, description_ua, default_difficulty, image_url)')
      .eq('id', id)
      .single(),
    supabase.from('bookings').select('id, class_id, user_id').eq('class_id', id),
    supabase.from('profiles').select('role').eq('id', user.id).single(),
  ])

  if (!classRow) {
    redirect('/app/schedule?error=Class not found')
  }

  const item = classRow as ClassRow
  const bookings = (bookingsRows ?? []) as Booking[]
  const practiceType = getPracticeType(item.practice_types)
  const ownBooking = bookings.find((booking) => booking.user_id === user.id)
  const isAdmin = profile?.role === 'admin'
  const weekStart = toDateKey(startOfWeek(new Date(item.starts_at)))
  const returnTo = `/app/schedule/${item.id}`

  return (
    <main className="appStage">
      <section className="appScreen classDetailScreen">
        <header className="detailTopBar">
          <Link href={`/app/schedule?week=${weekStart}`} aria-label="Back to schedule">
            <ArrowLeft size={25} />
          </Link>
          <span>Practice</span>
          {isAdmin ? (
            <Link href={`/app/schedule/${item.id}/edit`} aria-label="Edit class">
              <Pencil size={20} />
            </Link>
          ) : (
            <span />
          )}
        </header>

        <img
          className="detailHeroImage"
          src={practiceType?.image_url || fallbackImage}
          alt=""
          style={{ viewTransitionName: `class-card-${item.id}` } as CSSProperties}
        />

        <section className="detailBody">
          <p className="detailDate">{formatClassDate(item.starts_at)}</p>
          <h1>{practiceType?.title_en ?? 'Yoga class'}</h1>
          <div className="detailMetaGrid">
            <span><Clock3 size={15} /> {formatClassTime(item.starts_at)}</span>
            <span><Timer size={15} /> {item.duration_minutes ?? 60} min</span>
            <span><Gauge size={15} /> {practiceType?.default_difficulty ?? 'All levels'}</span>
            <span><UsersRound size={15} /> {bookings.length} booked</span>
          </div>

          {query.booked ? <p className="adminNotice successMessage">You are booked.</p> : null}
          {query.canceled ? <p className="adminNotice successMessage">Booking canceled.</p> : null}
          {query.error ? <p className="adminNotice errorMessage">{query.error}</p> : null}

          <section className="detailSection">
            <h2>Description</h2>
            <p>{practiceType?.description_en || practiceType?.description_ua || 'A guided online yoga practice with live Zoom instruction.'}</p>
          </section>

          <section className="detailSection">
            <div className="detailSectionHeader">
              <h2>Booked students</h2>
              <span>{bookings.length}</span>
            </div>
            {bookings.length ? (
              <div className="participantList">
                {bookings.map((booking, index) => {
                  const label = participantLabel(booking, index, user.id)

                  return (
                    <div className="participantRow" key={booking.id}>
                      <span>{initials(label)}</span>
                      <strong>{label}</strong>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="detailMuted">No students booked yet.</p>
            )}
          </section>
        </section>

        {!isAdmin ? (
          <div className="detailBottomAction">
            {ownBooking ? (
              <form action={cancelBookingAction}>
                <input name="booking_id" type="hidden" value={ownBooking.id} />
                <input name="class_id" type="hidden" value={item.id} />
                <input name="week_start" type="hidden" value={weekStart} />
                <input name="return_to" type="hidden" value={returnTo} />
                <button className="detailSecondaryButton" type="submit">Unbook practice</button>
              </form>
            ) : (
              <form action={bookClassAction}>
                <input name="class_id" type="hidden" value={item.id} />
                <input name="week_start" type="hidden" value={weekStart} />
                <input name="return_to" type="hidden" value={returnTo} />
                <button className="detailPrimaryButton" type="submit">Book practice</button>
              </form>
            )}
          </div>
        ) : null}
      </section>
    </main>
  )
}
