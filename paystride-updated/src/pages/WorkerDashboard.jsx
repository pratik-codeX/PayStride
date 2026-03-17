import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { formatCurrency, formatHours, formatDate, getMonthYear } from '../utils/format'
import { generatePayslipPDF } from '../utils/pdfUtils'
import styles from './WorkerDashboard.module.css'

const TABS = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'hours', label: 'My Hours', icon: '⏱' },
  { id: 'payroll', label: 'My Payslips', icon: '💰' },
  { id: 'advance', label: 'Advance', icon: '💳' },
  { id: 'leave', label: 'Leave', icon: '📅' },
]

// Skeleton components
function OverviewSkeleton() {
  return (
    <>
      <div className={styles.skeletonCard} style={{ height: '120px', marginBottom: '20px' }} />
      <div className={styles.overviewCards}>
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
      </div>
      <div className={styles.skeletonCard} style={{ height: '200px' }} />
    </>
  )
}

function TableSkeleton() {
  return (
    <div className="table-wrapper">
      {[1,2,3,4].map(i => (
        <div key={i} className={styles.skeletonRow} />
      ))}
    </div>
  )
}

export default function WorkerDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [monthYear, setMonthYear] = useState(getMonthYear())
  const [hours, setHours] = useState([])
  const [payroll, setPayroll] = useState([])
  const [advances, setAdvances] = useState([])
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)

  const [advanceForm, setAdvanceForm] = useState({
    amount: '', reason: '', monthYear: getMonthYear()
  })
  const [leaveForm, setLeaveForm] = useState({
    leaveDate: '', leaveType: 'CASUAL', reason: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchHours = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(`/worker/my-hours?monthYear=${monthYear}`)
      setHours(res.data)
    } catch { toast.error('Failed to load hours') }
    finally { setLoading(false) }
  }, [monthYear])

  const fetchPayroll = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/worker/my-payroll')
      setPayroll(res.data)
    } catch { toast.error('Failed to load payslips') }
    finally { setLoading(false) }
  }, [])

  const fetchAdvances = useCallback(async () => {
    try {
      const res = await api.get('/worker/my-advances')
      setAdvances(res.data)
    } catch { toast.error('Failed to load advances') }
  }, [])

  const fetchLeaves = useCallback(async () => {
    try {
      const res = await api.get('/worker/my-leaves')
      setLeaves(res.data)
    } catch { toast.error('Failed to load leaves') }
  }, [])

  useEffect(() => {
    fetchPayroll()
    fetchAdvances()
    fetchLeaves()
  }, [fetchPayroll, fetchAdvances, fetchLeaves])

  useEffect(() => { if (activeTab === 'hours') fetchHours() }, [activeTab, fetchHours])
  useEffect(() => { if (activeTab === 'advance') fetchAdvances() }, [activeTab, fetchAdvances])
  useEffect(() => { if (activeTab === 'leave') fetchLeaves() }, [activeTab, fetchLeaves])

  function handleDownloadPayslip(p) {
    setDownloadingId(p.monthYear)
    try {
      generatePayslipPDF(p, user?.name, user?.workerCode, user?.companyName)
      toast.success('Payslip downloaded!')
    } catch (err) {
      toast.error('Failed to generate PDF')
      console.error(err)
    } finally {
      setDownloadingId(null)
    }
  }

  async function handleAdvanceRequest(e) {
    e.preventDefault()
    if (!advanceForm.amount || parseFloat(advanceForm.amount) <= 0) {
      toast.error('Enter a valid amount'); return
    }
    if (!advanceForm.reason.trim()) { toast.error('Please give a reason'); return }
    setSubmitting(true)
    try {
      await api.post('/worker/advance-request', {
        amount: parseFloat(advanceForm.amount),
        reason: advanceForm.reason,
        monthYear: advanceForm.monthYear
      })
      toast.success('Advance request submitted! HR will review it.')
      setAdvanceForm({ amount: '', reason: '', monthYear: getMonthYear() })
      fetchAdvances()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit')
    } finally { setSubmitting(false) }
  }

  async function handleLeaveRequest(e) {
    e.preventDefault()
    if (!leaveForm.leaveDate) { toast.error('Select a leave date'); return }
    if (!leaveForm.reason.trim()) { toast.error('Please give a reason'); return }
    setSubmitting(true)
    try {
      await api.post('/worker/leave-request', {
        leaveDate: leaveForm.leaveDate,
        leaveType: leaveForm.leaveType,
        reason: leaveForm.reason
      })
      toast.success('Leave request submitted! HR will review it.')
      setLeaveForm({ leaveDate: '', leaveType: 'CASUAL', reason: '' })
      fetchLeaves()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit')
    } finally { setSubmitting(false) }
  }

  const latestPayroll = payroll[0]
  const totalHoursThisMonth = hours.reduce((s, h) => s + parseFloat(h.hoursWorked || 0), 0)
  const pendingCount = advances.filter(a => a.status === 'PENDING').length +
                       leaves.filter(l => l.status === 'PENDING').length

  // Mobile bottom navigation handler
  const handleMobileTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'hours') fetchHours()
    if (tabId === 'advance') fetchAdvances()
    if (tabId === 'leave') fetchLeaves()
  }

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <div className={styles.brandIcon}>W</div>
          <div>
            <p className={styles.brandName}>Worker Portal</p>
            <p className={styles.brandSub}>PayStride</p>
          </div>
        </div>
        
        <div className={styles.topbarRight}>
          <div style={{ position: 'relative' }}>
            <button
              className={styles.userMenuBtn}
              onClick={() => setShowUserMenu(m => !m)}
            >
              <div className={styles.workerAvatar}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className={styles.workerInfo}>
                <p className={styles.workerName}>{user?.name}</p>
                <p className={styles.workerId}>{user?.workerCode}</p>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▼</span>
            </button>
            
            {showUserMenu && (
              <div className={styles.userMenu}>
                <div className={styles.userMenuItem} style={{ cursor: 'default', color: 'var(--text-muted)' }}>
                  Password resets are handled by admin
                </div>
                <div style={{ height: 1, background: 'var(--border)' }} />
                <button
                  className={`${styles.userMenuItem} ${styles.logoutItem}`}
                  onClick={logout}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className={styles.content}>
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {loading ? (
                <OverviewSkeleton />
              ) : (
                <>
                  <div className={styles.welcomeCard}>
                    <div className={styles.welcomeAvatar}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className={styles.welcomeName}>Hello, {user?.name?.split(' ')[0]}! 👋</h2>
                      <p className={styles.welcomeSub}>
                        {user?.department ? `${user.department} · ` : ''}
                        Worker ID: <strong>{user?.workerCode}</strong>
                      </p>
                    </div>
                  </div>

                  <div className={styles.overviewCards}>
                    <div className={styles.overviewCard}>
                      <p className={styles.ocLabel}>Last net pay</p>
                      <p className={styles.ocValue} style={{ color: '#059669' }}>
                        {latestPayroll ? formatCurrency(latestPayroll.netPay) : '—'}
                      </p>
                      <p className={styles.ocSub}>{latestPayroll?.monthYear || 'No payroll yet'}</p>
                    </div>
                    <div className={styles.overviewCard}>
                      <p className={styles.ocLabel}>Hours this month</p>
                      <p className={styles.ocValue}>{totalHoursThisMonth.toFixed(1)} hrs</p>
                      <p className={styles.ocSub}>{monthYear}</p>
                    </div>
                    <div className={styles.overviewCard}>
                      <p className={styles.ocLabel}>Pending requests</p>
                      <p className={styles.ocValue}>{pendingCount}</p>
                      <p className={styles.ocSub}>advances + leaves</p>
                    </div>
                  </div>

                  {latestPayroll ? (
                    <div className={styles.payslipPreview}>
                      <div className={styles.payslipHeader}>
                        <p className={styles.payslipTitle}>Latest payslip — {latestPayroll.monthYear}</p>
                        <button
                          className="btn btn-success"
                          onClick={() => handleDownloadPayslip(latestPayroll)}
                          style={{ padding: '8px 16px' }}
                        >
                          📥 Download PDF
                        </button>
                      </div>
                      <div className={styles.payslipRows}>
                        <div className={styles.payslipRow}>
                          <span>Total hours</span>
                          <span>{formatHours(latestPayroll.totalHours)}</span>
                        </div>
                        <div className={styles.payslipRow}>
                          <span>Regular hours</span>
                          <span>{formatHours(latestPayroll.regularHours)}</span>
                        </div>
                        <div className={styles.payslipRow}>
                          <span>Overtime hours</span>
                          <span style={{ color: '#d97706' }}>{formatHours(latestPayroll.overtimeHours)}</span>
                        </div>
                        <div className={styles.payslipRow}>
                          <span>Gross pay</span>
                          <span>{formatCurrency(latestPayroll.grossPay)}</span>
                        </div>
                        <div className={styles.payslipRow}>
                          <span>PF deduction (12%)</span>
                          <span style={{ color: '#dc2626' }}>− {formatCurrency(latestPayroll.pfDeduction)}</span>
                        </div>
                        <div className={styles.payslipRow}>
                          <span>ESI deduction (0.75%)</span>
                          <span style={{ color: '#dc2626' }}>− {formatCurrency(latestPayroll.esiDeduction)}</span>
                        </div>
                        <div className={`${styles.payslipRow} ${styles.payslipTotal}`}>
                          <span>Net payable</span>
                          <span>{formatCurrency(latestPayroll.netPay)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptyCard}>
                      <div className={styles.emptyIcon}>📋</div>
                      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No payslips yet</h3>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                        Your HR will generate payroll at month end
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Hours Tab */}
          {activeTab === 'hours' && (
            <div>
              <div className={styles.tabHeader}>
                <h3 className={styles.tabTitle}>My attendance</h3>
                <input 
                  type="month" 
                  value={monthYear}
                  onChange={e => setMonthYear(e.target.value)}
                  className={styles.monthInput}
                />
              </div>
              
              {loading ? (
                <TableSkeleton />
              ) : hours.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>⏱️</div>
                  <h3>No hours logged for {monthYear}</h3>
                  <p style={{ fontSize: 13, marginTop: 8 }}>Your supervisor logs your attendance daily</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Hours worked</th>
                        <th>Overtime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hours.map(h => {
                        const ot = parseFloat(h.hoursWorked) > 8 ? (parseFloat(h.hoursWorked) - 8).toFixed(1) : 0
                        return (
                          <tr key={h.id}>
                            <td style={{ fontFamily: 'DM Mono, monospace' }}>{formatDate(h.workDate)}</td>
                            <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{h.hoursWorked} hrs</td>
                            <td>
                              {ot > 0 ? (
                                <span className="badge badge-amber">+{ot} OT</span>
                              ) : (
                                <span className="badge badge-gray">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc' }}>
                        <td><strong>Total ({hours.length} days)</strong></td>
                        <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>
                          {hours.reduce((s, h) => s + parseFloat(h.hoursWorked), 0).toFixed(1)} hrs
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Payroll Tab */}
          {activeTab === 'payroll' && (
            <div>
              <h3 className={styles.tabTitle} style={{ marginBottom: 20 }}>My payslips</h3>
              
              {loading ? (
                <TableSkeleton />
              ) : payroll.length === 0 ? (
                <div className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>💰</div>
                  <h3>No payslips available yet</h3>
                  <p style={{ fontSize: 13, marginTop: 8 }}>Your HR generates payroll at month end</p>
                </div>
              ) : (
                <div className={styles.payslipList}>
                  {payroll.map(p => (
                    <div key={p.monthYear} className={styles.payslipCard}>
                      <div className={styles.payslipCardHeader}>
                        <div>
                          <p className={styles.payslipMonth}>{p.monthYear}</p>
                          <p className={styles.payslipHours}>{formatHours(p.totalHours)} worked</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ textAlign: 'right' }}>
                            <p className={styles.payslipNet}>{formatCurrency(p.netPay)}</p>
                            <p className={styles.payslipGross}>Gross: {formatCurrency(p.grossPay)}</p>
                          </div>
                          <button
                            className="btn btn-gold"
                            onClick={() => handleDownloadPayslip(p)}
                            disabled={downloadingId === p.monthYear}
                            style={{ padding: '8px 16px' }}
                          >
                            📥 {downloadingId === p.monthYear ? '...' : 'PDF'}
                          </button>
                        </div>
                      </div>
                      <div className={styles.payslipDetails}>
                        <div className={styles.detailRow}>
                          <span>Regular hours</span>
                          <span>{formatHours(p.regularHours)}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Overtime hours</span>
                          <span style={{ color: '#d97706' }}>{formatHours(p.overtimeHours)}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span>PF deduction (12%)</span>
                          <span style={{ color: '#dc2626' }}>− {formatCurrency(p.pfDeduction)}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span>ESI deduction (0.75%)</span>
                          <span style={{ color: '#dc2626' }}>− {formatCurrency(p.esiDeduction)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Advance Tab */}
          {activeTab === 'advance' && (
            <div>
              <div className={styles.tabHeader}>
                <h3 className={styles.tabTitle}>Request advance</h3>
              </div>

              <div className={styles.requestGrid}>
                <div className={styles.requestForm}>
                  <p className={styles.requestIntro}>
                    Submit an advance request for review. HR will approve or reject it after checking your payroll details.
                  </p>
                  <form onSubmit={handleAdvanceRequest}>
                    <div className="input-group">
                      <label>Amount (₹)</label>
                      <input 
                        type="number" 
                        min="100" 
                        step="100" 
                        placeholder="e.g. 2000"
                        value={advanceForm.amount}
                        onChange={e => setAdvanceForm(p => ({ ...p, amount: e.target.value }))} 
                      />
                    </div>
                    <div className="input-group">
                      <label>Reason</label>
                      <input 
                        placeholder="Medical emergency, house rent..."
                        value={advanceForm.reason}
                        onChange={e => setAdvanceForm(p => ({ ...p, reason: e.target.value }))} 
                      />
                    </div>
                    <div className="input-group">
                      <label>For month</label>
                      <input 
                        type="month" 
                        value={advanceForm.monthYear}
                        onChange={e => setAdvanceForm(p => ({ ...p, monthYear: e.target.value }))} 
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-gold" 
                      disabled={submitting}
                      style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    >
                      {submitting ? 'Submitting...' : '💰 Submit advance request'}
                    </button>
                  </form>
                </div>

                <div className={styles.historyCard}>
                  <div className={styles.historyHeader}>
                    <h4 className={styles.historyTitle}>My advance history</h4>
                    <span className="badge badge-navy">{advances.length} request{advances.length !== 1 ? 's' : ''}</span>
                  </div>
                  {advances.length > 0 ? (
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Month</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>HR Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {advances.map(a => (
                            <tr key={a.id}>
                              <td style={{ fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>
                                {formatCurrency(a.amount)}
                              </td>
                              <td style={{ fontFamily: 'DM Mono, monospace' }}>{a.monthYear}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{a.reason || '—'}</td>
                              <td>
                                <span className={`badge ${
                                  a.status === 'APPROVED' ? 'badge-green' : 
                                  a.status === 'REJECTED' ? 'badge-red' : 'badge-amber'
                                }`}>
                                  {a.status}
                                </span>
                              </td>
                              <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{a.reviewNote || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={styles.emptyCard}>
                      <div className={styles.emptyIcon}>💰</div>
                      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No advance requests yet</h3>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                        Your submitted advance requests will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Leave Tab */}
          {activeTab === 'leave' && (
            <div>
              <div className={styles.tabHeader}>
                <h3 className={styles.tabTitle}>Apply for leave</h3>
              </div>

              <div className={styles.requestGrid}>
                <div className={styles.requestForm}>
                  <p className={styles.requestIntro}>
                    Choose your leave date and type, then add a short reason so your request can be reviewed quickly.
                  </p>
                  <form onSubmit={handleLeaveRequest}>
                    <div className="input-group">
                      <label>Leave date</label>
                      <input 
                        type="date" 
                        value={leaveForm.leaveDate}
                        onChange={e => setLeaveForm(p => ({ ...p, leaveDate: e.target.value }))} 
                      />
                    </div>
                    <div className="input-group">
                      <label>Leave type</label>
                      <select 
                        value={leaveForm.leaveType}
                        onChange={e => setLeaveForm(p => ({ ...p, leaveType: e.target.value }))}
                      >
                        <option value="CASUAL">Casual leave</option>
                        <option value="SICK">Sick leave</option>
                        <option value="EMERGENCY">Emergency leave</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Reason</label>
                      <input 
                        placeholder="Please explain your reason..."
                        value={leaveForm.reason}
                        onChange={e => setLeaveForm(p => ({ ...p, reason: e.target.value }))} 
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-gold" 
                      disabled={submitting}
                      style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    >
                      {submitting ? 'Submitting...' : '📅 Submit leave request'}
                    </button>
                  </form>
                </div>

                <div className={styles.historyCard}>
                  <div className={styles.historyHeader}>
                    <h4 className={styles.historyTitle}>My leave history</h4>
                    <span className="badge badge-navy">{leaves.length} request{leaves.length !== 1 ? 's' : ''}</span>
                  </div>
                  {leaves.length > 0 ? (
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>HR Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaves.map(l => (
                            <tr key={l.id}>
                              <td style={{ fontFamily: 'DM Mono, monospace' }}>{formatDate(l.leaveDate)}</td>
                              <td>
                                <span className={`badge ${
                                  l.leaveType === 'SICK' ? 'badge-red' : 
                                  l.leaveType === 'EMERGENCY' ? 'badge-amber' : 'badge-blue'
                                }`}>
                                  {l.leaveType}
                                </span>
                              </td>
                              <td style={{ color: 'var(--text-muted)' }}>{l.reason || '—'}</td>
                              <td>
                                <span className={`badge ${
                                  l.status === 'APPROVED' ? 'badge-green' : 
                                  l.status === 'REJECTED' ? 'badge-red' : 'badge-amber'
                                }`}>
                                  {l.status}
                                </span>
                              </td>
                              <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{l.reviewNote || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={styles.emptyCard}>
                      <div className={styles.emptyIcon}>📅</div>
                      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No leave requests yet</h3>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                        Your submitted leave requests will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={styles.bottomNav}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.bottomNavItem} ${activeTab === tab.id ? styles.bottomNavActive : ''}`}
            onClick={() => handleMobileTabChange(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

    </div>
  )
}
