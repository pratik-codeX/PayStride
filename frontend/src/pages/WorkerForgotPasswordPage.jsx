import { Link } from 'react-router-dom'
import styles from './AuthPage.module.css'

const features = [
  { icon: '👨‍💼', title: 'Admin-controlled security', desc: 'Worker passwords can only be changed by company admin or HR' },
  { icon: '📱', title: 'Default reset path', desc: 'Admins can reset your password back to your registered phone number' },
  { icon: '⚡', title: 'Fast access recovery', desc: 'Contact your company admin to regain access quickly' },
]

export default function WorkerForgotPasswordPage() {
  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>W</div>
          <span className={styles.logoText}>Worker Portal</span>
        </Link>
        <h2 className={styles.panelTitle}>
          Worker passwords are<br /><span className={styles.panelGold}>managed by admin</span>
        </h2>
        <p className={styles.panelSubtext}>
          For security, workers cannot reset or change passwords themselves. Your company admin or HR can update it for you.
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
          <h1 className={styles.formTitle}>Contact your admin</h1>
          <p className={styles.formSubtitle}>
            Ask your admin or HR to reset your password. They can reset it to your registered phone number from the workers page.
          </p>

          <div
            style={{
              padding: '20px',
              borderRadius: 18,
              background: 'rgba(232,184,36,0.08)',
              border: '1px solid rgba(232,184,36,0.2)',
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.7,
            }}
          >
            <p style={{ margin: 0, marginBottom: 10 }}>
              Tell your admin these details so they can identify your account quickly:
            </p>
            <p style={{ margin: 0 }}>1. Your Worker ID</p>
            <p style={{ margin: '4px 0 0' }}>2. Your full name</p>
            <p style={{ margin: '4px 0 0' }}>3. Your registered phone number</p>
          </div>

          <p className={styles.switchText}>
            Ready to sign in?{' '}
            <Link to="/worker-login" className={styles.switchLink}>
              Back to worker login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
