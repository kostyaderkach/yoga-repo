import Link from 'next/link'
import { ChevronLeft, Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createPracticeTypeAction } from '../actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type NewPracticeTypePageProps = {
  searchParams?: Promise<{ error?: string }>
}

export default async function NewPracticeTypePage({ searchParams }: NewPracticeTypePageProps) {
  const supabase = await createSupabaseServerClient()
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
            <h1>New Type</h1>
          </div>
        </header>

        {query.error ? <p className="adminNotice errorMessage">{query.error}</p> : null}

        <form action={createPracticeTypeAction} className="adminForm">
          <div className="adminFormGrid">
            <label>
              Title EN
              <input name="title_en" placeholder="Vinyasa" required />
            </label>
            <label>
              Title UA
              <input name="title_ua" placeholder="Віньяса" required />
            </label>
          </div>

          <label>
            Description EN
            <textarea name="description_en" placeholder="Dynamic flow practice..." />
          </label>

          <label>
            Description UA
            <textarea name="description_ua" placeholder="Динамічна практика..." />
          </label>

          <label>
            Difficulty
            <select name="default_difficulty">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>All levels</option>
            </select>
          </label>

          <label>
            Image URL
            <input name="image_url" placeholder="https://..." type="url" />
          </label>

          <button className="adminPrimaryButton" type="submit">
            <Plus size={18} />
            Add type
          </button>
        </form>
      </section>
    </main>
  )
}
