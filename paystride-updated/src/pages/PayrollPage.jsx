import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { formatCurrency, formatHours, getMonthYear } from '../utils/format'
import { generatePayrollPDF } from '../utils/pdfUtils'
import styles from './PayrollPage.module.css'

function shareOnWhatsApp(record, monthYear, companyName) {
  if (!record.workerPhone && !record.phone) {
    toast.error(`No phone number found for ${record.workerName}`)
    return
  }

  const phone = (record.workerPhone || record.phone || '').replace(/\D/g, '')
  const fullPhone = phone.startsWith('91') ? phone : `91${phone}`
  const message = [
    '*PayStride - Salary Slip*',
    `*${companyName || 'Your Company'}*`,
    '',
    `Hello *${record.workerName}*,`,
    `Your salary for *${monthYear}* has been processed.`,
    '',
    '*Attendance*',
    `Total hours: ${parseFloat(record.totalHours || 0).toFixed(1)} hrs`,
    `Regular hours: ${parseFloat(record.regularHours || 0).toFixed(1)} hrs`,
    `Overtime hours: ${parseFloat(record.overtimeHours || 0).toFixed(1)} hrs`,
    '',
    '*Earnings & Deductions*',
    `Gross pay: Rs. ${parseFloat(record.grossPay || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    `PF (12%): - Rs. ${parseFloat(record.pfDeduction || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    `ESI (0.75%): - Rs. ${parseFloat(record.esiDeduction || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    '',
    `*Net Salary: Rs. ${parseFloat(record.netPay || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}*`,
    '',
    '_Powered by PayStride_',
  ].join('\n')

  window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, '_blank')
}

export default function PayrollPage() {
  const [monthYear, setMonthYear] = useState(getMonthYear())
  const [payrollData, setPayrollData] = useState([])
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const { user } = useAuth()

  const fetchPayroll = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(`/payroll?monthYear=${monthYear}`)
      setPayrollData(res.data)
    } catch {
      toast.error('Failed to load payroll')
    } finally {
      setLoading(false)
    }
  }, [monthYear])

  useEffect(() => { fetchPayroll() }, [fetchPayroll])

  async function handleGenerate() {
    if (!window.confirm(`Generate payroll for ${monthYear}?\nThis will calculate wages for all active workers.`)) return
    setGenerating(true)
    try {
      const res = await api.post(`/payroll/generate?monthYear=${monthYear}`)
      toast.success(`Payroll generated for ${res.data.totalWorkers} workers`)
      fetchPayroll()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate payroll')
    } finally {
      setGenerating(false)
    }
  }

  function handleDownloadPDF() {
    if (payrollData.length === 0) {
      toast.error('No payroll data to download')
      return
    }

    setDownloading(true)
    try {
      generatePayrollPDF(payrollData, monthYear, user?.companyName)
      toast.success('PDF downloaded!')
    } catch {
      toast.error('Failed to generate PDF')
    } finally {
      setDownloading(false)
    }
  }

  function handleShareAll() {
    const withPhone = payrollData.filter(record => record.workerPhone || record.phone)
    if (withPhone.length === 0) {
      toast.error('No workers have phone numbers registered')
      return
    }

    toast.success(`Opening WhatsApp for ${withPhone.length} workers...`)
    withPhone.forEach((record, index) => {
      setTimeout(() => shareOnWhatsApp(record, monthYear, user?.companyName), index * 800)
    })
  }

  const totals = payrollData.reduce((acc, r) => ({
    totalHours: acc.totalHours + parseFloat(r.totalHours || 0),
    regularHours: acc.regularHours + parseFloat(r.regularHours || 0),
    overtimeHours: acc.overtimeHours + parseFloat(r.overtimeHours || 0),
    grossPay: acc.grossPay + parseFloat(r.grossPay || 0),
    pfDeduction: acc.pfDeduction + parseFloat(r.pfDeduction || 0),
    esiDeduction: acc.esiDeduction + parseFloat(r.esiDeduction || 0),
    netPay: acc.netPay + parseFloat(r.netPay || 0),
  }), { totalHours: 0, regularHours: 0, overtimeHours: 0, grossPay: 0, pfDeduction: 0, esiDeduction: 0, netPay: 0 })

  return (
    <div>
      {/* Page header band */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <div>
            <h1 className={styles.pageTitle}>Payroll</h1>
            <p className={styles.pageSubtitle}>Monthly wage calculation with PF &amp; ESI deductions</p>
          </div>
          <div className={styles.controls}>
            <input
              type="month"
              className={styles.monthInput}
              value={monthYear}
              onChange={e => setMonthYear(e.target.value)}
            />
            <button
              className="btn btn-gold"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? 'Generating...' : '⚡ Generate Payroll'}
            </button>
            {payrollData.length > 0 && (
              <>
                <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={downloading}>
                  {downloading ? 'Preparing...' : 'Download PDF'}
                </button>
                <button className={styles.waAllBtn} onClick={handleShareAll}>
                  Share All on WhatsApp
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="page-wrapper">
        {payrollData.length > 0 && (
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Workers Processed</p>
              <p className={styles.summaryValue}>{payrollData.length}</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Total Hours</p>
              <p className={styles.summaryValue}>{totals.totalHours.toFixed(1)} hrs</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Total Gross Pay</p>
              <p className={styles.summaryValue}>{formatCurrency(totals.grossPay)}</p>
            </div>
            <div className={`${styles.summaryCard} ${styles.netCard}`}>
              <p className={styles.summaryLabel}>Total Net Pay</p>
              <p className={`${styles.summaryValue} ${styles.netValue}`}>{formatCurrency(totals.netPay)}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>Loading payroll data...</div>
        ) : payrollData.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>📊</p>
            <p className={styles.emptyTitle}>No payroll for {monthYear}</p>
            <p className={styles.emptyDesc}>Log hours for workers then click Generate Payroll</p>
            <button className="btn btn-gold" onClick={handleGenerate} disabled={generating} style={{ marginTop: 16 }}>
              {generating ? 'Generating...' : '⚡ Generate Now'}
            </button>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Dept</th>
                    <th>Total Hrs</th>
                    <th>Regular</th>
                    <th>Overtime</th>
                  <th>Gross Pay</th>
                  <th>PF (12%)</th>
                  <th>ESI (0.75%)</th>
                  <th>Net Pay</th>
                  <th>Share</th>
                </tr>
              </thead>
                <tbody>
                  {payrollData.map(record => (
                    <tr key={record.workerId}>
                      <td>
                        <div className={styles.workerCell}>
                          <div className={styles.avatar}>
                            {record.workerName?.charAt(0).toUpperCase()}
                          </div>
                          <span className={styles.workerName}>{record.workerName}</span>
                        </div>
                      </td>
                      <td>
                        {record.department
                          ? <span className="badge badge-navy">{record.department}</span>
                          : <span style={{ color: 'var(--text-muted)' }}>—</span>
                        }
                      </td>
                      <td className={styles.mono}>{formatHours(record.totalHours)}</td>
                      <td className={styles.mono}>{formatHours(record.regularHours)}</td>
                      <td>
                        {parseFloat(record.overtimeHours) > 0
                          ? <span className={styles.otHours}>{formatHours(record.overtimeHours)}</span>
                          : <span style={{ color: 'var(--text-light)' }}>—</span>
                        }
                      </td>
                      <td className={styles.mono}>{formatCurrency(record.grossPay)}</td>
                      <td className={styles.deduction}>{formatCurrency(record.pfDeduction)}</td>
                      <td className={styles.deduction}>{formatCurrency(record.esiDeduction)}</td>
                      <td className={styles.netPay}>{formatCurrency(record.netPay)}</td>
                      <td>
                        {(record.workerPhone || record.phone) ? (
                          <button
                            className={styles.waBtn}
                            onClick={() => shareOnWhatsApp(record, monthYear, user?.companyName)}
                          >
                            Send
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-light)' }}>No phone</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}>Total</td>
                    <td className={styles.mono}>{totals.totalHours.toFixed(1)} hrs</td>
                    <td className={styles.mono}>{totals.regularHours.toFixed(1)} hrs</td>
                    <td className={styles.mono}>{totals.overtimeHours.toFixed(1)} hrs</td>
                    <td className={styles.mono}>{formatCurrency(totals.grossPay)}</td>
                    <td className={styles.deduction}>{formatCurrency(totals.pfDeduction)}</td>
                    <td className={styles.deduction}>{formatCurrency(totals.esiDeduction)}</td>
                    <td className={styles.netPay}>{formatCurrency(totals.netPay)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className={styles.formula}>
              Formula: Gross = (Regular hrs × rate) + (Overtime hrs × rate × 1.5) &nbsp;|&nbsp;
              PF = 12% of gross &nbsp;|&nbsp; ESI = 0.75% of gross &nbsp;|&nbsp; Net = Gross − PF − ESI
            </p>
          </>
        )}
      </div>
    </div>
  )
}
