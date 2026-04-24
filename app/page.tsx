import Link from 'next/link'
import { ArrowRight, CalendarDays, Leaf, UserRound } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="screenStage">
      <section className="phoneFrame homePreview">
        <div className="statusBar">
          <span>9:41</span>
          <span>●●●</span>
        </div>

        <header className="homeHeader">
          <div>
            <p className="mutedLabel">Good morning</p>
            <h1>Sophia!</h1>
          </div>
          <div className="avatar" />
        </header>

        <div className="heroCard">
          <div>
            <p>Next class</p>
            <h2>Vinyasa Flow</h2>
            <span>Today · 18:30 · Zoom</span>
          </div>
          <CalendarDays size={28} />
        </div>

        <div className="sectionTitle">
          <h2>Start with account</h2>
          <p>Первый шаг: вход и регистрация в стиле мобильного приложения.</p>
        </div>

        <div className="actionStack">
          <Link className="limeButton" href="/login">
            Login <ArrowRight size={19} />
          </Link>
          <Link className="ghostButton" href="/register">
            Create account
          </Link>
        </div>

        <nav className="bottomNav">
          <span className="active"><Leaf size={20} />Home</span>
          <span><CalendarDays size={20} />Classes</span>
          <span><UserRound size={20} />Profile</span>
        </nav>
      </section>
    </main>
  )
}
