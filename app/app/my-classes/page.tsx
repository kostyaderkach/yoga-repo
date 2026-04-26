import Link from 'next/link'
import { CalendarCheck, ChevronRight, Clock3, Gauge, Timer, Video } from 'lucide-react'
import { redirect } from 'next/navigation'
import AppTabBar from '../tab-bar'
import MyClassBookingCard from './my-class-booking-card'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type MyClassesPageProps = {
  searchParams?: Promise<{ view?: string; error?: string }>
}

type PracticeType = {
  title_en?: string | null
  title_ua?: string | null
  description_en?: string | null
  default_difficulty?: string | null
}

type ClassRow = {
  id: string
  starts_at: string
  duration_minutes: number | null
  zoom_url: string | null
  practice_types: PracticeType | PracticeType[] | null
}

type BookingRow = {
  id: string
  class_id: string
  classes: ClassRow | ClassRow[] | null
}

const timeZone = 'Europe/Zurich'

function getClassRow(value: BookingRow['classes']) {
  return Array.isArray(value) ? value[0] : value
}

function getPracticeType(value: ClassRow['practice_types']) {
  return Array.isArray(value) ? value[0] : value
}

function formatClassTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(new Date(value))
}

function formatClassDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
    timeZone,
  }).format(new Date(value))
}

function sortByStart(a: BookingRow, b: BookingRow) {
  const classA = getClassRow(a.classes)
  const classB = getClassRow(b.classes)

  return new Date(classA?.starts_at ?? 0).getTime() - new Date(classB?.starts_at ?? 0).getTime()
}

export default async function MyClassesPage({ searchParams }: MyClassesPageProps) {
  const supabase = await createSupabaseServerClient()
  const params = searchParams ? await searchParams : {}
  const activeView = params.view === 'past' ? 'past' : 'upcoming'

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: rows } = await supabase
    .from('bookings')
    .select('id, class_id, classes(id, starts_at, duration_minutes, zoom_url, practice_types(title_en, title_ua, description_en, default_difficulty))')
    .eq('user_id', user.id)

  const now = Date.now()
  const bookings = ((rows ?? []) as BookingRow[]).filter((booking) => getClassRow(booking.classes))
  const upcoming = bookings
    .filter((booking) => new Date(getClassRow(booking.classes)?.starts_at ?? 0).getTime() >= now)
    .sort(sortByStart)
  const past = bookings
    .filter((booking) => new Date(getClassRow(booking.classes)?.starts_at ?? 0).getTime() < now)
    .sort((a, b) => sortByStart(b, a))
  const visibleBookings = activeView === 'past' ? past : upcoming

  return (
    <main className="appStage">
      <section className="appScreen myClassesScreen">
        <header className="scheduleHeader">
          <div>
            <p>Bookings</p>
            <h1>My Classes</h1>
          </div>
        </header>

        <nav className="myClassesTabs" aria-label="My classes views">
          <Link className={activeView === 'upcoming' ? 'active' : ''} href="/app/my-classes">
            Upcoming
            <span>{upcoming.length}</span>
          </Link>
          <Link className={activeView === 'past' ? 'active' : ''} href="/app/my-classes?view=past">
            Past
            <span>{past.length}</span>
          </Link>
        </nav>

        {params.error ? <p className="adminNotice errorMessage">{params.error}</p> : null}

        <section className="myClassesList">
          {visibleBookings.length ? (
            visibleBookings.map((booking) => {
              const item = getClassRow(booking.classes)

              if (!item) {
                return null
              }

              const practiceType = getPracticeType(item.practice_types)

              return (
                <MyClassBookingCard classId={item.id} key={booking.id}>
                  <article className="myClassCard">
                    <span className="classColor" />
                    <Link className="classContent classContentLink" href={`/app/schedule/${item.id}`}>
                      <p className="myClassDate">{formatClassDate(item.starts_at)}</p>
                      <div className="classMeta">
                        <span><Clock3 size={13} /> {formatClassTime(item.starts_at)}</span>
                        <span><Timer size={13} /> {item.duration_minutes ?? 60} min</span>
                      </div>
                      <h2>{practiceType?.title_en ?? 'Yoga class'}</h2>
                      <p className="classDescription">{practiceType?.description_en ?? practiceType?.title_ua ?? 'Yoga practice'}</p>
                      <span className="classDifficulty">
                        <Gauge size={13} />
                        {practiceType?.default_difficulty ?? 'All levels'}
                      </span>
                      <span className="classOpenCue" aria-hidden="true">
                        <ChevronRight size={18} strokeWidth={2.1} />
                      </span>
                    </Link>
                    <div className="myClassActions">
                      {activeView === 'upcoming' && item.zoom_url ? (
                        <a className="bookClassButton" href={item.zoom_url} rel="noreferrer" target="_blank">
                          <Video size={14} />
                          Zoom
                        </a>
                      ) : null}
                      {activeView === 'upcoming' ? (
                        <button className="softClassButton" data-unbook-button type="button">
                          Unbook
                        </button>
                      ) : (
                        <Link className="softClassButton" href={`/app/schedule/${item.id}`}>
                          Open
                        </Link>
                      )}
                    </div>
                  </article>
                </MyClassBookingCard>
              )
            })
          ) : (
            <div className="myClassesEmpty">
              <span>
                <CalendarCheck size={24} />
              </span>
              <h2>{activeView === 'past' ? 'No past classes' : 'No upcoming classes'}</h2>
              <p>{activeView === 'past' ? 'Completed practices will appear here.' : 'Book a practice from the weekly schedule when you are ready.'}</p>
              {activeView === 'upcoming' ? <Link href="/app/schedule">Find classes</Link> : null}
            </div>
          )}
        </section>

        <AppTabBar active="classes" />
      </section>
    </main>
  )
}
