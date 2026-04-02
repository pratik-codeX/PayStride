import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import PasswordField from '../components/PasswordField'
import styles from './AuthPage.module.css'

const features = [
  { icon: '🚀', title: 'Setup in 5 minutes', desc: 'No complex onboarding' },
  { icon: '💼', title: 'Multi-department support', desc: 'Organize any workforce' },
  { icon: '🔒', title: 'Enterprise-grade security', desc: 'Your data stays safe' },
]

export default function RegisterPage() {
  const [form, setForm] = useState({
    companyName: '', companyCity: '', companyEmail: '',
    companyContact: '', adminName: '', adminEmail: '', adminPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  function validateForm() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const contactRegex = /^[6-9]\d{9}$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
    const nameRegex = /^[A-Za-z][A-Za-z .'-]*$/

    if (!form.companyName.trim() || !form.adminEmail.trim() || !form.adminPassword || !form.adminName.trim() || !form.companyContact.trim()) {
      return 'Please fill all required fields'
    }
    if (form.companyEmail && !emailRegex.test(form.companyEmail.trim())) {
      return 'Enter a valid company email address'
    }
    if (!emailRegex.test(form.adminEmail.trim())) {
      return 'Enter a valid admin email address'
    }
    if (!contactRegex.test(form.companyContact.trim())) {
      return 'Enter a valid 10-digit contact number'
    }
    if (!nameRegex.test(form.adminName.trim())) {
      return 'Enter a valid admin name'
    }
    if (!passwordRegex.test(form.adminPassword)) {
      return 'Password must be 8+ chars with uppercase, lowercase, number, and special character'
    }
    return null
  }

  async function handleRegister(e) {
    e.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      toast.error(validationError)
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        companyName: form.companyName.trim(),
        companyCity: form.companyCity.trim(),
        companyEmail: form.companyEmail.trim(),
        companyContact: form.companyContact.trim(),
        adminName: form.adminName.trim(),
        adminEmail: form.adminEmail.trim(),
      }
      const res = await api.post('/auth/register', payload)
      const { token, userId, companyId, name, role, companyName } = res.data
      login({ userId, companyId, name, role, companyName }, token)
      toast.success('Company registered! Welcome to PayStride.')
      navigate('/dashboard')
    } catch (err) {
      const fieldErrors = err.response?.data?.fields
      if (fieldErrors) {
        const firstError = Object.values(fieldErrors)[0]
        toast.error(firstError)
      } else {
        toast.error(err.response?.data?.error || 'Registration failed')
      }
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
          Start managing<br /><span className={styles.panelGold}>payroll today</span>
        </h2>
        <p className={styles.panelSubtext}>
          Register your company and have your first payroll ready in minutes — not days.
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
          <h1 className={styles.formTitle}>Create your account</h1>
          <p className={styles.formSubtitle}>Set up your company on PayStride</p>

          <form onSubmit={handleRegister} className={styles.form}>
            <p className="section-title" style={{color:'rgba(255,255,255,0.35)', marginBottom:'10px'}}>Company Details</p>
            <div className={styles.formRow}>
              <div className="input-group">
                <label>Company name *</label>
                <input placeholder="Sharma Constructions" value={form.companyName} onChange={set('companyName')} />
              </div>
              <div className="input-group">
                <label>City</label>
                <input placeholder="Pune" value={form.companyCity} onChange={set('companyCity')} />
              </div>
            </div>
            <div className="input-group">
              <label>Company email</label>
              <input type="email" placeholder="info@company.com" value={form.companyEmail} onChange={set('companyEmail')} />
            </div>
            <div className="input-group">
              <label>Contact number *</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={form.companyContact}
                onChange={e => setForm(prev => ({ ...prev, companyContact: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
              />
            </div>

            <p className="section-title" style={{color:'rgba(255,255,255,0.35)', marginBottom:'10px', marginTop:'4px'}}>Admin Account</p>
            <div className={styles.formRow}>
              <div className="input-group">
                <label>Your name *</label>
                <input placeholder="Pratik Raut" value={form.adminName} onChange={set('adminName')} />
              </div>
              <div className="input-group">
                <label>Your email *</label>
                <input type="email" placeholder="you@company.com" value={form.adminEmail} onChange={set('adminEmail')} />
              </div>
            </div>
            <PasswordField
              label="Password *"
              value={form.adminPassword}
              onChange={set('adminPassword')}
              placeholder="Min 8 chars with Aa1!"
              autoComplete="new-password"
              hint="Use at least 8 characters with uppercase, lowercase, number, and special character."
            />

            <button type="submit" className={`btn btn-gold ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
