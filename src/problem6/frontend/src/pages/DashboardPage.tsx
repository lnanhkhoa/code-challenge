import { Calculator } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaderboard } from "@/components/scoreboard/Leaderboard"
import { MathProblem } from "@/components/scoreboard/MathProblem"
import { NavHeader } from "@/components/layout/NavHeader"
import { useAuthStore } from "@/stores/authStore"
import { formatScore } from "@/lib/utils"

export function DashboardPage() {
  const isLoading = useAuthStore((state) => state.isLoading)
  const user = useAuthStore((state) => state.user)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <NavHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Math Problem */}
          <div className="space-y-6">
            <MathProblem className="h-fit" />

            {/* Additional Stats Card */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatScore(user.score)}
                      </div>
                      <div className="text-sm text-gray-500">Total Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">Member Since</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Leaderboard */}
          <div>
            <Leaderboard className="sticky top-8" />
          </div>
        </div>
      </main>
    </div>
  )
}
