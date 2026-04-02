import { useState } from 'react'

export default function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  autoFocus = false,
  name,
  id,
  hint,
  labelAction,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="input-group">
      <label
        htmlFor={inputId}
        style={labelAction ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 } : undefined}
      >
        <span>{label}</span>
        {labelAction}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={inputId}
          name={name}
          type={isVisible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          style={{ paddingRight: 88 }}
        />
        <button
          type="button"
          onClick={() => setIsVisible(visible => !visible)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.82)',
            borderRadius: 10,
            padding: '6px 10px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {isVisible ? 'Hide' : 'View'}
        </button>
      </div>
      {hint ? (
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
