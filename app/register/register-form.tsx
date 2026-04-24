'use client'

import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function RegisterForm() {
  const supabase = createSupabaseBrowserClient()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!acceptedTerms) {
      setError('Please accept Terms & Conditions.')
      return
    }

    setIsLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo:
          typeof window === 'undefined' ? undefined : `${window.location.origin}/login`,
      },
    })

    setIsLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setMessage('Account created. Check your email to confirm registration.')
  }

  return (
    <form className="signupForm" id="signup-form" onSubmit={handleSubmit}>
      <label>
        Name
        <span className="signupField">
          <UserRound size={22} />
          <input
            name="name"
            placeholder="Name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </span>
      </label>

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
            minLength={6}
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
        <input
          checked={acceptedTerms}
          name="terms"
          type="checkbox"
          onChange={(event) => setAcceptedTerms(event.target.checked)}
        />
        <span>
          I agree to Asana <Link href="/">Terms & Conditions.</Link>
        </span>
      </label>

      {error ? <p className="formMessage errorMessage">{error}</p> : null}
      {message ? <p className="formMessage successMessage">{message}</p> : null}

      <button className="hiddenSubmit" disabled={isLoading} id="signup-submit" type="submit">
        Sign up
      </button>
    </form>
  )
}
