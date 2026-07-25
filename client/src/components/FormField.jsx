function FormField({ label, name, type = 'text', placeholder, value, onChange, required, multiline = false }) {
  const inputProps = {
    id: name,
    name,
    value,
    onChange,
    placeholder,
    required,
  }

  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {multiline ? (
        <textarea {...inputProps} rows="5" />
      ) : (
        <input {...inputProps} type={type} />
      )}
    </div>
  )
}

export default FormField
