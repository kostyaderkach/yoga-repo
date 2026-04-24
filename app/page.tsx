import Link from 'next/link'

const providers = [
  { name: 'Google', mark: 'G', className: 'googleMark' },
  { name: 'Apple', mark: '', className: 'appleMark' },
  { name: 'Facebook', mark: 'f', className: 'facebookMark' },
  { name: 'Twitter', mark: 't', className: 'twitterMark' },
]

function LotusMark() {
  return (
    <svg className="lotusMark" viewBox="0 0 164 116" aria-hidden="true">
      <path d="M82 12C61 31 53 56 62 84C76 77 86 58 82 12Z" />
      <path d="M53 43C35 42 22 48 14 62C26 78 44 88 68 90C62 75 57 59 53 43Z" />
      <path d="M111 43C129 42 142 48 150 62C138 78 120 88 96 90C102 75 107 59 111 43Z" />
      <path d="M32 77C21 78 13 82 8 90C22 101 41 106 65 102C54 94 43 86 32 77Z" />
      <path d="M132 77C143 78 151 82 156 90C142 101 123 106 99 102C110 94 121 86 132 77Z" />
      <path d="M62 84C69 96 76 103 82 106C88 103 95 96 102 84" />
    </svg>
  )
}

export default function WelcomePage() {
  return (
    <main className="appStage">
      <section className="welcomeScreen">
        <div className="welcomeHero">
          <LotusMark />
          <h1>Let&apos;s Get Started!</h1>
          <p>Let&apos;s dive in into your account</p>
        </div>

        <div className="socialStack" aria-label="Social sign in options">
          {providers.map((provider) => (
            <button className="socialButton" key={provider.name} type="button">
              <span className={provider.className}>{provider.mark}</span>
              Continue with {provider.name}
            </button>
          ))}
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
          <Link href="/">Privacy Policy</Link>
          <span>·</span>
          <Link href="/">Terms of Service</Link>
        </footer>
      </section>
    </main>
  )
}
