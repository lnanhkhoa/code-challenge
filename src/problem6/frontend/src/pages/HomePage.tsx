import { Link } from 'react-router-dom'
import { Trophy, Calculator, Users, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Trophy className="h-12 w-12 text-blue-600" />
          <h1 className="text-5xl font-bold text-gray-900">Live Scoreboard</h1>
        </div>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Challenge yourself with real-time math competitions! Solve problems, earn points, 
          and climb the leaderboard in this exciting multiplayer experience.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button size="lg" className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  View Leaderboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="lg" className="flex items-center gap-2">
                  Join Competition
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  View Leaderboard
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Real-time Competition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Watch the leaderboard update instantly as players solve problems. 
              Experience the thrill of live competition with WebSocket technology.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-blue-500" />
              Math Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Solve addition and subtraction problems to earn points. 
              Each correct answer brings you closer to the top of the leaderboard.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-green-500" />
              Global Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Compete with players from around the world. 
              See your rank and track your progress in real-time.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Sign Up</h3>
            <p className="text-sm text-gray-600">
              Create your account and join the competition
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Solve Problems</h3>
            <p className="text-sm text-gray-600">
              Answer math problems to earn points
            </p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-yellow-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Earn Points</h3>
            <p className="text-sm text-gray-600">
              Each correct answer increases your score
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">4</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Climb the Board</h3>
            <p className="text-sm text-gray-600">
              Watch your rank update in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {!isAuthenticated && (
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Compete?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of players in the ultimate math challenge!
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="flex items-center gap-2 mx-auto">
              Start Competing Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
