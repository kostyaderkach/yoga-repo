import AppTabBar from '../tab-bar'

export default function AccountPage() {
  return (
    <main className="appStage">
      <section className="appScreen placeholderScreen">
        <p className="placeholderLabel">Account</p>
        <h1>Профиль</h1>
        <p>Здесь будут профиль, язык, абонемент, оплата и выход.</p>
        <AppTabBar active="account" />
      </section>
    </main>
  )
}
