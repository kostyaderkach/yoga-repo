import Link from 'next/link'
import { CalendarDays, Menu, Search, Sparkles } from 'lucide-react'
import AppTabBar from './tab-bar'

export default function AppHomePage() {
  return (
    <main className="appStage">
      <section className="appScreen feedScreen">
        <header className="threadsTopBar">
          <button type="button" aria-label="Menu">
            <Menu size={25} />
          </button>
          <h1>Asana</h1>
          <button type="button" aria-label="Search">
            <Search size={26} />
          </button>
        </header>

        <section className="composerRow">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" alt="" />
          <div>
            <strong>What&apos;s next?</strong>
            <p>Book your next online yoga class.</p>
          </div>
          <Link href="/app/schedule">Schedule</Link>
        </section>

        <section className="feedList">
          <article className="feedItem">
            <span className="feedAvatar">
              <CalendarDays size={22} />
            </span>
            <div>
              <h2>Weekly schedule</h2>
              <p>Choose a class, see who joined, and keep your Zoom practice in one place.</p>
              <Link href="/app/schedule">Open schedule</Link>
            </div>
          </article>

          <article className="feedItem">
            <span className="feedAvatar accent">
              <Sparkles size={22} />
            </span>
            <div>
              <h2>Practice types</h2>
              <p>Ashtanga, Vinyasa, beginner flows and advanced sessions stay organized for the teacher.</p>
              <Link href="/admin/types">Manage types</Link>
            </div>
          </article>
        </section>

        <AppTabBar active="home" />
      </section>
    </main>
  )
}
