import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClassAction } from '../actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type NewClassPageProps = {
  searchParams?: Promise<{ date?: string; error?: string }>
}

type PracticeType = {
  id: string
  title_en: string
  title_ua: string
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export default async function NewClassPage({ searchParams }: NewClassPageProps) {
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

  if (profile?.role !== 'admin') {
    redirect('/app/schedule')
  }

  const { data: practiceTypes } = await supabase
    .from('practice_types')
    .select('id, title_en, title_ua')
    .order('title_en', { ascending: true })

  return (
    <main className="appStage">
      <section className="appScreen scheduleFormScreen">
        <header className="adminHeader">
          <Link href={`/app/schedule?week=${params.date ?? todayKey()}`} aria-label="Back to schedule">
            <ArrowLeft size={26} />
          </Link>
          <div>
            <p>Schedule</p>
            <h1>Add Class</h1>
          </div>
        </header>

        {params.error ? <p className="adminNotice errorMessage">{params.error}</p> : null}

        <form action={createClassAction} className="adminForm">
          <label>
            Practice type
            <select name="practice_type_id" required>
              <option value="">Select type</option>
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
              <input name="date" required type="date" defaultValue={params.date ?? todayKey()} />
            </label>
            <label>
              Time
              <input name="time" required type="time" defaultValue="18:30" />
            </label>
          </div>

          <div className="adminFormGrid">
            <label>
              Duration
              <input name="duration_minutes" inputMode="numeric" min="1" type="number" defaultValue="60" />
            </label>
            <label>
              Status
              <select name="status" defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <label>
            Zoom link
            <input name="zoom_url" placeholder="https://zoom.us/..." type="url" />
          </label>

          <label>
            Notes
            <textarea name="notes" placeholder="Optional note for this class..." />
          </label>

          <button className="adminPrimaryButton" type="submit">
            <Plus size={18} />
            Add class
          </button>
        </form>
      </section>
    </main>
  )
}
