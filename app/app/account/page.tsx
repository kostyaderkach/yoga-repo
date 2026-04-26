import Link from 'next/link'
import { Bell, ChevronRight, CreditCard, Languages, Settings, SlidersHorizontal, UserRound } from 'lucide-react'
import AppTabBar from '../tab-bar'

export default function AccountPage() {
  const rows = [
    { icon: UserRound, label: 'Profile', value: 'Basic member' },
    { icon: CreditCard, label: 'Subscription', value: 'Coming soon' },
    { icon: Languages, label: 'Language', value: 'EN / UA' },
    { icon: Bell, label: 'Notifications', value: 'Soon' },
    { icon: SlidersHorizontal, label: 'Practice types', value: 'Admin', href: '/admin/types' },
    { icon: Settings, label: 'Settings', value: '' },
  ]

  return (
    <main className="appStage">
      <section className="appScreen accountScreen">
        <header className="profileHeader">
          <div>
            <h1>Account</h1>
            <p>Yoga student profile</p>
          </div>
          <div className="profileAvatar">A</div>
        </header>

        <section className="settingsList">
          {rows.map((row) => {
            const Icon = row.icon
            const content = (
              <>
                <Icon size={24} />
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

        <button className="logoutButton" type="button">Log out</button>
        <AppTabBar active="account" />
      </section>
    </main>
  )
}
