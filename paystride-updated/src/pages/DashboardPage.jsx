import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { formatCurrency, formatHours } from '../utils/format'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/analytics')])
      .then(([dashboardRes, analyticsRes]) => {
        setStats(dashboardRes.data)
        setAnalytics(analyticsRes.data)
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    {
      label: 'Total Workers',
      value: stats.totalWorkers,
      icon: '👷',
      color: 'blue',
      change: '+3 this month',
      changeUp: true,
    },
    {
      label: 'Hours This Month',
      value: formatHours(stats.totalHoursThisMonth),
      icon: '⏱',
      color: 'gold',
      change: 'Updated today',
      changeUp: true,
    },
    {
      label: 'Wage Liability',
      value: formatCurrency(stats.totalWageLiabilityThisMonth),
      icon: '₹',
      color: 'green',
      change: 'Current month',
      changeUp: null,
    },
  ] : []

  const quickActions = [
    { label: 'Add Worker', desc: 'Register a new employee', path: '/workers', icon: '👤', color: 'blue' },
    { label: 'Log Hours', desc: "Mark today's attendance", path: '/hours', icon: '⏰', color: 'gold' },
    { label: 'Generate Payroll', desc: 'Calculate & process wages', path: '/payroll', icon: '💰', color: 'green' },
  ]

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const trendData = analytics?.monthlyTrend ?? []
  const departmentData = analytics?.departmentBreakdown ?? []
  const overtimeData = analytics?.overtimeData ?? []

  const maxTrendValue = trendData.reduce((max, item) => {
    const gross = Number(item.grossPay || 0)
    const net = Number(item.netPay || 0)
    return Math.max(max, gross, net)
  }, 0)

  const maxDepartmentWorkers = departmentData.reduce(
    (max, item) => Math.max(max, Number(item.workers || 0)),
    0
  )

  const maxOvertimeHours = overtimeData.reduce(
    (max, item) => Math.max(max, Number(item.overtimeHours || 0)),
    0
  )

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.greeting}>{greeting} 👋</p>
          <h1 className={styles.title}>
            Welcome back, <span className={styles.titleName}>{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className={styles.company}>{user?.companyName}</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.monthBadge}>
            <span className={styles.monthDot}></span>
            {stats?.monthYear || now.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading dashboard...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            {cards.map((card, i) => (
              <div
                key={card.label}
                className={`${styles.statCard} ${styles[card.color]}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={styles.statTop}>
                  <div className={styles.statIconWrap}>
                    <span className={styles.statIcon}>{card.icon}</span>
                  </div>
                  <span className={`${styles.statChange} ${card.changeUp ? styles.statChangeUp : ''}`}>
                    {card.change}
                  </span>
                </div>
                <p className={styles.statValue}>{card.value}</p>
                <p className={styles.statLabel}>{card.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Quick Actions</h2>
            <div className={styles.actionsGrid}>
              {quickActions.map((action, i) => (
                <button
                  key={action.path}
                  className={`${styles.actionCard} ${styles[action.color + 'Action']}`}
                  onClick={() => navigate(action.path)}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className={styles.actionIcon}>{action.icon}</div>
                  <div>
                    <p className={styles.actionLabel}>{action.label}</p>
                    <p className={styles.actionDesc}>{action.desc}</p>
                  </div>
                  <span className={styles.actionArrow}>→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary Panel */}
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Overview</h2>
            <div className={styles.overviewGrid}>
              <div className={styles.overviewCard}>
                <div className={styles.overviewCardHeader}>
                  <span className={styles.overviewCardIcon}>📋</span>
                  <strong>Payroll Summary</strong>
                </div>
                <div className={styles.overviewRows}>
                  <div className={styles.overviewRow}>
                    <span>Total Workers</span>
                    <strong>{stats?.totalWorkers ?? '—'}</strong>
                  </div>
                  <div className={styles.overviewRow}>
                    <span>Hours Logged</span>
                    <strong>{formatHours(stats?.totalHoursThisMonth)}</strong>
                  </div>
                  <div className={styles.overviewRow}>
                    <span>Wage Liability</span>
                    <strong className={styles.overviewHighlight}>{formatCurrency(stats?.totalWageLiabilityThisMonth)}</strong>
                  </div>
                  <div className={styles.overviewRow}>
                    <span>Pay Period</span>
                    <strong>{stats?.monthYear || '—'}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.overviewCard}>
                <div className={styles.overviewCardHeader}>
                  <span className={styles.overviewCardIcon}>⚡</span>
                  <strong>Getting Started</strong>
                </div>
                <div className={styles.checklist}>
                  <div className={styles.checkItem}>
                    <div className={`${styles.checkDot} ${styles.checkDone}`}>✓</div>
                    <span>Company account created</span>
                  </div>
                  <div className={styles.checkItem}>
                    <div className={`${styles.checkDot} ${(stats?.totalWorkers ?? 0) > 0 ? styles.checkDone : ''}`}>
                      {(stats?.totalWorkers ?? 0) > 0 ? '✓' : '1'}
                    </div>
                    <span>Add your first worker</span>
                  </div>
                  <div className={styles.checkItem}>
                    <div className={`${styles.checkDot} ${(stats?.totalHoursThisMonth ?? 0) > 0 ? styles.checkDone : ''}`}>
                      {(stats?.totalHoursThisMonth ?? 0) > 0 ? '✓' : '2'}
                    </div>
                    <span>Log working hours</span>
                  </div>
                  <div className={styles.checkItem}>
                    <div className={styles.checkDot}>3</div>
                    <span>Generate your first payroll</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Analysis</h2>
            <div className={styles.analysisGrid}>
              <div className={styles.analysisCard}>
                <div className={styles.analysisCardHeader}>
                  <strong>Payroll Trend</strong>
                  <span>Gross vs Net over 6 months</span>
                </div>
                {trendData.length > 0 ? (
                  <div className={styles.trendChart}>
                    {trendData.map(item => {
                      const gross = Number(item.grossPay || 0)
                      const net = Number(item.netPay || 0)
                      const grossHeight = maxTrendValue ? `${(gross / maxTrendValue) * 100}%` : '0%'
                      const netHeight = maxTrendValue ? `${(net / maxTrendValue) * 100}%` : '0%'
                      return (
                        <div key={item.month} className={styles.trendGroup}>
                          <div className={styles.trendBars}>
                            <div className={styles.trendBarWrap}>
                              <div className={`${styles.trendBar} ${styles.trendBarGross}`} style={{ height: grossHeight }} />
                            </div>
                            <div className={styles.trendBarWrap}>
                              <div className={`${styles.trendBar} ${styles.trendBarNet}`} style={{ height: netHeight }} />
                            </div>
                          </div>
                          <div className={styles.trendLabel}>{item.month}</div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className={styles.analysisEmpty}>Generate payroll for multiple months to see the trend.</div>
                )}
                <div className={styles.analysisLegend}>
                  <span><i className={`${styles.legendDot} ${styles.legendGross}`}></i>Gross</span>
                  <span><i className={`${styles.legendDot} ${styles.legendNet}`}></i>Net</span>
                </div>
              </div>

              <div className={styles.analysisCard}>
                <div className={styles.analysisCardHeader}>
                  <strong>Department Breakdown</strong>
                  <span>Active workers by department</span>
                </div>
                {departmentData.length > 0 ? (
                  <div className={styles.breakdownList}>
                    {departmentData.map(item => {
                      const workers = Number(item.workers || 0)
                      const width = maxDepartmentWorkers ? `${(workers / maxDepartmentWorkers) * 100}%` : '0%'
                      return (
                        <div key={item.department} className={styles.breakdownItem}>
                          <div className={styles.breakdownTop}>
                            <span>{item.department}</span>
                            <strong>{workers}</strong>
                          </div>
                          <div className={styles.breakdownTrack}>
                            <div className={styles.breakdownFill} style={{ width }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className={styles.analysisEmpty}>Add workers with departments to see team distribution.</div>
                )}
              </div>

              <div className={`${styles.analysisCard} ${styles.analysisCardWide}`}>
                <div className={styles.analysisCardHeader}>
                  <strong>Overtime Insights</strong>
                  <span>Current month worker overtime</span>
                </div>
                {overtimeData.length > 0 ? (
                  <div className={styles.overtimeList}>
                    {overtimeData.map(item => {
                      const hours = Number(item.overtimeHours || 0)
                      const width = maxOvertimeHours ? `${(hours / maxOvertimeHours) * 100}%` : '0%'
                      return (
                        <div key={item.worker} className={styles.overtimeItem}>
                          <div className={styles.overtimeMeta}>
                            <span className={styles.overtimeWorker}>{item.worker}</span>
                            <strong>{formatHours(item.overtimeHours)}</strong>
                          </div>
                          <div className={styles.overtimeTrack}>
                            <div className={styles.overtimeFill} style={{ width }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className={styles.analysisEmpty}>No overtime recorded for {analytics?.currentMonth || stats?.monthYear}.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
