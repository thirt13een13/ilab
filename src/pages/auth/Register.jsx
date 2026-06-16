import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [school, setSchool] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const signUp = useAuthStore((s) => s.signUp)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, fullName)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.successIcon}>✅</div>
        <h2 style={styles.heading}>Check your email</h2>
        <p style={styles.sub}>
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your account then sign in.
        </p>
        <button style={styles.btn} onClick={() => navigate('/login')}>
          Go to sign in
        </button>
      </div>
    </div>
  )

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⚗️</div>
          <h1 style={styles.logoText}>iLab</h1>
        </div>
        <p style={styles.tagline}>Virtual Science Laboratory</p>

        <h2 style={styles.heading}>Create your account</h2>
        <p style={styles.sub}>Join thousands of students doing virtual experiments</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full name</label>
            <input style={styles.input} type="text" value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Amara Nakato" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input style={styles.input} type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.ac.ug" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>School (optional)</label>
            <input style={styles.input} type="text" value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Makerere College School" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters" required />
          </div>
          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #EAF3DE 0%, #ffffff 60%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
  },
  card: {
    background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '40px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 8px 32px rgba(59,109,17,0.10)', border: '1px solid var(--green-50)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' },
  logoIcon: { fontSize: '28px' },
  logoText: { fontSize: '26px', fontWeight: '700', color: 'var(--green-500)', letterSpacing: '-0.5px' },
  tagline: { fontSize: '12px', color: 'var(--gray-400)', marginBottom: '32px', letterSpacing: '0.5px', textTransform: 'uppercase' },
  heading: { fontSize: '20px', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '4px' },
  sub: { fontSize: '14px', color: 'var(--gray-600)', marginBottom: '24px' },
  error: { background: '#FEF2F2', border: '1px solid #FECACA', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '14px', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: 'var(--gray-600)' },
  input: { padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: '15px', outline: 'none', color: 'var(--gray-800)' },
  btn: { padding: '12px', background: 'var(--green-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '15px', fontWeight: '600', marginTop: '4px' },
  footer: { textAlign: 'center', fontSize: '14px', color: 'var(--gray-600)', marginTop: '24px' },
  link: { color: 'var(--green-500)', fontWeight: '600' },
  successIcon: { fontSize: '40px', marginBottom: '16px' },
}