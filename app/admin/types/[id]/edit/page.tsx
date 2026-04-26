import Link from 'next/link'
import { ChevronLeft, Save } from 'lucide-react'
import { redirect } from 'next/navigation'
import { updatePracticeTypeAction } from '../../actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type EditPracticeTypePageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ error?: string }>
}

export default async function EditPracticeTypePage({ params, searchParams }: EditPracticeTypePageProps) {
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
    redirect('/app')
  }

  const { data: practiceType } = await supabase
    .from('practice_types')
    .select('*')
    .eq('id', id)
    .single()

  if (!practiceType) {
    redirect('/admin/types?error=Practice type not found')
  }

  return (
    <main className="appStage">
      <section className="adminScreen">
        <header className="adminHeader">
          <Link className="topBackLink" href="/admin/types" aria-label="Back to practice types">
            <ChevronLeft size={28} strokeWidth={2.2} />
            Back
          </Link>
          <div>
            <p>Admin Panel</p>
            <h1>Edit Type</h1>
          </div>
        </header>

        {query.error ? <p className="adminNotice errorMessage">{query.error}</p> : null}

        <form action={updatePracticeTypeAction} className="adminForm">
          <input name="id" type="hidden" value={practiceType.id} />

          <div className="adminFormGrid">
            <label>
              Title EN
              <input name="title_en" placeholder="Vinyasa" required defaultValue={practiceType.title_en} />
            </label>
            <label>
              Title UA
              <input name="title_ua" placeholder="Віньяса" required defaultValue={practiceType.title_ua} />
            </label>
          </div>

          <label>
            Short description EN
            <textarea
              name="description_en"
              placeholder="Dynamic flow practice..."
              defaultValue={practiceType.description_en ?? ''}
            />
          </label>

          <label>
            Short description UA
            <textarea
              name="description_ua"
              placeholder="Динамічна практика..."
              defaultValue={practiceType.description_ua ?? ''}
            />
          </label>

          <label>
            Full description EN
            <textarea
              className="largeTextarea"
              name="full_description_en"
              placeholder="Longer description for the detail screen..."
              defaultValue={practiceType.full_description_en ?? ''}
            />
          </label>

          <label>
            Full description UA
            <textarea
              className="largeTextarea"
              name="full_description_ua"
              placeholder="Повний опис для детальної сторінки..."
              defaultValue={practiceType.full_description_ua ?? ''}
            />
          </label>

          <label>
            Difficulty
            <select name="default_difficulty" defaultValue={practiceType.default_difficulty ?? 'All levels'}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>All levels</option>
            </select>
          </label>

          <label>
            Image URL
            <input name="image_url" placeholder="https://..." type="url" defaultValue={practiceType.image_url ?? ''} />
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
