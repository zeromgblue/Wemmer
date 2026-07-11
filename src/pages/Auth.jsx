import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)
    if (error) setError(error.message)
    else if (!isLogin) setSuccess('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตนครับ')
    setLoading(false)
  }

  function switchMode() {
    setIsLogin(v => !v)
    setError('')
    setSuccess('')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">wemmer</div>
        <p className="auth-subtitle">
          {isLogin ? 'ยินดีต้อนรับกลับมาครับ' : 'เริ่มต้นจัดการชีวิตของคุณ'}
        </p>

        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
        {success && (
          <div style={{
            fontSize: 13, color: 'var(--green)', background: 'var(--green-bg)',
            padding: '10px 14px', borderRadius: 'var(--r-sm)', marginBottom: 16
          }}>{success}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="label">อีเมล</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">รหัสผ่าน</label>
            <input className="input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading && <span className="spinner" style={{ width: 16, height: 16 }} />}
            {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? 'ยังไม่มีบัญชี?' : 'มีบัญชีอยู่แล้ว?'}{' '}
          <button onClick={switchMode}>{isLogin ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</button>
        </div>
      </div>
    </div>
  )
}
