import Link from 'next/link'
import { CalendarDays, Home, ListChecks, UserRound } from 'lucide-react'

type Tab = 'home' | 'schedule' | 'classes' | 'account'

const tabs = [
  { id: 'home', label: 'Home', href: '/app', icon: Home },
  { id: 'schedule', label: 'Schedule', href: '/app/schedule', icon: CalendarDays },
  { id: 'classes', label: 'My Classes', href: '/app/my-classes', icon: ListChecks },
  { id: 'account', label: 'Account', href: '/app/account', icon: UserRound },
] satisfies Array<{
  id: Tab
  label: string
  href: string
  icon: typeof Home
}>

export default function AppTabBar({ active }: { active: Tab }) {
  return (
    <nav className="appTabBar" aria-label="App navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.id === active

        return (
          <Link className={isActive ? 'active' : ''} href={tab.href} key={tab.id}>
            <span>
              <Icon size={21} />
            </span>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
