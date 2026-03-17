import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './HomePage.module.css'

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const features = [
    { icon: '👥', title: 'Employee Management', desc: 'Manage your entire workforce from one place. Add, edit, and track all workers effortlessly.' },
    { icon: '⏱', title: 'Hours Tracking', desc: 'Log attendance and hours in real time with smart daily and monthly summaries.' },
    { icon: '💰', title: 'Payroll Processing', desc: 'Run accurate payroll in seconds. Automated calculations for every employee.' },
    { icon: '📄', title: 'Payslip Generation', desc: 'Instant digital payslips with full breakdowns, ready to share or download.' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time financial insights into wage liability, headcount, and more.' },
    { icon: '🔒', title: 'Secure & Reliable', desc: 'Bank-grade security with end-to-end encryption. Your data stays yours.' },
  ]

  const stats = [
    { value: '10,000+', label: 'Employees Managed' },
    { value: '500+', label: 'Companies Onboarded' },
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '₹50Cr+', label: 'Payroll Processed' },
  ]

  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>P</div>
            <span className={styles.logoText}>PayStride</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#about" className={styles.navLink}>About</a>
            <a href="#contact" className={styles.navLink}>Contact</a>
          </div>
          <div className={styles.navActions}>
            {isAuthenticated ? (
              <button
                className="btn btn-gold"
                onClick={() => navigate(user?.role === 'WORKER' ? '/worker/dashboard' : '/dashboard')}
              >
                Dashboard →
              </button>
            ) : (
              <>
                <Link to="/login" className={styles.loginLink}>Sign In</Link>
                <Link to="/register" className="btn btn-gold">Get Started</Link>
              </>
            )}
          </div>
          <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#features" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#about" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Contact</a>
            <Link to="/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/register" className={`btn btn-gold ${styles.mobileBtn}`} onClick={() => setMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroBgGrid}></div>
          <div className={styles.heroOrb1}></div>
          <div className={styles.heroOrb2}></div>
          <div className={styles.heroOrb3}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot}></span>
            Trusted by 500+ companies across India
          </div>
          <h1 className={styles.heroTitle}>
            Payroll,<br />
            <span className={styles.heroTitleGold}>Simplified.</span>
          </h1>
          <p className={styles.heroDesc}>
            PayStride is the modern payroll platform built for Indian businesses.
            Manage workers, track hours, and run payroll in minutes — not days.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/register" className="btn btn-gold">
              Start Free Today →
            </Link>
            <a href="#features" className={`btn ${styles.heroOutlineBtn}`}>
              See How It Works
            </a>
          </div>
          <div className={styles.heroStats}>
            {stats.map(s => (
              <div key={s.label} className={styles.heroStat}>
                <span className={styles.heroStatVal}>{s.value}</span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.heroDashPreview}>
          <div className={styles.dashCard}>
            <div className={styles.dashCardHeader}>
              <div className={styles.dashDot} style={{background:'#ef4444'}}></div>
              <div className={styles.dashDot} style={{background:'#f59e0b'}}></div>
              <div className={styles.dashDot} style={{background:'#10b981'}}></div>
              <span className={styles.dashCardTitle}>PayStride Dashboard</span>
            </div>
            <div className={styles.dashMiniStats}>
              <div className={styles.dashMiniStat}>
                <span className={styles.dashMiniIcon}>👷</span>
                <span className={styles.dashMiniVal}>124</span>
                <span className={styles.dashMiniLbl}>Workers</span>
              </div>
              <div className={styles.dashMiniStat}>
                <span className={styles.dashMiniIcon}>⏱</span>
                <span className={styles.dashMiniVal}>4,820</span>
                <span className={styles.dashMiniLbl}>Hours</span>
              </div>
              <div className={styles.dashMiniStat}>
                <span className={styles.dashMiniIcon}>₹</span>
                <span className={styles.dashMiniVal}>12.4L</span>
                <span className={styles.dashMiniLbl}>Payroll</span>
              </div>
            </div>
            <div className={styles.dashChart}>
              {[60,80,45,90,70,85,65,95,75,88].map((h,i) => (
                <div key={i} className={styles.dashBar} style={{height:`${h}%`}}></div>
              ))}
            </div>
            <div className={styles.dashStatus}>
              <div className={styles.dashStatusDot}></div>
              <span>Payroll processed for March 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionLabel}>Features</div>
          <h2 className={styles.sectionTitle}>Everything you need<br />to run payroll with confidence</h2>
          <p className={styles.sectionDesc}>From onboarding to payslips, PayStride handles every step of the payroll process so you can focus on growing your business.</p>
          <div className={styles.featureGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureCard} style={{animationDelay:`${i*0.08}s`}}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className={styles.about}>
        <div className={styles.sectionContainer}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <div className={styles.sectionLabel}>About Us</div>
              <h2 className={styles.sectionTitle}>Built for Indian businesses,<br />by people who get it</h2>
              <p className={styles.aboutText}>
                PayStride was born from a simple frustration: existing payroll tools were either too complex, too expensive, or built for foreign markets. We set out to build something different.
              </p>
              <p className={styles.aboutText}>
                Our team of payroll and engineering experts has built a platform that handles the unique complexities of Indian payroll — from regional compliance to multi-department workforce management — while keeping the experience beautifully simple.
              </p>
              <div className={styles.aboutValues}>
                <div className={styles.aboutValue}>
                  <div className={styles.aboutValueIcon}>⚡</div>
                  <div>
                    <strong>Speed First</strong>
                    <p>Run payroll in under 2 minutes, every time.</p>
                  </div>
                </div>
                <div className={styles.aboutValue}>
                  <div className={styles.aboutValueIcon}>🎯</div>
                  <div>
                    <strong>Zero Errors</strong>
                    <p>Automated calculations eliminate human mistakes.</p>
                  </div>
                </div>
                <div className={styles.aboutValue}>
                  <div className={styles.aboutValueIcon}>💬</div>
                  <div>
                    <strong>Real Support</strong>
                    <p>Dedicated team available whenever you need help.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.aboutVisual}>
              <div className={styles.aboutCard}>
                <div className={styles.aboutCardHeader}>Our Mission</div>
                <p className={styles.aboutCardText}>
                  "To make payroll the least stressful part of running a business — giving every employer the tools to pay their people accurately, on time, every time."
                </p>
                <div className={styles.aboutTeam}>
                  {['A','B','C','D'].map((l,i) => (
                    <div key={i} className={styles.aboutAvatar} style={{marginLeft: i>0?'-10px':'0'}}>{l}</div>
                  ))}
                  <span className={styles.aboutTeamText}>The PayStride Team</span>
                </div>
              </div>
              <div className={styles.aboutStatsGrid}>
                {stats.map(s => (
                  <div key={s.label} className={styles.aboutStatCard}>
                    <span className={styles.aboutStatVal}>{s.value}</span>
                    <span className={styles.aboutStatLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={styles.contact}>
        <div className={styles.sectionContainer}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.sectionLabel}>Contact Us</div>
              <h2 className={styles.sectionTitle}>Let's talk payroll</h2>
              <p className={styles.contactDesc}>Have questions? Want a demo? Our team is ready to help you get started with PayStride.</p>
              <div className={styles.contactDetails}>
                <div className={styles.contactDetail}>
                  <span className={styles.contactDetailIcon}>📧</span>
                  <div>
                    <strong>Email</strong>
                    <p>hello@paystride.in</p>
                  </div>
                </div>
                <div className={styles.contactDetail}>
                  <span className={styles.contactDetailIcon}>📞</span>
                  <div>
                    <strong>Phone</strong>
                    <p>+91 98765 43210</p>
                  </div>
                </div>
                <div className={styles.contactDetail}>
                  <span className={styles.contactDetailIcon}>📍</span>
                  <div>
                    <strong>Office</strong>
                    <p>Pune, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerInner}>
          <h2 className={styles.ctaBannerTitle}>Ready to transform your payroll?</h2>
          <p className={styles.ctaBannerDesc}>Join 500+ companies already using PayStride to pay their teams with confidence.</p>
          <div className={styles.ctaBannerBtns}>
            <Link to="/register" className="btn btn-gold">Get Started Free</Link>
            <Link to="/login" className={`btn ${styles.ctaOutlineBtn}`}>Sign In</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <div className={styles.logoIcon}>P</div>
            <span className={styles.logoText}>PayStride</span>
          </div>
          <p className={styles.footerText}>© 2025 PayStride. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 1200)
  }

  if (sent) {
    return (
      <div className={styles.contactFormSuccess}>
        <div className={styles.successIcon}>✓</div>
        <h3>Message sent!</h3>
        <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
      </div>
    )
  }

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Your name</label>
        <input name="name" placeholder="Ravi Kumar" value={form.name} onChange={handleChange} required />
      </div>
      <div className="input-group">
        <label>Email address</label>
        <input name="email" type="email" placeholder="ravi@company.com" value={form.email} onChange={handleChange} required />
      </div>
      <div className="input-group">
        <label>Message</label>
        <textarea name="message" rows={4} placeholder="Tell us about your company and payroll needs..." value={form.message} onChange={handleChange} required style={{resize:'vertical'}} />
      </div>
      <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', padding:'12px'}} disabled={loading}>
        {loading ? 'Sending...' : 'Send Message →'}
      </button>
    </form>
  )
}
