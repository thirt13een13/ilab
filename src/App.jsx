import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import useAuthStore from './store/useAuthStore'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/dashboard/Dashboard'
import SubjectPage from './pages/subjects/SubjectPage'
import LevelPage from './pages/subjects/LevelPage'
import ExperimentList from './pages/experiments/ExperimentList'

function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  if (loading) return <div className="loading-screen">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="subject/:subjectId" element={<SubjectPage />} />
          <Route path="subject/:subjectId/:level" element={<LevelPage />} />
          <Route path="subject/:subjectId/:level/experiments" element={<ExperimentList />} />
          
       
        </Route>
      </Routes>
    </BrowserRouter>
  )
}