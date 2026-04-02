// components/Footer.jsx
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main footer content */}
        <div className={styles.mainContent}>
          {/* Brand section */}
          <div className={styles.brandSection}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>P</span>
              <span className={styles.logoText}>PayStride</span>
            </div>
            <p className={styles.tagline}>
              Enterprise-grade payroll management for modern workforce
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.099 2.646.64.698 1.03 1.591 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className={styles.linksSection}>
            <h4 className={styles.linkTitle}>Product</h4>
            <ul className={styles.linkList}>
              <li><Link to="/login">Admin Sign In</Link></li>
              <li><Link to="/worker-login">Worker Sign In</Link></li>
              <li><a href="/#features">Features</a></li>
              <li><a href="/#about">About</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>

          {/* About section - with developer credits */}
          <div className={styles.aboutSection}>
            <h4 className={styles.linkTitle}>About the project</h4>
            <div className={styles.creditCard}>
              <div className={styles.developer}>
                <span className={styles.devIcon}>⚙️</span>
                <div>
                  <p className={styles.devName}>Pratik Raut</p>
                  <p className={styles.devRole}>Backend Developer</p>
                  <p className={styles.devStack}>Spring Boot · PostgreSQL · JWT · REST APIs</p>
                </div>
              </div>
              <div className={styles.developer}>
                <span className={styles.devIcon}>🎨</span>
                <div>
                  <p className={styles.devName}>Pratiksha Pare</p>
                  <p className={styles.devRole}>Frontend Developer</p>
                  <p className={styles.devStack}>React · CSS Modules · Recharts · Context API</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech stack */}
          <div className={styles.stackSection}>
            <h4 className={styles.linkTitle}>Tech Stack</h4>
            <div className={styles.stackTags}>
              <span className={styles.stackTag}>React 18</span>
              <span className={styles.stackTag}>Vite</span>
              <span className={styles.stackTag}>CSS Modules</span>
              <span className={styles.stackTag}>Recharts</span>
              <span className={styles.stackTag}>Spring Boot</span>
              <span className={styles.stackTag}>MySQL</span>
              <span className={styles.stackTag}>JWT Auth</span>
              <span className={styles.stackTag}>REST API</span>
              <span className={styles.stackTag}>jsPDF</span>
              <span className={styles.stackTag}>WhatsApp API</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} PayStride. All rights reserved.
          </p>
          <p className={styles.credit}>
            Built with <span className={styles.heart}>❤️</span> by{' '}
            <strong>Pratik Raut (Backend)</strong> and{' '}
            <strong>Pratiksha Pare (Frontend)</strong>
          </p>
          <p className={styles.education}>
            MCA 2025 · DIMR Balewadi, Pune
          </p>
        </div>
      </div>
    </footer>
  )
}
