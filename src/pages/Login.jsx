import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'

export default function Login() {
  const { login } = useAdmin()
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, pass)
    } catch {
      setError('Invalid email or password. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight:'100vh', background:'#0a0a0a',
      display:'flex', alignItems:'center', justifyContent:'center', padding:20
    }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:52, marginBottom:10 }}>🏆</div>
          <h1 style={{ fontFamily:'Oswald,sans-serif', fontSize:30, fontWeight:700, color:'#fff' }}>
            Sport<span style={{ color:'#e8401c' }}>Zone</span>
          </h1>
          <p style={{ color:'#555', fontSize:13, marginTop:4, fontWeight:600, letterSpacing:1 }}>ADMIN DASHBOARD</p>
        </div>

        <form onSubmit={handleLogin} style={{
          background:'#1a1a1a', borderRadius:14, padding:32, border:'1px solid #2e2e2e'
        }}>
          <h2 style={{ color:'#fff', fontSize:18, fontWeight:800, marginBottom:24 }}>Sign In to Dashboard</h2>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@sportzone.com" required />
          </div>

          <div className="form-group" style={{ marginBottom:20 }}>
            <label>Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required />
          </div>

          {error && (
            <div style={{
              background:'#2d0f0f', border:'1px solid #5c1a1a', borderRadius:8,
              padding:'10px 14px', color:'#e24b4a', fontSize:13, marginBottom:16
            }}>❌ {error}</div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width:'100%', padding:13, fontSize:15 }} disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div style={{
          marginTop:16, padding:'14px 16px', background:'#111',
          borderRadius:10, border:'1px solid #2e2e2e', textAlign:'center'
        }}>
          <p style={{ color:'#555', fontSize:12, marginBottom:6, fontWeight:700 }}>DEMO ACCOUNT</p>
          <p style={{ color:'#888', fontSize:13 }}>📧 admin@sportzone.com</p>
          <p style={{ color:'#888', fontSize:13, marginTop:3 }}>🔑 admin123</p>
          <p style={{ color:'#444', fontSize:11, marginTop:8 }}>Create this account in Firebase Authentication first</p>
        </div>
      </div>
    </div>
  )
}
