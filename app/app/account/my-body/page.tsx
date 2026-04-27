import Link from 'next/link'
import { ChevronLeft, Pencil } from 'lucide-react'
import { redirect } from 'next/navigation'
import { updateBodyAction } from '../actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type MyBodyPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>
}

type BodyMetadata = {
  age?: string
  gender?: string
  height?: string
  target_weight?: string
  unit?: string
  weight?: string
}

export default async function MyBodyPage({ searchParams }: MyBodyPageProps) {
  const params = searchParams ? await searchParams : {}
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const body = (user.user_metadata?.body ?? {}) as BodyMetadata

  return (
    <main className="appStage">
      <section className="appScreen accountEditScreen">
        <header className="detailTopBar">
          <Link className="topBackLink" href="/app/account" aria-label="Back to account">
            <ChevronLeft size={28} strokeWidth={2.2} />
            Back
          </Link>
          <span>My Body</span>
          <span />
        </header>

        {params.saved ? <p className="adminNotice successMessage">Body details saved.</p> : null}
        {params.error ? <p className="adminNotice errorMessage">{params.error}</p> : null}

        <form action={updateBodyAction} className="accountEditForm bodyEditForm">
          <div className="unitSwitch" aria-label="Unit system">
            <label>
              <input defaultChecked={body.unit !== 'imperial'} name="unit" type="radio" value="metric" />
              <span>Kg, Cm</span>
            </label>
            <label>
              <input defaultChecked={body.unit === 'imperial'} name="unit" type="radio" value="imperial" />
              <span>Lbs, Ft</span>
            </label>
          </div>

          <label className="bodyField">
            <span>Height</span>
            <input defaultValue={body.height ?? ''} name="height" placeholder="185 cm" />
            <Pencil size={18} />
          </label>

          <label className="bodyField">
            <span>Weight</span>
            <input defaultValue={body.weight ?? ''} name="weight" placeholder="76.00 kg" />
            <Pencil size={18} />
          </label>

          <label className="bodyField">
            <span>Target Weight</span>
            <input defaultValue={body.target_weight ?? ''} name="target_weight" placeholder="82.00 kg" />
            <Pencil size={18} />
          </label>

          <label className="bodyField">
            <span>Age</span>
            <input defaultValue={body.age ?? ''} name="age" placeholder="28" />
            <Pencil size={18} />
          </label>

          <label className="bodyField">
            <span>Gender</span>
            <input defaultValue={body.gender ?? ''} name="gender" placeholder="Female" />
            <Pencil size={18} />
          </label>

          <button className="adminPrimaryButton" type="submit">Save body</button>
        </form>
      </section>
    </main>
  )
}
