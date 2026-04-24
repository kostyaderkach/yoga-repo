import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RegisterForm from './register-form'

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

        <RegisterForm />

        <p className="inlineSwitch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>

        <div className="bottomAction">
          <button className="primaryPurpleButton" form="signup-form" type="submit">
            Sign up
          </button>
        </div>
      </section>
    </main>
  )
}
