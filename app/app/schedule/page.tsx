import AppTabBar from '../tab-bar'

export default function SchedulePage() {
  return (
    <main className="appStage">
      <section className="appScreen placeholderScreen">
        <p className="placeholderLabel">Schedule</p>
        <h1>Расписание занятий</h1>
        <p>Здесь будет список live-классов, фильтры и запись на тренировку.</p>
        <AppTabBar active="schedule" />
      </section>
    </main>
  )
}
