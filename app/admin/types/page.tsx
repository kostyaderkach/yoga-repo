import Link from 'next/link'
import { ArrowLeft, Pencil, Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type PracticeType = {
  id: string
  title_en: string
  title_ua: string
  description_en: string | null
  default_difficulty: string | null
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
    .select('id, title_en, title_ua, description_en, default_difficulty')
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

        <div className="adminTopActions">
          <Link className="adminPrimaryButton" href="/admin/types/new">
            <Plus size={18} />
            Add practice type
          </Link>
        </div>

        <section className="adminList">
          <h2>Existing types</h2>
          {practiceTypes?.length ? (
            practiceTypes.map((type: PracticeType) => (
              <article className="adminTypeCard" key={type.id}>
                <span />
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
            <div className="adminEmptyState">
              <h3>No practice types yet</h3>
              <p>Create your first yoga practice type, then use it later when building the class schedule.</p>
              <Link className="adminSecondaryButton" href="/admin/types/new">
                <Plus size={18} />
                Add type
              </Link>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
