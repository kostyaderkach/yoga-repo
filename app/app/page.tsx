import Link from 'next/link'
import { Bell, Bookmark, ChevronRight } from 'lucide-react'
import AppTabBar from './tab-bar'

const benefitCards = [
  {
    title: 'Improved\nFlexibility',
    className: 'benefitPurple',
    image:
      'https://images.unsplash.com/photo-1599447292461-9d2b90158f0f?auto=format&fit=crop&w=420&q=80',
  },
  {
    title: 'Stress\nReduction',
    className: 'benefitMint',
    image:
      'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=420&q=80',
  },
  {
    title: 'Improved\nPosture',
    className: 'benefitCoral',
    image:
      'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=420&q=80',
  },
  {
    title: 'Recovery',
    className: 'benefitPeach',
    image:
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=420&q=80',
  },
  {
    title: 'Mindfulness\n& Presence',
    className: 'benefitLilac',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=420&q=80',
  },
  {
    title: 'Spiritual\nGrowth',
    className: 'benefitBlue',
    image:
      'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=420&q=80',
  },
]

const recommendations = [
  {
    title: 'Foundational Warrior Sequence',
    meta: '10 mins · Beginner',
    image:
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=240&q=80',
  },
  {
    title: 'Dynamic Dancer Exploration',
    meta: '24 mins · Intermediate',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=240&q=80',
  },
  {
    title: 'Gentle Sun Salutation',
    meta: '8 mins · Beginner',
    image:
      'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=240&q=80',
  },
  {
    title: 'Balancing Tree Flow',
    meta: '12 mins · Beginner',
    image:
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=240&q=80',
  },
]

export default function AppHomePage() {
  return (
    <main className="appStage">
      <section className="appScreen">
        <header className="appHeader">
          <span className="miniLotus" aria-hidden="true">✦</span>
          <h1>Asana</h1>
          <div className="headerActions">
            <button type="button" aria-label="Notifications">
              <Bell size={21} />
              <span />
            </button>
            <button type="button" aria-label="Saved">
              <Bookmark size={21} />
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

        <section className="benefitGrid" aria-label="Practice benefits">
          {benefitCards.map((card) => (
            <article className={`benefitCard ${card.className}`} key={card.title}>
              <h3>{card.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h3>
              <img src={card.image} alt="" />
            </article>
          ))}
        </section>

        <section className="recommendedSection">
          <div className="sectionHead">
            <h2>Recommended For You</h2>
            <Link href="/app/schedule">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="recommendationList">
            {recommendations.map((item) => (
              <article className="recommendationItem" key={item.title}>
                <img src={item.image} alt="" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.meta}</p>
                </div>
                <ChevronRight size={24} />
              </article>
            ))}
          </div>
        </section>

        <AppTabBar active="home" />
      </section>
    </main>
  )
}
