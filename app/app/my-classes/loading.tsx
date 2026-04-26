import AppTabBar from '../tab-bar'

export default function MyClassesLoading() {
  return (
    <main className="appStage">
      <section className="appScreen myClassesScreen">
        <header className="scheduleHeader">
          <div>
            <p>Bookings</p>
            <h1>My Classes</h1>
          </div>
        </header>

        <nav className="myClassesTabs" aria-label="Loading my classes views">
          <span className="active">Upcoming</span>
          <span>Past</span>
        </nav>

        <div className="scheduleSkeletonList">
          {Array.from({ length: 3 }, (_, index) => (
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

        <AppTabBar active="classes" />
      </section>
    </main>
  )
}
