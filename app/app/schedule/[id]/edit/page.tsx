import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { redirect } from 'next/navigation'
import { updateClassAction } from '../../actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type EditClassPageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ error?: string }>
}

type PracticeType = {
  id: string
  title_en: string
  title_ua: string
}

type ClassRow = {
  id: string
  practice_type_id: string
  starts_at: string
  duration_minutes: number | null
  zoom_url: string | null
  notes: string | null
  status: string | null
}

function localDateParts(value: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Zurich',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(value))

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`,
  }
}

export default async function EditClassPage({ params, searchParams }: EditClassPageProps) {
  const supabase = await createSupabaseServerClient()
  const { id } = await params
  const query = searchParams ? await searchParams : {}

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
    redirect('/app/schedule')
  }

  const [{ data: classRow }, { data: practiceTypes }] = await Promise.all([
    supabase
      .from('classes')
      .select('id, practice_type_id, starts_at, duration_minutes, zoom_url, notes, status')
      .eq('id', id)
      .single(),
    supabase.from('practice_types').select('id, title_en, title_ua').order('title_en', { ascending: true }),
  ])

  if (!classRow) {
    redirect('/app/schedule?error=Class not found')
  }

  const item = classRow as ClassRow
  const local = localDateParts(item.starts_at)

  return (
    <main className="appStage">
      <section className="appScreen scheduleFormScreen">
        <header className="adminHeader">
          <Link href={`/app/schedule?week=${local.date}`} aria-label="Back to schedule">
            <ArrowLeft size={26} />
          </Link>
          <div>
            <p>Schedule</p>
            <h1>Edit Class</h1>
          </div>
        </header>

        {query.error ? <p className="adminNotice errorMessage">{query.error}</p> : null}

        <form action={updateClassAction} className="adminForm">
          <input name="id" type="hidden" value={item.id} />

          <label>
            Practice type
            <select name="practice_type_id" required defaultValue={item.practice_type_id}>
              {((practiceTypes ?? []) as PracticeType[]).map((type) => (
                <option key={type.id} value={type.id}>
                  {type.title_en} / {type.title_ua}
                </option>
              ))}
            </select>
          </label>

          <div className="adminFormGrid">
            <label>
              Date
              <input name="date" required type="date" defaultValue={local.date} />
            </label>
            <label>
              Time
              <input name="time" required type="time" defaultValue={local.time} />
            </label>
          </div>

          <div className="adminFormGrid">
            <label>
              Duration
              <input name="duration_minutes" inputMode="numeric" min="1" type="number" defaultValue={item.duration_minutes ?? 60} />
            </label>
            <label>
              Status
              <select name="status" defaultValue={item.status ?? 'draft'}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <label>
            Zoom link
            <input name="zoom_url" placeholder="https://zoom.us/..." type="url" defaultValue={item.zoom_url ?? ''} />
          </label>

          <label>
            Notes
            <textarea name="notes" placeholder="Optional note for this class..." defaultValue={item.notes ?? ''} />
          </label>

          <button className="adminPrimaryButton" type="submit">
            <Save size={18} />
            Save changes
          </button>
        </form>
      </section>
    </main>
  )
}
