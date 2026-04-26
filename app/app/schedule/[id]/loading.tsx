import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function PracticeDetailLoading() {
  return (
    <main className="appStage">
      <section className="appScreen classDetailScreen">
        <header className="detailTopBar">
          <Link className="topBackLink" href="/app/schedule" aria-label="Back to schedule">
            <ChevronLeft size={28} strokeWidth={2.2} />
            Back
          </Link>
          <span>Practice</span>
          <span />
        </header>

        <div className="detailHeroShell detailHeroSkeleton" />

        <section className="detailBody detailLoadingBody">
          <i />
          <b />
          <div className="detailMetaGrid">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="detailLoadingText">
            <strong />
            <p />
            <p />
            <p />
          </div>
        </section>
      </section>
    </main>
  )
}
