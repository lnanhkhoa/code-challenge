import { useState, useEffect } from "react"
import { Trophy, Medal, Award, Crown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { leaderboardAPI, type LeaderboardEntry } from "@/lib/api"
import { socketManager } from "@/lib/socket"
import { formatScore, formatRank } from "@/lib/utils"
import { useAuthStore } from "@/stores/authStore"
import { useConnectionStatus } from "@/hooks/useConnectionStatus"

interface LeaderboardProps {
  className?: string
}

export function Leaderboard({ className }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const connectionStatus = useConnectionStatus()
  const isConnected = connectionStatus === "connected"

  // Load initial leaderboard data
  const loadLeaderboard = async () => {
    try {
      setIsLoading(true)
      const response = await leaderboardAPI.getLeaderboard()

      if (response.success) {
        setLeaderboard(response.leaderboard)
        if (response.user_rank) {
          setUserRank(response.user_rank)
        }
        setLastUpdated(new Date().toISOString())
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load leaderboard")
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    loadLeaderboard()
  }, [isAuthenticated])

  // Set up real-time updates
  useEffect(() => {
    if (!isConnected) return

    const handleLeaderboardUpdate = (data: {
      leaderboard: LeaderboardEntry[]
      updated_at: string
    }) => {
      console.log("Received leaderboard update:", data)
      setLeaderboard(data.leaderboard)
      setLastUpdated(data.updated_at)
    }

    // Join leaderboard room and listen for updates
    socketManager.onLeaderboardUpdate(handleLeaderboardUpdate)

    return () => {
      socketManager.offLeaderboardUpdate(handleLeaderboardUpdate)
    }
  }, [isConnected])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Award className="h-5 w-5 text-gray-300" />
    }
  }

  const getRankStyle = (rank: number, isCurrentUser: boolean) => {
    let baseStyle = "flex items-center justify-between p-3 rounded-lg transition-colors"

    if (isCurrentUser) {
      baseStyle += " bg-blue-50 border-2 border-blue-200"
    } else {
      baseStyle += " hover:bg-gray-50"
    }

    switch (rank) {
      case 1:
        return baseStyle + " bg-gradient-to-r from-yellow-50 to-amber-50"
      case 2:
        return baseStyle + " bg-gradient-to-r from-gray-50 to-slate-50"
      case 3:
        return baseStyle + " bg-gradient-to-r from-amber-50 to-orange-50"
      default:
        return baseStyle
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Failed to load leaderboard</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top 10 Players
          </div>
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No players yet</p>
              <p className="text-sm text-gray-400">Be the first to score!</p>
            </div>
          ) : (
            leaderboard.map((entry) => {
              const isCurrentUser = user?.id === entry.id
              return (
                <div key={entry.id} className={getRankStyle(entry.rank, isCurrentUser)}>
                  <div className="flex items-center gap-3">
                    {getRankIcon(entry.rank)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.username}</span>
                        {isCurrentUser && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{formatRank(entry.rank)} place</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{formatScore(entry.score)}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {userRank && userRank > 10 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-center text-sm text-gray-500">
              Your rank: {formatRank(userRank)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
