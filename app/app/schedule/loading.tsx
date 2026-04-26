import { ChevronLeft, ChevronRight } from 'lucide-react'
import AppTabBar from '../tab-bar'

export default function ScheduleLoading() {
  return (
    <main className="appStage">
      <section className="appScreen scheduleScreen scheduleLoadingScreen">
        <header className="scheduleHeader">
          <div>
            <p>Weekly Schedule</p>
            <h1>This week</h1>
          </div>
        </header>

        <nav className="weekSwitcher" aria-label="Loading week navigation">
          <span className="weekArrow"><ChevronLeft size={22} /></span>
          <div className="weekDayStrip">
            {Array.from({ length: 7 }, (_, index) => (
              <span className="weekDayNumber scheduleSkeletonDay" key={index}>
                <b />
                <i />
              </span>
            ))}
          </div>
          <span className="weekArrow"><ChevronRight size={22} /></span>
        </nav>

        <div className="scheduleSkeletonList">
          {Array.from({ length: 4 }, (_, index) => (
            <article className="scheduleSkeletonCard" key={index}>
              <span />
              <div>
                <i />
                <b />
                <em />
              </div>
            </article>
          ))}
        </div>

        <AppTabBar active="schedule" />
      </section>
    </main>
  )
}
