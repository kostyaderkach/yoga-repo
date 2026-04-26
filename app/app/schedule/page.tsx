import Link from 'next/link'
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Gauge, Pencil, Plus, Timer, Trash2, UsersRound } from 'lucide-react'
import { redirect } from 'next/navigation'
import AppTabBar from '../tab-bar'
import { bookClassAction, cancelBookingAction, deleteClassAction } from './actions'
import ClassDetailLink from './class-detail-link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type SchedulePageProps = {
  searchParams?: Promise<{ week?: string; booked?: string; canceled?: string; created?: string; updated?: string; deleted?: string; error?: string }>
}

type PracticeType = {
  title_en?: string | null
  title_ua?: string | null
  description_en?: string | null
  default_difficulty?: string | null
}

type ClassItem = {
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

function startOfWeek(date: Date) {
  const result = new Date(date)
  const day = result.getDay() || 7
  result.setHours(0, 0, 0, 0)
  result.setDate(result.getDate() - day + 1)
  return result
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatWeekTitle(start: Date) {
  const end = addDays(start, 6)
  const formatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', timeZone })
  return `${formatter.format(start)} - ${formatter.format(end)}`
}

function formatClassTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(new Date(value))
}

function formatDay(date: Date) {
  return {
    key: toDateKey(date),
    name: new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone }).format(date),
    number: new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone }).format(date),
  }
}

