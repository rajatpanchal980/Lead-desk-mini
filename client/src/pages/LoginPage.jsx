import { useState } from 'react'
import api from '../services/api'
import './LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await api.post('/auth/login', { email, password })
      window.location.assign('/admin')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <a className="brand" href="/" aria-label="Lead Desk Mini home">
          <span className="brand-mark" aria-hidden="true">L</span>
          <span>Lead Desk</span>
        </a>
        <p className="eyebrow">Administrator access</p>
        <h1 id="login-title">Welcome back</h1>
        <p className="login-copy">Sign in to manage incoming leads and their status.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
