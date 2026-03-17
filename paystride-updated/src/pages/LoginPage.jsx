import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import PasswordField from '../components/PasswordField'
import styles from './AuthPage.module.css'

const features = [
  { icon: '⚡', title: 'Run payroll in minutes', desc: 'Not hours or days' },
  { icon: '👥', title: 'Manage your full team', desc: 'Workers, hours, salaries' },
  { icon: '📊', title: 'Real-time insights', desc: 'Live wage & cost data' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) return
    if (user?.role === 'WORKER') navigate('/worker/dashboard', { replace: true })
    else navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate, user])

  async function handleLogin(e) {
    e.preventDefault()
    if (!email || !password) { toast.error('Please enter email and password'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, userId, companyId, name, role, companyName } = res.data
      login({ userId, companyId, name, role, companyName }, token)
      toast.success(`Welcome back, ${name}!`)
      if (role === 'WORKER') {
        navigate('/worker/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Left branding panel */}
      <div className={styles.leftPanel}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>P</div>
          <span className={styles.logoText}>PayStride</span>
        </Link>
        <h2 className={styles.panelTitle}>
          The smarter way<br />to <span className={styles.panelGold}>pay your team</span>
        </h2>
        <p className={styles.panelSubtext}>
          Join 500+ companies managing payroll with confidence on PayStride.
        </p>
        <div className={styles.featureList}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureItem}>
              <div className={styles.featureItemIcon}>{f.icon}</div>
              <div className={styles.featureItemText}>
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formBox}>
          <Link to="/" className={styles.homeLink}>← Back to home</Link>
          <h1 className={styles.formTitle}>Welcome back</h1>
          <p className={styles.formSubtitle}>Sign in to your PayStride account</p>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className="input-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <PasswordField
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              labelAction={(
                <Link
                  to="/forgot-password"
                  style={{ fontSize: 12, color: 'var(--gold-300)', fontWeight: 400, textDecoration: 'none' }}
                >
                  Forgot password?
                </Link>
              )}
            />
            <button
              type="submit"
              className={`btn btn-gold ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className={styles.switchText}>
            New to PayStride?{' '}
            <Link to="/register" className={styles.switchLink}>Create an account</Link>
          </p>

          {/* Worker Portal button */}
          <div style={{
            marginTop: 24,
            padding: '16px 20px',
            background: 'rgba(5,150,105,0.08)',
            border: '1px solid rgba(5,150,105,0.2)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              Are you a worker?
            </p>
            <Link
              to="/worker-login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: 'rgba(5,150,105,0.15)',
                border: '1px solid rgba(5,150,105,0.35)',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#34d399',
                textDecoration: 'none',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(5,150,105,0.25)'
                e.currentTarget.style.borderColor = 'rgba(5,150,105,0.6)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(5,150,105,0.15)'
                e.currentTarget.style.borderColor = 'rgba(5,150,105,0.35)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Worker Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
