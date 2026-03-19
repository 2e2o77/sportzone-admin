import { useState } from 'react'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { useAdmin } from '../context/AdminContext'
import { auth } from '../firebase'

export default function Profile() {
  const { user, showToast } = useAdmin()
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass]         = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading, setLoading]         = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPass !== confirmPass) { showToast('Passwords do not match!', 'danger'); return }
    if (newPass.length < 6) { showToast('Password must be at least 6 characters!', 'danger'); return }

    setLoading(true)
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPass)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, newPass)
      showToast('Password changed successfully! ✅')
      setCurrentPass(''); setNewPass(''); setConfirmPass('')
    } catch (err) {
      showToast(err.code === 'auth/wrong-password' ? 'Current password is wrong!' : err.message, 'danger')
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-sub">Manage your admin account</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Account Info */}
        <div className="card">
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>👤 Account Info</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: '#e8401c',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 800, color: '#fff', flexShrink: 0
            }}>A</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Admin</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{user?.email}</div>
              <span className="badge badge-approved" style={{ marginTop: 6 }}>✅ Active</span>
            </div>
          </div>
          {[
            { label: 'Role',       value: 'Super Admin' },
            { label: 'Email',      value: user?.email },
            { label: 'Last Login', value: new Date().toLocaleDateString() },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid #222', fontSize: 13
            }}>
              <span style={{ color: '#666' }}>{r.label}</span>
              <span style={{ color: '#ccc', fontWeight: 600 }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Change Password */}
        <div className="card">
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>🔑 Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>
              {loading ? '⏳ Changing...' : '🔐 Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
