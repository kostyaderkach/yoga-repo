import Link from 'next/link'
import { ArrowLeft, EyeOff, Lock, Mail, UserRound } from 'lucide-react'

export default function RegisterPage() {
  return (
    <main className="appStage">
      <section className="phoneFrame signupScreen">
        <Link className="backButton" href="/" aria-label="Back">
          <ArrowLeft size={28} strokeWidth={2.4} />
        </Link>

        <div className="signupIntro">
          <h1>Join Asana Today</h1>
          <p>Start your personalized wellness experience.</p>
        </div>

        <form className="signupForm">
          <label>
            Name
            <span className="signupField">
              <UserRound size={22} />
              <input name="name" placeholder="Name" />
            </span>
          </label>

          <label>
            Email
            <span className="signupField">
              <Mail size={22} />
              <input name="email" placeholder="Email" type="email" />
            </span>
          </label>

          <label>
            Password
            <span className="signupField">
              <Lock size={22} />
              <input name="password" placeholder="Password" type="password" />
              <EyeOff size={22} />
            </span>
          </label>

          <label className="termsLine">
            <input name="terms" type="checkbox" />
            <span>
              I agree to Asana <Link href="/">Terms & Conditions.</Link>
            </span>
          </label>
        </form>

        <p className="inlineSwitch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>

        <div className="bottomAction">
          <button className="primaryPurpleButton" type="button">
            Sign up
          </button>
        </div>
      </section>
    </main>
  )
}
