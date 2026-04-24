import Link from 'next/link'

export default function WelcomePage() {
  return (
    <main className="appStage">
      <section className="welcomeScreen">
        <div className="welcomeHero">
          <h1>Let&apos;s Get Started!</h1>
          <p>Let&apos;s dive in into your account</p>
        </div>

        <div className="welcomeActions">
          <Link className="primaryPurpleButton" href="/register">
            Sign up
          </Link>
          <Link className="softPurpleButton" href="/login">
            Log in
          </Link>
        </div>

        <footer className="legalLinks">
          <div className="languageSwitch" aria-label="Language switcher">
            <button className="active" type="button">EN</button>
            <button type="button">UA</button>
          </div>
          <Link href="/">Privacy Policy</Link>
          <span>·</span>
          <Link href="/">Terms of Service</Link>
        </footer>
      </section>
    </main>
  )
}
