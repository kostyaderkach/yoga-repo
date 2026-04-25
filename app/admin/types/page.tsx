import Link from 'next/link'
import { ArrowLeft, Pencil, Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createPracticeTypeAction } from './actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type PracticeType = {
  id: string
  title_en: string
  title_ua: string
  description_en: string | null
  default_difficulty: string | null
  color: string | null
}

type AdminTypesPageProps = {
  searchParams?: Promise<{ created?: string; updated?: string; error?: string }>
}

export default async function AdminTypesPage({ searchParams }: AdminTypesPageProps) {
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
    redirect('/app')
  }

  const { data: practiceTypes } = await supabase
    .from('practice_types')
    .select('id, title_en, title_ua, description_en, default_difficulty, color')
    .order('created_at', { ascending: false })

  return (
    <main className="appStage">
      <section className="adminScreen">
        <header className="adminHeader">
          <Link href="/app/account" aria-label="Back to account">
            <ArrowLeft size={26} />
          </Link>
          <div>
            <p>Admin Panel</p>
            <h1>Practice Types</h1>
          </div>
        </header>

        {params.created ? <p className="adminNotice successMessage">Practice type created.</p> : null}
        {params.updated ? <p className="adminNotice successMessage">Practice type updated.</p> : null}
        {params.error ? <p className="adminNotice errorMessage">{params.error}</p> : null}

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

          <div className="adminFormGrid">
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
              Color
              <input name="color" placeholder="#7768f8" />
            </label>
          </div>

          <label>
            Image URL
            <input name="image_url" placeholder="https://..." type="url" />
          </label>

          <button className="adminPrimaryButton" type="submit">
            <Plus size={18} />
            Add type
          </button>
        </form>

        <section className="adminList">
          <h2>Existing types</h2>
          {practiceTypes?.length ? (
            practiceTypes.map((type: PracticeType) => (
              <article className="adminTypeCard" key={type.id}>
                <span style={{ background: type.color ?? '#7768f8' }} />
                <div>
                  <h3>{type.title_en}</h3>
                  <p>{type.title_ua}</p>
                  {type.description_en ? <small>{type.description_en}</small> : null}
                </div>
                <strong>{type.default_difficulty ?? 'All levels'}</strong>
                <Link className="adminIconButton" href={`/admin/types/${type.id}/edit`} aria-label={`Edit ${type.title_en}`}>
                  <Pencil size={17} />
                </Link>
              </article>
            ))
          ) : (
            <p className="emptyState">No practice types yet.</p>
          )}
        </section>
      </section>
    </main>
  )
}
