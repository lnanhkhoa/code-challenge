import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        
        <Route path="/login" element={
          <Layout showHeader={false} showFooter={false}>
            <LoginPage />
          </Layout>
        } />
        
        <Route path="/leaderboard" element={
          <Layout showHeader={false} showFooter={false}>
            <LeaderboardPage />
          </Layout>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout showHeader={false} showFooter={false}>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
