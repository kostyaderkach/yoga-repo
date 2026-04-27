import Link from 'next/link'
import { Bell, ChevronRight, Languages, LogOut, Ruler, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react'
import { redirect } from 'next/navigation'
import AppTabBar from '../tab-bar'
import { logoutAction } from './actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'Y'
}

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient()
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

  const name = typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name
    ? user.user_metadata.full_name
    : user.email?.split('@')[0] ?? 'Yoga student'
  const avatarUrl = typeof user.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : ''
  const rows = [
    { icon: Ruler, label: 'My Body', value: 'Height, weight, goals', href: '/app/account/my-body' },
    { icon: Languages, label: 'Language', value: 'EN / UA' },
    { icon: Bell, label: 'Notifications', value: 'Soon' },
    { icon: ShieldCheck, label: 'Account & Security', value: 'Email login' },
  ]
  const adminRows = profile?.role === 'admin'
    ? [{ icon: SlidersHorizontal, label: 'Practice types', value: 'Admin', href: '/admin/types' }]
    : []

  const allRows = [...rows, ...adminRows]

  return (
    <main className="appStage">
      <section className="appScreen accountScreen">
        <header className="accountTopBar">
          <span />
          <h1>Account</h1>
          <span />
        </header>

        <Link className="accountProfileCard" href="/app/account/profile">
          <div className="accountAvatar">
            {avatarUrl ? <img src={avatarUrl} alt="" /> : getInitials(name)}
          </div>
          <div>
            <h2>{name}</h2>
            <p>{user.email}</p>
          </div>
          <ChevronRight size={20} />
        </Link>

        <section className="settingsList">
          {allRows.map((row) => {
            const Icon = row.icon
            const content = (
              <>
                <Icon size={21} />
                <span>{row.label}</span>
                {row.value ? <small>{row.value}</small> : null}
                <ChevronRight size={19} />
              </>
            )

            return row.href ? (
              <Link className="settingsRow" href={row.href} key={row.label}>
                {content}
              </Link>
            ) : (
              <div className="settingsRow" key={row.label}>
                {content}
              </div>
            )
          })}
        </section>

        <form action={logoutAction}>
          <button className="logoutButton" type="submit">
            <LogOut size={21} />
            Logout
          </button>
        </form>
        <AppTabBar active="account" />
      </section>
    </main>
  )
}
