import { useState } from "react"
import { Navigate, Link, useNavigate } from "react-router-dom"
import { Trophy } from "lucide-react"
import { LoginForm } from "@/components/auth/LoginForm"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { useAuth } from "@/hooks/useAuth"

type AuthMode = "login" | "register"

export function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleAuthSuccess = () => {
    // Navigation will be handled by the Navigate component above
    console.log("Auth success")
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Live Scoreboard</h1>
          </div>
          <p className="text-gray-600">Solve math problems and compete with others in real-time!</p>
        </div>

        {authMode === "login" ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setAuthMode("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setAuthMode("login")}
          />
        )}

        {/* a list of sample users */}
        <div className="mt-8 text-center">
          <p className="text-lg font-semibold">Sample Users</p>
          <ul className="list-disc list-inside text-gray-600">
            <li>admin@example.com (password: 123456)</li>
            <li>user1@example.com (password: 123456)</li>
            <li>user2@example.com (password: 123456)</li>
            <li>user3@example.com (password: 123456)</li>
            <li>user4@example.com (password: 123456)</li>
            <li>user5@example.com (password: 123456)</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link to="/leaderboard" className="text-sm text-blue-600 hover:text-blue-800 underline">
            View Public Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}
