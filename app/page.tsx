import Link from 'next/link'
import { ArrowRight, CalendarDays, Leaf, Search, Sparkles, UserRound } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="screenStage">
      <section className="phoneFrame homePreview">
        <header className="welcomeHeader">
          <span className="brandDot">
            <Sparkles size={24} />
          </span>
          <p className="mutedLabel">Online yoga studio</p>
          <h1>Practice live yoga from home</h1>
        </header>

        <div className="searchBox">
          <Search size={24} />
          <span>Search classes</span>
        </div>

        <div className="heroCard publicHero">
          <div>
            <p>Upcoming live class</p>
            <h2>Vinyasa Flow</h2>
            <span>Today · 18:30 · Online</span>
          </div>
          <CalendarDays size={28} />
        </div>

        <div className="sectionTitle">
          <h2>Start your practice</h2>
          <p>Создайте аккаунт, чтобы записываться на занятия и получать Zoom-ссылки.</p>
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
