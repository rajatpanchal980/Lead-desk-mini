import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import './AdminDashboard.css'

const statusOptions = ['New', 'Contacted', 'Closed']

function AdminDashboard() {
  const [leads, setLeads] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingLeadId, setUpdatingLeadId] = useState(null)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get('/leads')
        setLeads(response.data.data)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load leads. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const filteredLeads = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return leads
    }

    return leads.filter((lead) =>
      [lead.name, lead.email, lead.phone, lead.company]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    )
  }, [leads, searchQuery])

  const handleStatusChange = async (leadId, status) => {
    setUpdatingLeadId(leadId)
    setError('')

    try {
      const response = await api.patch(`/leads/${leadId}/status`, { status })
      setLeads((currentLeads) =>
        currentLeads.map((lead) => (lead._id === leadId ? response.data.data : lead))
      )
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update the lead status. Please try again.')
    } finally {
      setUpdatingLeadId(null)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      window.location.assign('/login')
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="brand" href="/" aria-label="Lead Desk Mini home">
          <span className="brand-mark" aria-hidden="true">L</span>
          <span>Lead Desk</span>
        </a>
        <div className="admin-actions">
          <a className="admin-back-link" href="/">View lead form</a>
          <button className="logout-button" type="button" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <section className="dashboard" aria-labelledby="dashboard-title">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1 id="dashboard-title">Leads</h1>
            <p>Review incoming inquiries and keep each conversation moving.</p>
          </div>
          <div className="lead-count" aria-label={`${leads.length} total leads`}>
            <strong>{leads.length}</strong>
            <span>Total leads</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="table-toolbar">
            <label className="search-field" htmlFor="lead-search">
              <span className="visually-hidden">Search leads</span>
              <span aria-hidden="true">⌕</span>
              <input
                id="lead-search"
                type="search"
                placeholder="Search name, email, phone, or company"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <span className="result-count">{filteredLeads.length} shown</span>
          </div>

          {error && <p className="dashboard-error" role="alert">{error}</p>}

          {isLoading ? (
            <p className="dashboard-state" role="status">Loading leads…</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Lead</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Company</th>
                    <th scope="col">Received</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td data-label="Lead"><strong>{lead.name}</strong></td>
                      <td data-label="Contact">
                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        <span>{lead.phone}</span>
                      </td>
                      <td data-label="Company">{lead.company || '—'}</td>
                      <td data-label="Received">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td data-label="Status">
                        <select
                          className={`status-select status-${lead.status.toLowerCase()}`}
                          value={lead.status}
                          onChange={(event) => handleStatusChange(lead._id, event.target.value)}
                          disabled={updatingLeadId === lead._id}
                          aria-label={`Update status for ${lead.name}`}
                        >
                          {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredLeads.length && <p className="dashboard-state">No leads match your search.</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default AdminDashboard
