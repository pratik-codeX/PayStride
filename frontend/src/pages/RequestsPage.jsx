import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { formatCurrency, formatDate } from '../utils/format'
import styles from './RequestsPage.module.css'

const TABS = [
  { id: 'advances', label: 'Advance Requests', icon: '💰' },
  { id: 'leaves', label: 'Leave Requests', icon: '📅' },
]

// Skeleton component
function TableSkeleton() {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Worker</th>
            <th>Amount/Date</th>
            <th>Type/Month</th>
            <th>Reason</th>
            <th>Requested</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {[1,2,3,4,5].map(i => (
            <tr key={i}>
              <td><div className={styles.skeletonCell} style={{ width: '150px' }} /></td>
              <td><div className={styles.skeletonCell} style={{ width: '100px' }} /></td>
              <td><div className={styles.skeletonCell} style={{ width: '80px' }} /></td>
              <td><div className={styles.skeletonCell} style={{ width: '150px' }} /></td>
              <td><div className={styles.skeletonCell} style={{ width: '90px' }} /></td>
              <td><div className={styles.skeletonCell} style={{ width: '80px' }} /></td>
              <td><div className={styles.skeletonCell} style={{ width: '80px' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState('advances')
  const [advances, setAdvances] = useState([])
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewNote, setReviewNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchAdvances = useCallback(async () => {
    setLoading(true)
    try {
      const url = filter === 'ALL' ? '/hr/advances' : `/hr/advances?status=${filter}`
      const res = await api.get(url)
      setAdvances(res.data)
    } catch {
      toast.error('Failed to load advance requests')
    } finally {
      setLoading(false)
    }
  }, [filter])

  const fetchLeaves = useCallback(async () => {
    setLoading(true)
    try {
      const url = filter === 'ALL' ? '/hr/leaves' : `/hr/leaves?status=${filter}`
      const res = await api.get(url)
      setLeaves(res.data)
    } catch {
      toast.error('Failed to load leave requests')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    if (activeTab === 'advances') fetchAdvances()
    else fetchLeaves()
  }, [activeTab, fetchAdvances, fetchLeaves])

  function openReview(item, type) {
    setReviewModal({ ...item, type })
    setReviewNote('')
  }

  async function handleReview(status) {
    if (!reviewModal) return
    setSubmitting(true)
    try {
      const endpoint = reviewModal.type === 'advance'
        ? `/hr/advances/${reviewModal.id}/review`
        : `/hr/leaves/${reviewModal.id}/review`
      await api.put(endpoint, { status, reviewNote })
      toast.success(`Request ${status.toLowerCase()} successfully`)
      setReviewModal(null)
      if (activeTab === 'advances') fetchAdvances()
      else fetchLeaves()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update request')
    } finally {
      setSubmitting(false)
    }
  }

  const pendingAdvances = advances.filter(a => a.status === 'PENDING').length
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length

  return (
    <div className="page-wrapper">
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Requests</h1>
          <p className={styles.subtitle}>Manage worker advance and leave requests</p>
        </div>
        {(pendingAdvances > 0 || pendingLeaves > 0) && (
          <div className={styles.alertBadge}>
            {pendingAdvances + pendingLeaves} pending review
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => { setActiveTab(tab.id); setFilter('ALL') }}
            >
              {tab.icon} {tab.label}
              {tab.id === 'advances' && pendingAdvances > 0 && (
                <span className={styles.tabBadge}>{pendingAdvances}</span>
              )}
              {tab.id === 'leaves' && pendingLeaves > 0 && (
                <span className={styles.tabBadge}>{pendingLeaves}</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.filterRow}>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : activeTab === 'advances' ? (
        advances.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>💰</div>
            <h3 className={styles.emptyTitle}>No advance requests</h3>
            <p className={styles.emptyDesc}>Workers can request advances from their portal</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Amount</th>
                  <th>Month</th>
                  <th>Reason</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {advances.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className={styles.workerCell}>
                        <div className={styles.avatar}>{a.workerName?.charAt(0)}</div>
                        <div>
                          <p className={styles.workerName}>{a.workerName}</p>
                          <p className={styles.workerCode}>{a.workerCode}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600, color: 'var(--text)' }}>
                      {formatCurrency(a.amount)}
                    </td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>{a.monthYear}</td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 200, fontSize: 13 }}>{a.reason || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {a.requestedAt ? new Date(a.requestedAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td>
                      <div>
                        <span className={`badge ${
                          a.status === 'APPROVED' ? 'badge-green' :
                          a.status === 'REJECTED' ? 'badge-red' : 'badge-amber'
                        }`}>{a.status}</span>
                        {a.reviewNote && (
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                            📝 {a.reviewNote}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      {a.status === 'PENDING' ? (
                        <button
                          className={styles.reviewBtn}
                          onClick={() => openReview(a, 'advance')}
                        >
                          ✎ Review
                        </button>
                      ) : (
                        <span className="badge badge-gray">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        leaves.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📅</div>
            <h3 className={styles.emptyTitle}>No leave requests</h3>
            <p className={styles.emptyDesc}>Workers can apply for leave from their portal</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Leave date</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(l => (
                  <tr key={l.id}>
                    <td>
                      <div className={styles.workerCell}>
                        <div className={styles.avatar}>{l.workerName?.charAt(0)}</div>
                        <div>
                          <p className={styles.workerName}>{l.workerName}</p>
                          <p className={styles.workerCode}>{l.workerCode}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 500 }}>
                      {formatDate(l.leaveDate)}
                    </td>
                    <td>
                      <span className={`badge ${
                        l.leaveType === 'SICK' ? 'badge-red' :
                        l.leaveType === 'CASUAL' ? 'badge-blue' : 'badge-amber'
                      }`}>
                        {l.leaveType || 'CASUAL'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 200, fontSize: 13 }}>{l.reason || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {l.requestedAt ? new Date(l.requestedAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td>
                      <div>
                        <span className={`badge ${
                          l.status === 'APPROVED' ? 'badge-green' :
                          l.status === 'REJECTED' ? 'badge-red' : 'badge-amber'
                        }`}>{l.status}</span>
                        {l.reviewNote && (
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                            📝 {l.reviewNote}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      {l.status === 'PENDING' ? (
                        <button
                          className={styles.reviewBtn}
                          onClick={() => openReview(l, 'leave')}
                        >
                          ✎ Review
                        </button>
                      ) : (
                        <span className="badge badge-gray">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {reviewModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setReviewModal(null)}>
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">
                {reviewModal.type === 'advance' ? '💰 Review Advance' : '📅 Review Leave'} Request
              </h2>
              <button className="modal-close" onClick={() => setReviewModal(null)}>×</button>
            </div>

            <div className={styles.reviewDetails}>
              <div className={styles.reviewRow}>
                <span>Worker</span>
                <strong>{reviewModal.workerName} ({reviewModal.workerCode})</strong>
              </div>
              {reviewModal.type === 'advance' ? (
                <>
                  <div className={styles.reviewRow}>
                    <span>Amount</span>
                    <strong style={{ color: 'var(--primary)' }}>{formatCurrency(reviewModal.amount)}</strong>
                  </div>
                  <div className={styles.reviewRow}>
                    <span>Month</span>
                    <strong>{reviewModal.monthYear}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.reviewRow}>
                    <span>Leave date</span>
                    <strong>{formatDate(reviewModal.leaveDate)}</strong>
                  </div>
                  <div className={styles.reviewRow}>
                    <span>Type</span>
                    <strong>{reviewModal.leaveType}</strong>
                  </div>
                </>
              )}
              <div className={styles.reviewRow}>
                <span>Reason</span>
                <span style={{ color: 'var(--text-muted)' }}>{reviewModal.reason || '—'}</span>
              </div>
            </div>

            <div className="input-group">
              <label>Note for worker (optional)</label>
              <textarea
                rows="3"
                placeholder="Add a note explaining your decision..."
                value={reviewNote}
                onChange={e => setReviewNote(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className={styles.reviewActions}>
              <button
                className="btn btn-ghost"
                onClick={() => setReviewModal(null)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleReview('REJECTED')}
                disabled={submitting}
              >
                {submitting ? '...' : '❌ Reject'}
              </button>
              <button
                className="btn btn-success"
                onClick={() => handleReview('APPROVED')}
                disabled={submitting}
              >
                {submitting ? '...' : '✅ Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}