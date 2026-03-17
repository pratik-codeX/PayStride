import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import PasswordField from '../components/PasswordField'
import styles from './AuthPage.module.css'

const features = [
  { icon: '⏱', title: 'Track your attendance', desc: 'See logged hours for every workday' },
  { icon: '📄', title: 'Download payslips', desc: 'Access salary slips whenever you need them' },
  { icon: '📝', title: 'Request support', desc: 'Submit advance and leave requests in one place' },
]

export default function WorkerLoginPage() {
  const [workerCode, setWorkerCode] = useState('')
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
    if (!workerCode || !password) {
      toast.error('Enter your Worker ID and password')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/worker/login', { workerCode, password })
      const { token, workerId, companyId, name, role, department, workerCode: wc } = res.data
      login({ workerId, companyId, name, role, department, workerCode: wc }, token)
      toast.success('Welcome, ' + name + '!')
      navigate('/worker/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid Worker ID or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>W</div>
          <span className={styles.logoText}>Worker Portal</span>
        </Link>
        <h2 className={styles.panelTitle}>
          Your workspace for<br />attendance and <span className={styles.panelGold}>payslips</span>
        </h2>
        <p className={styles.panelSubtext}>
          Sign in to view work hours, download salary slips, and submit leave or advance requests from one place.
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
          <h1 className={styles.formTitle}>Worker sign in</h1>
          <p className={styles.formSubtitle}>Use your Worker ID and password to access your dashboard</p>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className="input-group">
              <label>Worker ID</label>
              <input
                placeholder="WRK001"
                value={workerCode}
                onChange={e => setWorkerCode(e.target.value.toUpperCase())}
                autoComplete="username"
                style={{ fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }}
              />
            </div>
            <PasswordField
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your phone number or given password"
              autoComplete="current-password"
              labelAction={(
                <Link
                  to="/worker-forgot-password"
                  style={{ fontSize: 12, color: 'var(--gold-300)', fontWeight: 400, textDecoration: 'none' }}
                >
                  Password help
                </Link>
              )}
            />
            <button
              type="submit"
              className={`btn btn-gold ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In As Worker →'}
            </button>
          </form>

          <p className={styles.switchText}>
            HR or Admin?{' '}
            <Link to="/login" className={styles.switchLink}>
              Sign in here
            </Link>
          </p>

          <div
            style={{
              marginTop: 24,
              padding: '16px 20px',
              background: 'rgba(232,184,36,0.08)',
              border: '1px solid rgba(232,184,36,0.18)',
              borderRadius: 12,
              fontSize: 13,
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: 'var(--gold-300)' }}>Default password:</strong> your registered phone number.
            <br />
            If you need a reset later, contact your admin or HR.
          </div>
        </div>
      </div>
    </div>
  )
}
