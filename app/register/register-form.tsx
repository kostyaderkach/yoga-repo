'use client'

import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  return (
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
          <input
            name="password"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            className="passwordToggle"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        </span>
      </label>

      <label className="termsLine">
        <input name="terms" type="checkbox" />
        <span>
          I agree to Asana <Link href="/">Terms & Conditions.</Link>
        </span>
      </label>
    </form>
  )
}
