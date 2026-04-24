import Link from 'next/link'
import { ArrowLeft, Check, EyeOff } from 'lucide-react'

export default function RegisterPage() {
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
          <h1>CREATE ACCOUNT</h1>
          <p>Please enter your details to proceed.</p>
        </div>

        <form className="appForm">
          <label>
            Full Name
            <span className="fieldBox">
              <input defaultValue="Sophia Green" />
              <Check size={22} />
            </span>
          </label>

          <label>
            Phone
            <span className="fieldBox">
              <input defaultValue="+41 79 000 00 00" />
            </span>
          </label>

          <label>
            Email address
            <span className="fieldBox">
              <input defaultValue="student@yoga.local" type="email" />
            </span>
          </label>

          <label>
            Password
            <span className="fieldBox">
              <input defaultValue="password" type="password" />
              <EyeOff size={21} />
            </span>
          </label>

          <button className="limeButton" type="button">
            CREATE ACCOUNT
          </button>
        </form>

        <p className="authSwitch">
          Already have an account? <Link href="/login">Login!</Link>
        </p>
      </section>
    </main>
  )
}
