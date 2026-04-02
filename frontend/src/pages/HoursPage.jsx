import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { today } from '../utils/format'
import styles from './HoursPage.module.css'

export default function HoursPage() {
  const [selectedDate, setSelectedDate] = useState(today())
  const [workers, setWorkers] = useState([])
  const [hoursMap, setHoursMap] = useState({})
  const [existingLogs, setExistingLogs] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [workersRes, logsRes] = await Promise.all([
        api.get('/workers'),
        api.get(`/hours?date=${selectedDate}`)
      ])
      setWorkers(workersRes.data.filter(w => w.active))
      setExistingLogs(logsRes.data)
      const map = {}
      logsRes.data.forEach(log => { map[log.workerId] = log.hoursWorked?.toString() })
      setHoursMap(map)
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }, [selectedDate])

  useEffect(() => { fetchData() }, [fetchData])

  function updateHours(workerId, value) {
    setHoursMap(prev => ({ ...prev, [workerId]: value }))
  }

  async function handleSaveAll() {
    const toSave = workers.filter(w => hoursMap[w.id] && parseFloat(hoursMap[w.id]) > 0)
    if (toSave.length === 0) { toast.error('Enter hours for at least one worker'); return }
    setSaving(true)
    let saved = 0, failed = 0
    for (const worker of toSave) {
      const hours = parseFloat(hoursMap[worker.id])
      if (isNaN(hours)) continue
      const existing = existingLogs.find(l => l.workerId === worker.id)
      try {
        if (existing) await api.put(`/hours/${existing.id}`, { hoursWorked: hours })
        else await api.post('/hours', { workerId: worker.id, workDate: selectedDate, hoursWorked: hours })
        saved++
      } catch { failed++ }
    }
    if (failed > 0) toast.error(`${failed} entries failed to save`)
    if (saved > 0) { toast.success(`Hours saved for ${saved} worker${saved > 1 ? 's' : ''}`); fetchData() }
    setSaving(false)
  }

  const loggedCount = existingLogs.length
  const totalHoursToday = existingLogs.reduce((s, l) => s + parseFloat(l.hoursWorked || 0), 0)

  return (
    <div>
      {/* Page header band */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <div>
            <h1 className={styles.pageTitle}>Log Daily Hours</h1>
            <p className={styles.pageSubtitle}>Track attendance and hours worked each day</p>
          </div>
        </div>
      </div>

      <div className="page-wrapper">
        <div className={styles.controls}>
          <div className={styles.dateRow}>
            <label className={styles.dateLabel}>Date</label>
            <input
              type="date"
              className={styles.dateInput}
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              max={today()}
            />
          </div>
          {!loading && (
            <div className={styles.summaryPills}>
              <span className={styles.pill}>
                <span className={styles.pillDot} style={{ background: '#059669' }} />
                {loggedCount} logged
              </span>
              <span className={styles.pill}>
                <span className={styles.pillDot} style={{ background: '#3b82f6' }} />
                {totalHoursToday.toFixed(1)} total hrs
              </span>
              <span className={styles.pill}>
                <span className={styles.pillDot} style={{ background: '#94a3b8' }} />
                {workers.length - loggedCount} pending
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : workers.length === 0 ? (
          <div className={styles.empty}>
            <p>No active workers found.</p>
            <p>Add workers first before logging hours.</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Department</th>
                    <th>Hours Worked</th>
                    <th>Overtime</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map(worker => {
                    const hrs = parseFloat(hoursMap[worker.id] || 0)
                    const isLogged = existingLogs.some(l => l.workerId === worker.id)
                    const overtime = hrs > 8 ? (hrs - 8).toFixed(1) : 0
                    return (
                      <tr key={worker.id}>
                        <td>
                          <div className={styles.workerCell}>
                            <div className={styles.avatar}>{worker.name.charAt(0).toUpperCase()}</div>
                            <div>
                              <p className={styles.workerName}>{worker.name}</p>
                              <p className={styles.workerRate}>₹{worker.hourlyRate}/hr</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          {worker.department
                            ? <span className="badge badge-navy">{worker.department}</span>
                            : <span style={{ color: 'var(--text-muted)' }}>—</span>
                          }
                        </td>
                        <td>
                          <input
                            type="number"
                            className={`${styles.hoursInput} ${hrs > 8 ? styles.overtime : ''}`}
                            min="0" max="24" step="0.5"
                            placeholder="0.0"
                            value={hoursMap[worker.id] || ''}
                            onChange={e => updateHours(worker.id, e.target.value)}
                          />
                        </td>
                        <td>
                          {overtime > 0
                            ? <span className="badge badge-amber">+{overtime} OT hrs</span>
                            : <span style={{ color: 'var(--text-light)' }}>—</span>
                          }
                        </td>
                        <td>
                          <span className={`badge ${isLogged ? 'badge-green' : 'badge-gray'}`}>
                            {isLogged ? 'Logged' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.saveBar}>
              <p className={styles.saveHint}>Changes are not saved automatically — click Save when done</p>
              <button className="btn btn-gold" onClick={handleSaveAll} disabled={saving}>
                {saving ? 'Saving...' : `Save Hours for ${selectedDate}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
