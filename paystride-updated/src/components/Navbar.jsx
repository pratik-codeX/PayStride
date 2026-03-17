import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ChangePasswordModal from './ChangePasswordModal'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/workers', label: 'Workers', icon: '👥' },
  { to: '/hours', label: 'Hours', icon: '⏱' },
  { to: '/payroll', label: 'Payroll', icon: '💰' },
  { to: '/requests', label: 'Requests', icon: '📋' },
]

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  if (!isAuthenticated) return null

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/dashboard" className={styles.logo}>
            <div className={styles.logoIcon}>P</div>
            <span className={styles.logoText}>PayStride</span>
          </Link>

          {/* Nav links */}
          <div className={styles.links}>
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.linkIcon}>{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className={styles.right}>
            <div style={{ position: 'relative' }}>
              <div
                className={styles.userInfo}
                onClick={() => setShowUserMenu(m => !m)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.avatar}>{initials}</div>
                <div className={styles.userText}>
                  <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
                  <span className={styles.userRole}>{user?.companyName}</span>
                </div>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 4 }}>▼</span>
              </div>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: 180,
                  zIndex: 200,
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => { setShowChangePassword(true); setShowUserMenu(false) }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontSize: 13,
                      color: 'var(--text)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    🔒 Change password
                  </button>
                  <div style={{ height: 1, background: 'var(--border)' }} />
                  <button
                    onClick={logout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontSize: 13,
                      color: 'var(--danger)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    🚪 Sign out
                  </button>
                </div>
              )}
            </div>

            <button className={styles.menuBtn} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className={styles.mobileMenu}>
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span>{link.icon}</span> {link.label}
              </NavLink>
            ))}
            <button
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: '12px 20px',
                fontSize: 14,
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              onClick={() => { setShowChangePassword(true); setMobileOpen(false) }}
            >
              🔒 Change password
            </button>
            <button className={`btn btn-ghost ${styles.mobileLogout}`} onClick={logout}>Sign Out</button>
          </div>
        )}
      </nav>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} isWorker={false} />
      )}
    </>
  )
}
