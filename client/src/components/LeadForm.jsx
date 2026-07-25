import { useState } from 'react'
import api from '../services/api'
import FormField from './FormField'
import './LeadForm.css'

const initialFormValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
}

function LeadForm() {
  const [formValues, setFormValues] = useState(initialFormValues)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await api.post('/leads', formValues)
      setFormValues(initialFormValues)
      window.alert('Lead submitted successfully.')
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to submit your inquiry. Please try again.'
      window.alert(message)
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <h2>Share your details</h2>
        <p>Fields marked with an asterisk are required.</p>
      </div>

      <div className="form-grid">
        <FormField
          label="Full Name"
          name="name"
          placeholder="Jane Smith"
          value={formValues.name}
          onChange={handleChange}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="jane@company.com"
          value={formValues.email}
          onChange={handleChange}
          required
        />
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          placeholder="(555) 000-0000"
          value={formValues.phone}
          onChange={handleChange}
          required
        />
        <FormField
          label="Company"
          name="company"
          placeholder="Company name"
          value={formValues.company}
          onChange={handleChange}
        />
      </div>

      <FormField
        label="Message"
        name="message"
        placeholder="How can we help?"
        value={formValues.message}
        onChange={handleChange}
        multiline
      />

      <button className="submit-button" type="submit">
        Send inquiry
        <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}

export default LeadForm
