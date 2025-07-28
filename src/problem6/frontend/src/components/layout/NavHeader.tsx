import { useState } from "react"
import { Trophy, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/authStore"
import { Link, useNavigate } from "react-router-dom"
import { formatScore } from "@/lib/utils"
import { useConnectionStatus } from "@/hooks/useConnectionStatus"

export function NavHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const connectionStatus = useConnectionStatus()

  const handleLogout = async () => {
    await logout()
    navigate("/")
    setIsDropdownOpen(false)
  }

  const handleProfile = () => {
    // TODO: Navigate to profile page or open profile modal
    console.log("Navigate to profile")
    navigate("/profile")
    setIsDropdownOpen(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Live Scoreboard</h1>
            </div>
            <Link
              to="/leaderboard"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors underline-offset-4 hover:underline"
            >
              Leaderboard
            </Link>
          </div>

          {/* Connection Status and User Avatar */}
          <div className="flex items-center gap-4">
            {/* Connection Status Indicator */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "connecting"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs text-gray-600 capitalize">{connectionStatus}</span>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">Score: {formatScore(user.score)}</p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                  >
                    <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all">
                      <AvatarImage
                         src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
                        alt={user.username}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent isOpen={isDropdownOpen}>
                    <DropdownMenuItem
                      onClick={handleProfile}
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
