import AppTabBar from '../tab-bar'

export default function MyClassesPage() {
  return (
    <main className="appStage">
      <section className="appScreen placeholderScreen">
        <p className="placeholderLabel">My Classes</p>
        <h1>Мои записи</h1>
        <p>Здесь будут будущие занятия, Zoom-ссылки и отмена записи.</p>
        <AppTabBar active="classes" />
      </section>
    </main>
  )
}
