import type { ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, User, Trophy, Home, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { formatScore } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export function Layout({ children, showHeader = true, showFooter = true }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {showHeader && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-blue-600" />
                  <h1 className="text-xl font-bold text-gray-900">Live Scoreboard</h1>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-4">
                  <Link 
                    to="/leaderboard" 
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/leaderboard') 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Leaderboard
                  </Link>
                  
                  {isAuthenticated && (
                    <Link 
                      to="/dashboard" 
                      className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/dashboard') 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                  )}
                </nav>
              </div>

              <div className="flex items-center gap-4">
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{user.username}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatScore(user.score)} points
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center gap-1"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login">
                      <Button variant="outline" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="sm">
                        Join Competition
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {showFooter && (
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              <p>Live Scoreboard - Real-time math competition platform</p>
              <p className="mt-1">
                Built with React, TypeScript, Socket.io, and TailwindCSS
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
