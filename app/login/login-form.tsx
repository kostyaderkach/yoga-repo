'use client'

import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push('/app')
  }

  return (
    <form className="signupForm" id="login-form" onSubmit={handleSubmit}>
      <label>
        Email
        <span className="signupField">
          <Mail size={22} />
          <input
            name="email"
            placeholder="Email"
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </span>
      </label>

      <label>
        Password
        <span className="signupField">
          <Lock size={22} />
          <input
            name="password"
            placeholder="Password"
            required
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

      <div className="loginOptions">
        <label className="rememberLine">
          <input name="remember" type="checkbox" />
          <span>Remember me</span>
        </label>
        <Link href="/">Forgot Password?</Link>
      </div>

      {error ? <p className="formMessage errorMessage">{error}</p> : null}

      <button className="hiddenSubmit" disabled={isLoading} type="submit">
        Log in
      </button>
    </form>
  )
}