function getPracticeType(value: ClassItem['practice_types']) {
  return Array.isArray(value) ? value[0] : value
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const supabase = await createSupabaseServerClient()
  const params = searchParams ? await searchParams : {}

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

  const isAdmin = profile?.role === 'admin'
  const selectedWeek = params.week ? startOfWeek(new Date(`${params.week}T12:00:00.000Z`)) : startOfWeek(new Date())
  const weekEnd = addDays(selectedWeek, 7)
  const previousWeek = toDateKey(addDays(selectedWeek, -7))
  const nextWeek = toDateKey(addDays(selectedWeek, 7))
  const days = Array.from({ length: 7 }, (_, index) => addDays(selectedWeek, index))

  const { data: classRows } = await supabase
    .from('classes')
    .select('id, starts_at, duration_minutes, zoom_url, practice_types(title_en, title_ua, description_en, default_difficulty)')
    .gte('starts_at', selectedWeek.toISOString())
    .lt('starts_at', weekEnd.toISOString())
    .order('starts_at', { ascending: true })

  const classes = (classRows ?? []) as ClassItem[]
  const classIds = classes.map((item) => item.id)

  const { data: bookingRows } = classIds.length
    ? await supabase.from('bookings').select('id, class_id, user_id').in('class_id', classIds)
    : { data: [] }

  const bookings = (bookingRows ?? []) as Booking[]
  const bookingsByClass = bookings.reduce<Record<string, Booking[]>>((acc, booking) => {
    acc[booking.class_id] = [...(acc[booking.class_id] ?? []), booking]
    return acc
  }, {})

  const classesByDay = classes.reduce<Record<string, ClassItem[]>>((acc, item) => {
    const key = toDateKey(new Date(item.starts_at))
    acc[key] = [...(acc[key] ?? []), item]
    return acc
  }, {})
  const visibleDays = isAdmin ? days : days.filter((day) => (classesByDay[toDateKey(day)] ?? []).length > 0)

  return (
    <main className="appStage">
      <section className="appScreen scheduleScreen">
        <header className="scheduleHeader">
          <div>
            <p>Weekly Schedule</p>
            <h1>{formatWeekTitle(selectedWeek)}</h1>
          </div>
        </header>

        <nav className="weekSwitcher" aria-label="Week navigation">
          <Link className="weekArrow" href={`/app/schedule?week=${previousWeek}`} aria-label="Previous week">
            <ChevronLeft size={22} />
          </Link>
          <div className="weekDayStrip">
            {days.map((day) => {
              const dayInfo = formatDay(day)
              const hasPractice = (classesByDay[dayInfo.key] ?? []).length > 0
              const isToday = dayInfo.key === toDateKey(new Date())

              return (
                <span
                  className={`weekDayNumber ${hasPractice ? 'hasPractice' : ''} ${isToday ? 'today' : ''}`}
                  key={dayInfo.key}
                  aria-label={`${dayInfo.name} ${dayInfo.number}${hasPractice ? ', has practice' : ''}`}
                >
                  <b>{Number(dayInfo.number)}</b>
                  <i />
                </span>
              )
            })}
          </div>
          <Link className="weekArrow" href={`/app/schedule?week=${nextWeek}`} aria-label="Next week">
            <ChevronRight size={22} />
          </Link>
        </nav>

        {params.created ? <p className="adminNotice successMessage">Class created.</p> : null}
        {params.updated ? <p className="adminNotice successMessage">Class updated.</p> : null}
        {params.deleted ? <p className="adminNotice successMessage">Class deleted.</p> : null}
        {params.booked ? <p className="adminNotice successMessage">You are booked.</p> : null}
        {params.canceled ? <p className="adminNotice successMessage">Booking canceled.</p> : null}
        {params.error ? <p className="adminNotice errorMessage">{params.error}</p> : null}

        <div className="scheduleDays">
          {visibleDays.length ? visibleDays.map((day) => {
            const dayInfo = formatDay(day)
            const dayClasses = classesByDay[dayInfo.key] ?? []

            return (
              <section className="scheduleDay" key={dayInfo.key}>
                <div className="scheduleDayHeader">
                  <div>
                    <span>{dayInfo.name}</span>
                    <strong>{dayInfo.number}</strong>
                  </div>
                  {isAdmin ? (
                    <Link className="dayAddButton" href={`/app/schedule/new?date=${dayInfo.key}`} aria-label={`Add class on ${dayInfo.key}`}>
                      <Plus size={18} />
                    </Link>
                  ) : null}
                </div>

                <div className="dayClassList">
                  {dayClasses.length ? (
                    dayClasses.map((item) => {
                      const practiceType = getPracticeType(item.practice_types)
                      const classBookings = bookingsByClass[item.id] ?? []
                      const ownBooking = classBookings.find((booking) => booking.user_id === user.id)

                      return (
                        <article className={`scheduleClassCard ${isAdmin ? 'adminClassCard' : ''}`} key={item.id}>
                          <span className="classColor" />
                          <ClassDetailLink className="classContent classContentLink" classId={item.id} href={`/app/schedule/${item.id}`}>
                            <div className="classMeta">
                              <span><Clock3 size={13} /> {formatClassTime(item.starts_at)}</span>
                              <span><Timer size={13} /> {item.duration_minutes ?? 60} min</span>
                              <span><UsersRound size={13} /> {classBookings.length} booked</span>
                            </div>
                            <h2>{practiceType?.title_en ?? 'Yoga class'}</h2>
                            <p className="classDescription">{practiceType?.description_en ?? practiceType?.title_ua ?? 'Yoga practice'}</p>
                            <span className="classDifficulty">
                              <Gauge size={13} />
                              {practiceType?.default_difficulty ?? 'All levels'}
                            </span>
                          </ClassDetailLink>
                          <div className="classActions">
                            {isAdmin ? (
                              <>
                                <Link className="classIconButton" href={`/app/schedule/${item.id}/edit`} aria-label="Edit class">
                                  <Pencil size={16} />
                                </Link>
                                <form action={deleteClassAction}>
                                  <input name="id" type="hidden" value={item.id} />
                                  <input name="week_start" type="hidden" value={toDateKey(selectedWeek)} />
                                  <button className="classIconButton danger" type="submit" aria-label="Delete class">
                                    <Trash2 size={16} />
                                  </button>
                                </form>
                              </>
                            ) : ownBooking ? (
                              <form action={cancelBookingAction}>
                                <input name="booking_id" type="hidden" value={ownBooking.id} />
                                <input name="class_id" type="hidden" value={item.id} />
                                <input name="week_start" type="hidden" value={toDateKey(selectedWeek)} />
                                <button className="softClassButton" type="submit">Unbook</button>
                              </form>
                            ) : (
                              <form action={bookClassAction}>
                                <input name="class_id" type="hidden" value={item.id} />
                                <input name="week_start" type="hidden" value={toDateKey(selectedWeek)} />
                                <button className="bookClassButton" type="submit">Book</button>
                              </form>
                            )}
                          </div>
                        </article>
                      )
                    })
                  ) : (
                    <p className="dayEmpty">No classes</p>
                  )}
                </div>
              </section>
            )
          }) : (
            <div className="scheduleEmptyState">
              <h2>No classes this week</h2>
              <p>Check another week or come back when the next schedule is ready.</p>
            </div>
          )}
        </div>

        {isAdmin ? (
          <Link className="floatingAddButton" href={`/app/schedule/new?date=${toDateKey(selectedWeek)}`} aria-label="Add class">
            <CalendarDays size={21} />
            Add class
          </Link>
        ) : null}

        <AppTabBar active="schedule" />
      </section>
    </main>
  )
}
