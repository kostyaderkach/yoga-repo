import Link from 'next/link'
import { ArrowLeft, Check, EyeOff } from 'lucide-react'

export default function LoginPage() {
  return (
    <main className="screenStage">
      <section className="phoneFrame authScreen">
        <div className="statusBar">
          <span>9:41</span>
          <span>●●●</span>
        </div>

        <Link className="backButton" href="/" aria-label="Back">
          <ArrowLeft size={24} />
        </Link>

        <div className="authIntro">
          <h1>WELCOME TO YOGA SPACE!</h1>
          <p>Hello there, sign in to continue.</p>
        </div>

        <form className="appForm">
          <label>
            Email address
            <span className="fieldBox">
              <input defaultValue="student@yoga.local" type="email" />
              <Check size={22} />
            </span>
          </label>

          <label>
            Password
            <span className="fieldBox">
              <input defaultValue="password" type="password" />
              <EyeOff size={21} />
            </span>
          </label>

          <Link className="forgotLink" href="/register">
            Forgot Password?
          </Link>

          <button className="limeButton" type="button">
            LOGIN
          </button>
        </form>

        <p className="authSwitch">
          Don’t have an account? <Link href="/register">Register!</Link>
        </p>
      </section>
    </main>
  )
}
