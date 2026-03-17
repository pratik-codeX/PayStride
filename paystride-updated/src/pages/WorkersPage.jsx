import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { formatCurrency, formatDate } from '../utils/format'
import styles from './WorkersPage.module.css'

const EMPTY_FORM = { name: '', phone: '', department: '', hourlyRate: '', joiningDate: '' }

export default function WorkersPage() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [resettingId, setResettingId] = useState(null)
  const [search, setSearch] = useState('')

  function set(field) { return e => setForm(prev => ({ ...prev, [field]: e.target.value })) }

  async function fetchWorkers() {
    try {
      const res = await api.get('/workers')
      setWorkers(res.data)
    } catch { toast.error('Failed to load workers') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchWorkers() }, [])

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setShowModal(true) }
  function openEdit(worker) {
    setEditing(worker)
    setForm({ name: worker.name || '', phone: worker.phone || '', department: worker.department || '', hourlyRate: worker.hourlyRate?.toString() || '', joiningDate: worker.joiningDate || '' })
    setShowModal(true)
  }

  function copyWorkerCode(code) {
    navigator.clipboard.writeText(code)
    toast.success('Worker ID copied!')
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Remove ${name} from PayStride?`)) return
    try { await api.delete(`/workers/${id}`); toast.success('Worker removed'); fetchWorkers() }
    catch { toast.error('Failed to remove worker') }
  }

  async function handleResetPassword(worker) {
    if (!window.confirm(`Reset password for ${worker.name}? This will set it to the worker's phone number.`)) return
    setResettingId(worker.id)
    try {
      await api.post(`/workers/${worker.id}/reset-password`, {})
      toast.success(`Password reset for ${worker.name}. Default password is ${worker.phone || 'their phone number'}.`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password')
    } finally {
      setResettingId(null)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Worker name is required'); return }
    if (!form.hourlyRate) { toast.error('Hourly rate is required'); return }
    setSaving(true)
    const payload = { name: form.name.trim(), phone: form.phone.trim(), department: form.department.trim(), hourlyRate: parseFloat(form.hourlyRate), joiningDate: form.joiningDate || null }
    try {
      if (editing) { await api.put(`/workers/${editing.id}`, payload); toast.success('Worker updated') }
      else { await api.post('/workers', payload); toast.success('Worker added') }
      setShowModal(false); fetchWorkers()
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save') }
    finally { setSaving(false) }
  }

  const filtered = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    (w.department || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Page header band */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <div>
            <h1 className={styles.pageTitle}>Workers</h1>
            <p className={styles.pageSubtitle}>{workers.filter(w => w.active).length} active workers on your team</p>
          </div>
          <button className="btn btn-gold" onClick={openAdd}>+ Add Worker</button>
        </div>
      </div>

      <div className="page-wrapper">
        {/* Search bar */}
        <div className={styles.header}>
          <div></div>
          <div className={styles.headerRight}>
            <input
              className={styles.search}
              placeholder="Search by name or department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {workers.length > 0 && (
          <div className={styles.infoBanner}>
            <div className={styles.infoIcon}>📋</div>
            <div className={styles.infoText}>
              <strong>Click any Worker ID badge</strong> to copy it. Share the Worker ID and phone number with each worker for portal login. Default password is their phone number.
            </div>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>Loading workers...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>👷</p>
            <p className={styles.emptyTitle}>{search ? 'No workers found' : 'No workers yet'}</p>
            <p className={styles.emptyDesc}>{search ? 'Try a different search' : 'Add your first worker to get started'}</p>
            {!search && <button className="btn btn-primary" onClick={openAdd} style={{ marginTop: 16 }}>Add first worker</button>}
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Worker ID</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Hourly Rate</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(worker => (
                  <tr key={worker.id}>
                    <td>
                      <div className={styles.workerCell}>
                        <div className={styles.avatar}>{worker.name.charAt(0).toUpperCase()}</div>
                        <span className={styles.workerName}>{worker.name}</span>
                      </div>
                    </td>
                    <td>
                      {worker.workerCode ? (
                        <span
                          title="Click to copy Worker ID"
                          onClick={() => copyWorkerCode(worker.workerCode)}
                          className={styles.workerCode}
                        >
                          {worker.workerCode}
                          <span className={styles.copyIcon}>⎘</span>
                        </span>
                      ) : (
                        <span className={styles.muted}>—</span>
                      )}
                    </td>
                    <td className={styles.muted}>{worker.phone || '—'}</td>
                    <td>
                      {worker.department
                        ? <span className="badge badge-navy">{worker.department}</span>
                        : <span className={styles.muted}>—</span>
                      }
                    </td>
                    <td><span className={styles.rate}>{formatCurrency(worker.hourlyRate)}<span className={styles.perHr}>/hr</span></span></td>
                    <td className={styles.muted}>{formatDate(worker.joiningDate)}</td>
                    <td>
                      <span className={`badge ${worker.active ? 'badge-green' : 'badge-red'}`}>
                        {worker.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.resetBtn}
                          onClick={() => handleResetPassword(worker)}
                          disabled={resettingId === worker.id}
                        >
                          {resettingId === worker.id ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <button className={styles.editBtn} onClick={() => openEdit(worker)}>Edit</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(worker.id, worker.name)}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Edit Worker' : 'Add New Worker'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalGrid}>
                <div className="input-group" style={{ gridColumn: '1/-1' }}>
                  <label>Full name *</label>
                  <input placeholder="Rahul Sharma" value={form.name} onChange={set('name')} />
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input placeholder="9876543210" value={form.phone} onChange={set('phone')} />
                </div>
                <div className="input-group">
                  <label>Department</label>
                  <input placeholder="Construction" value={form.department} onChange={set('department')} />
                </div>
                <div className="input-group">
                  <label>Hourly rate (₹) *</label>
                  <input type="number" step="0.01" min="0" placeholder="150.00" value={form.hourlyRate} onChange={set('hourlyRate')} />
                </div>
                <div className="input-group">
                  <label>Joining date</label>
                  <input type="date" value={form.joiningDate} onChange={set('joiningDate')} />
                </div>
              </div>
              {editing?.workerCode && (
                <div className={styles.workerCodePreview}>
                  <span>🔑</span>
                  <span>
                    Worker ID: <strong>{editing.workerCode}</strong> · Admin can reset the password to <strong>{editing.phone || 'phone number'}</strong>
                  </span>
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Worker' : 'Add Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
