import Link from 'next/link'
import { CalendarCheck, Clock3 } from 'lucide-react'
import AppTabBar from '../tab-bar'

export default function MyClassesPage() {
  return (
    <main className="appStage">
      <section className="appScreen feedScreen">
        <header className="pageTitleHeader">
          <h1>My Classes</h1>
          <p>Your upcoming bookings will appear here.</p>
        </header>

        <section className="feedList">
          <article className="feedItem">
            <span className="feedAvatar">
              <CalendarCheck size={22} />
            </span>
            <div>
              <h2>No bookings yet</h2>
              <p>Open the weekly schedule and book a class when you are ready.</p>
              <Link href="/app/schedule">Find a class</Link>
            </div>
          </article>

          <article className="feedItem muted">
            <span className="feedAvatar">
              <Clock3 size={22} />
            </span>
            <div>
              <h2>Zoom links</h2>
              <p>Later this screen will show your booked classes and meeting links.</p>
            </div>
          </article>
        </section>
        <AppTabBar active="classes" />
      </section>
    </main>
  )
}
