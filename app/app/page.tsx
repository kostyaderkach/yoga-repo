import Link from 'next/link'
import { Bell } from 'lucide-react'
import AppTabBar from './tab-bar'

export default function AppHomePage() {
  return (
    <main className="appStage">
      <section className="appScreen">
        <header className="appHeader compactHeader">
          <span />
          <h1>Asana</h1>
          <div className="headerActions">
            <button type="button" aria-label="Notifications">
              <Bell size={21} />
              <span />
            </button>
          </div>
        </header>

        <section className="homeHeroCard">
          <div>
            <h2>Serenity Flow:<br />Yoga for Beginner</h2>
            <Link href="/app/schedule">Get Started</Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=640&q=85"
            alt=""
          />
        </section>

        <AppTabBar active="home" />
      </section>
    </main>
  )
}
