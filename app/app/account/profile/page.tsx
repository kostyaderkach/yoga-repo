import Link from 'next/link'
import { CalendarDays, ChevronLeft, Image, Mail, Pencil, Phone, UserRound } from 'lucide-react'
import { redirect } from 'next/navigation'
import { updateProfileAction } from '../actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type ProfilePageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'Y'
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = searchParams ? await searchParams : {}
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const metadata = user.user_metadata ?? {}
  const name = typeof metadata.full_name === 'string' && metadata.full_name ? metadata.full_name : user.email?.split('@')[0] ?? ''
  const avatarUrl = typeof metadata.avatar_url === 'string' ? metadata.avatar_url : ''
  const phone = typeof metadata.phone === 'string' ? metadata.phone : ''
  const gender = typeof metadata.gender === 'string' ? metadata.gender : ''
  const birthdate = typeof metadata.birthdate === 'string' ? metadata.birthdate : ''

  return (
    <main className="appStage">
      <section className="appScreen accountEditScreen">
        <header className="detailTopBar">
          <Link className="topBackLink" href="/app/account" aria-label="Back to account">
            <ChevronLeft size={28} strokeWidth={2.2} />
            Back
          </Link>
          <span>My Profile</span>
          <span />
        </header>

        <div className="editAvatarBlock">
          <div className="accountAvatar large">
            {avatarUrl ? <img src={avatarUrl} alt="" /> : getInitials(name)}
            <span className="avatarEditBadge">
              <Pencil size={16} />
            </span>
          </div>
        </div>

        {params.saved ? <p className="adminNotice successMessage">Profile saved.</p> : null}
        {params.error ? <p className="adminNotice errorMessage">{params.error}</p> : null}

        <form action={updateProfileAction} className="accountEditForm">
          <label>
            Full Name
            <span className="accountField">
              <UserRound size={19} />
              <input defaultValue={name} name="full_name" placeholder="Your name" />
            </span>
          </label>

          <label>
            Avatar URL
            <span className="accountField">
              <Image size={19} />
              <input defaultValue={avatarUrl} name="avatar_url" placeholder="https://..." />
            </span>
          </label>

          <label>
            Email
            <span className="accountField disabled">
              <Mail size={19} />
              <input defaultValue={user.email ?? ''} disabled />
            </span>
          </label>

          <label>
            Phone Number
            <span className="accountField">
              <Phone size={19} />
              <input defaultValue={phone} name="phone" placeholder="+1 111 467 378 399" />
            </span>
          </label>

          <label>
            Gender
            <select defaultValue={gender} name="gender">
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Birthdate
            <span className="accountField">
              <CalendarDays size={19} />
              <input defaultValue={birthdate} name="birthdate" type="date" />
            </span>
          </label>

          <button className="adminPrimaryButton" type="submit">Save profile</button>
        </form>
      </section>
    </main>
  )
}
