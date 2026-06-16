import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import { subjects } from '../../data/experiments'
import { useState } from 'react'

const subjectIcons = {
  'integrated-science': '🔬',
  'physics': '⚡',
  'chemistry': '⚗️',
  'biology': '🧬',
}

export default function Sidebar() {
  const signOut = useAuthStore((s) => s.signOut)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? 'S'

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <span style={styles.logoIcon}>⚗️</span>
        <span style={styles.logoText}>iLab</span>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        <p style={styles.navLabel}>Overview</p>
        <NavLink to="/" end style={({ isActive }) => ({
          ...styles.navItem,
          ...(isActive ? styles.navActive : {})
        })}>
          <span>🏠</span> Dashboard
        </NavLink>

        <p style={styles.navLabel}>Subjects</p>
        {subjects.map(subject => (
          <NavLink
            key={subject.id}
            to={`/subject/${subject.id}`}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navActive : {})
            })}
          >
            <span>{subjectIcons[subject.id]}</span>
            {subject.name}
          </NavLink>
        ))}

        <p style={styles.navLabel}>Account</p>
        <NavLink to="/progress" style={({ isActive }) => ({
          ...styles.navItem,
          ...(isActive ? styles.navActive : {})
        })}>
          <span>📊</span> My Progress
        </NavLink>
      </nav>

      {/* User footer */}
      <div style={styles.userSection}>
        <div style={styles.avatar}>{initials}</div>
        <div style={styles.userInfo}>
          <p style={styles.userName}>
            {user?.user_metadata?.full_name ?? 'Student'}
          </p>
          <p style={styles.userEmail}>{user?.email}</p>
        </div>
        <button onClick={handleSignOut} style={styles.signOutBtn} title="Sign out">
          ↩
        </button>
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '240px',
    minWidth: '240px',
    background: '#ffffff',
    borderRight: '1px solid var(--gray-200)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    padding: '0 0 16px 0',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '24px 20px 20px',
    borderBottom: '1px solid var(--gray-200)',
  },
  logoIcon: { fontSize: '22px' },
  logoText: { fontSize: '20px', fontWeight: '700', color: 'var(--green-500)', letterSpacing: '-0.3px' },
  nav: { flex: 1, padding: '12px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' },
  navLabel: {
    fontSize: '10px', fontWeight: '700', color: 'var(--gray-400)',
    letterSpacing: '1px', textTransform: 'uppercase',
    padding: '12px 8px 4px',
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 12px', borderRadius: 'var(--radius-sm)',
    fontSize: '14px', fontWeight: '500', color: 'var(--gray-600)',
    transition: 'all 0.15s', textDecoration: 'none',
  },
  navActive: {
    background: 'var(--green-50)',
    color: 'var(--green-500)',
    fontWeight: '600',
  },
  userSection: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 16px',
    borderTop: '1px solid var(--gray-200)',
    marginTop: 'auto',
  },
  avatar: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: 'var(--green-50)', color: 'var(--green-500)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '700', flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: '13px', fontWeight: '600', color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userEmail: { fontSize: '11px', color: 'var(--gray-400)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  signOutBtn: { background: 'none', border: 'none', fontSize: '16px', color: 'var(--gray-400)', padding: '4px', borderRadius: '4px', flexShrink: 0 },
}