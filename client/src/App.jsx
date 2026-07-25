import { useEffect, useState } from 'react'
import LeadForm from './components/LeadForm'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import api from './services/api'
import './App.css'

function ProtectedAdmin() {
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        await api.get('/auth/session')
        setIsCheckingSession(false)
      } catch {
        window.location.replace('/login')
      }
    }

    checkSession()
  }, [])

  if (isCheckingSession) {
    return null
  }

  return <AdminDashboard />
}

function App() {
  if (window.location.pathname === '/login') {
    return <LoginPage />
  }

  if (window.location.pathname === '/admin') {
    return <ProtectedAdmin />
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Lead Desk Mini home">
          <span className="brand-mark" aria-hidden="true">L</span>
          <span>Lead Desk</span>
        </a>
        <span className="topbar-label">New lead</span>
      </header>

      <section className="lead-page" aria-labelledby="lead-form-title">
        <div className="intro-panel">
          <p className="eyebrow">Lead Desk Mini</p>
          <h1 id="lead-form-title">Start a conversation that matters.</h1>
          <p className="intro-copy">
            Tell us a little about your needs and our team will be in touch soon.
          </p>

          <div className="response-note">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <strong>Quick response time</strong>
              <p>We typically respond within one business day.</p>
            </div>
          </div>
        </div>

        <LeadForm />
      </section>
    </main>
  )
}

export default App
