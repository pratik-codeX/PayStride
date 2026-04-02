import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import PasswordField from '../components/PasswordField'
import styles from './AuthPage.module.css'

const features = [
  { icon: '🔐', title: 'Secure reset flow', desc: 'Update your password in two simple steps' },
  { icon: '📧', title: 'Company email based', desc: 'Reset access using your registered work email' },
  { icon: '⚡', title: 'Back to payroll fast', desc: 'Get back to your dashboard without delays' },
]

const STRONG_PASSWORD_MESSAGE = 'Password must be 8+ chars with uppercase, lowercase, number, and special character'
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

function StepDots({ step, activeColor }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
      {[1, 2].map(s => (
        <div
          key={s}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: step >= s ? activeColor : '#334155',
            color: step >= s ? 'white' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            transition: 'all 0.2s',
          }}
        >
          {s}
        </div>
      ))}
    </div>
  )
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleReset(e) {
    e.preventDefault()
    if (!email.trim()) { toast.error('Enter your email address'); return }
    if (step === 1) { setStep(2); return }
    if (!strongPasswordRegex.test(newPassword)) { toast.error(STRONG_PASSWORD_MESSAGE); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email, newPassword })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed. Check your email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>P</div>
          <span className={styles.logoText}>PayStride</span>
        </Link>
        <h2 className={styles.panelTitle}>
          Reset your access<br />with <span className={styles.panelGold}>confidence</span>
        </h2>
        <p className={styles.panelSubtext}>
          Recover your admin account securely so you can get back to managing workers, hours, and payroll.
        </p>
        <div className={styles.featureList}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <div className={styles.featureItemIcon}>{feature.icon}</div>
              <div className={styles.featureItemText}>
                <strong>{feature.title}</strong>
                <span>{feature.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formBox}>
          <Link to="/" className={styles.homeLink}>← Back to home</Link>
          <h1 className={styles.formTitle}>Forgot password</h1>
          <p className={styles.formSubtitle}>Complete the steps below to create a new password</p>

          <StepDots step={step} activeColor="var(--gold-500)" />

          <form onSubmit={handleReset} className={styles.form}>
            {step === 1 && (
              <>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.58)', marginBottom: 16, textAlign: 'center' }}>
                  Enter your registered email address
                </p>
                <div className="input-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>
                <button type="submit" className={`btn btn-gold ${styles.submitBtn}`}>
                  Continue →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.58)', marginBottom: 16, textAlign: 'center' }}>
                  Set your new password for <strong style={{ color: 'white' }}>{email}</strong>
                </p>
                <PasswordField
                  label="New password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars with Aa1!"
                  autoComplete="new-password"
                  autoFocus
                  hint={STRONG_PASSWORD_MESSAGE}
                />
                <PasswordField
                  label="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
                <button
                  type="submit"
                  className={`btn btn-gold ${styles.submitBtn}`}
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset password'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: 13,
                    cursor: 'pointer',
                    marginTop: 8,
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  ← Back
                </button>
              </>
            )}
          </form>

          <p className={styles.switchText}>
            Remember it?{' '}
            <Link to="/login" className={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
