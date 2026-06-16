import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const signIn = useAuthStore((s) => s.signIn)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⚗️</div>
          <h1 style={styles.logoText}>iLab</h1>
        </div>
        <p style={styles.tagline}>Virtual Science Laboratory</p>

        <h2 style={styles.heading}>Welcome back</h2>
        <p style={styles.sub}>Sign in to continue your experiments</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.ac.ug"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button style={{
            ...styles.btn,
            opacity: loading ? 0.7 : 1
          }} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #EAF3DE 0%, #ffffff 60%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    background: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 32px rgba(59,109,17,0.10)',
    border: '1px solid var(--green-50)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
  },
  logoIcon: { fontSize: '28px' },
  logoText: {
    fontSize: '26px',
    fontWeight: '700',
    color: 'var(--green-500)',
    letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: '12px',
    color: 'var(--gray-400)',
    marginBottom: '32px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--gray-800)',
    marginBottom: '4px',
  },
  sub: {
    fontSize: '14px',
    color: 'var(--gray-600)',
    marginBottom: '24px',
  },
  error: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: 'var(--danger)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: 'var(--gray-600)' },
  input: {
    padding: '10px 14px',
    border: '1.5px solid var(--gray-200)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    color: 'var(--gray-800)',
  },
  btn: {
    padding: '12px',
    background: 'var(--green-500)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: '15px',
    fontWeight: '600',
    marginTop: '4px',
    transition: 'background 0.2s',
  },
  footer: { textAlign: 'center', fontSize: '14px', color: 'var(--gray-600)', marginTop: '24px' },
  link: { color: 'var(--green-500)', fontWeight: '600' },
}