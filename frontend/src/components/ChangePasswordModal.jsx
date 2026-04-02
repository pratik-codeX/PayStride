import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import PasswordField from './PasswordField'

const STRONG_PASSWORD_MESSAGE = 'Password must be 8+ chars with uppercase, lowercase, number, and special character'
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

export default function ChangePasswordModal({ onClose, isWorker }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { logout } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    if (isWorker) { toast.error('Worker password can only be changed by admin'); return }
    if (!oldPassword) { toast.error('Enter your current password'); return }
    if (!strongPasswordRegex.test(newPassword)) { toast.error(STRONG_PASSWORD_MESSAGE); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      const endpoint = isWorker ? '/worker/change-password' : '/auth/change-password'
      await api.post(endpoint, { oldPassword, newPassword })
      toast.success('Password changed! Please login again.')
      logout()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">Change password</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <PasswordField
            label="Current password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            placeholder="Enter current password"
            autoComplete="current-password"
            autoFocus
          />
          <PasswordField
            label="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Min 8 chars with Aa1!"
            autoComplete="new-password"
            hint={STRONG_PASSWORD_MESSAGE}
          />
          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            autoComplete="new-password"
          />

          <div style={{
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 12,
            color: '#92400e',
            marginBottom: 16
          }}>
            After changing your password you will be logged out automatically.
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Changing...' : 'Change password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
