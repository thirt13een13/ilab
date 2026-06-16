import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div style={styles.shell}>
      <Sidebar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--gray-100)',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    minWidth: 0,
  },
}