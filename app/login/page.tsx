import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import LoginForm from './login-form'

export default function LoginPage() {
  return (
    <main className="appStage">
      <section className="phoneFrame signupScreen">
        <Link className="backButton" href="/" aria-label="Back">
          <ChevronLeft size={30} strokeWidth={2.2} />
        </Link>

        <div className="signupIntro">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue your wellness journey.</p>
        </div>

        <LoginForm />

        <p className="inlineSwitch">
          Don&apos;t have an account? <Link href="/register">Sign up</Link>
        </p>

        <div className="bottomAction">
          <button className="primaryPurpleButton" form="login-form" type="submit">
            Log in
          </button>
        </div>
      </section>
    </main>
  )
}
