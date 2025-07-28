import { Link } from 'react-router-dom'
import { Trophy, LogIn, UserPlus, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Leaderboard } from '@/components/scoreboard/Leaderboard'
import { useAuth } from '@/hooks/useAuth'

export function LeaderboardPage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Live Scoreboard</h1>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-medium">{user?.username}</span>
                  </span>
                  <Link to="/dashboard">
                    <Button size="sm">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="sm" className="flex items-center gap-1">
                      <UserPlus className="h-4 w-4" />
                      Join Competition
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Live Competition Leaderboard
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            See who's leading the math competition in real-time!
          </p>
          
          {!isAuthenticated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 mb-3">
                Want to compete? Join now and start solving math problems to earn points!
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/login">
                  <Button className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" />
                    Sign Up to Compete
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="flex items-center gap-1">
                    <LogIn className="h-4 w-4" />
                    Already have an account?
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="max-w-2xl mx-auto">
          <Leaderboard />
        </div>

        {/* How it works section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How it Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">1. Sign Up</h4>
              <p className="text-sm text-gray-600">
                Create your account and join the competition
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">2. Solve Problems</h4>
              <p className="text-sm text-gray-600">
                Answer math problems to earn points
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">3. Climb the Board</h4>
              <p className="text-sm text-gray-600">
                Watch your rank update in real-time
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
    </div>
  )
}
