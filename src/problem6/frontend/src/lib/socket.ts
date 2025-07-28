import { io, Socket } from "socket.io-client"
import type { LeaderboardEntry } from "./api"
import { SOCKET_URL } from "./config"

export interface SocketEvents {
  leaderboard_update: (data: { leaderboard: LeaderboardEntry[]; updated_at: string }) => void
  score_update: (data: { new_score: number; points_earned: number; updated_at: string }) => void

  connect: () => void
  disconnect: () => void
  connect_error: (error: Error) => void
}

class SocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnecting = false

  connect(token?: string): Socket {
    // If socket exists and is connected, return it
    if (this.socket?.connected) return this.socket
    if (this.isConnecting && this.socket) return this.socket

    // If socket exists but not connected, and we're not currently connecting, try to reconnect
    if (this.socket && !this.isConnecting) {
      this.socket.connect()
      return this.socket
    }

    this.isConnecting = true
    const socketUrl = SOCKET_URL

    if (this.socket) this.socket.disconnect()

    this.socket = io(socketUrl, {
      auth: {
        token: token || localStorage.getItem("auth_token"),
      },
      transports: ["websocket", "polling"],
      upgrade: true,
      rememberUpgrade: true,
      forceNew: true, // Force a new connection
    })

    this.setupEventHandlers()
    return this.socket
  }

  private setupEventHandlers() {
    if (!this.socket) return

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id)
      this.reconnectAttempts = 0
      this.isConnecting = false // Reset connecting state on successful connection
    })

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)

      // Auto-reconnect for certain disconnect reasons
      if (reason === "io server disconnect") {
        // Server initiated disconnect, don't reconnect
        return
      }

      this.handleReconnect()
    })

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      this.isConnecting = false // Reset connecting state on error
      this.handleReconnect()
    })

    this.socket.on("auth_error", (error) => {
      console.error("Socket auth error:", error)
      // Clear invalid token and redirect to login
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    })
  }

  private handleReconnect() {
    this.reconnectAttempts++

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached")
      return
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)

    setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        this.socket.connect()
      }
    }, delay)
  }

  onLeaderboardUpdate(
    callback: (data: { leaderboard: LeaderboardEntry[]; updated_at: string }) => void,
  ) {
    if (this.socket) this.socket.on("leaderboard_update", callback)
  }

  offLeaderboardUpdate(
    callback?: (data: { leaderboard: LeaderboardEntry[]; updated_at: string }) => void,
  ) {
    if (this.socket) this.socket.off("leaderboard_update", callback)
  }

  onScoreUpdate(
    callback: (data: { new_score: number; points_earned: number; updated_at: string }) => void,
  ) {
    if (this.socket) this.socket.on("score_update", callback)
  }

  offScoreUpdate(
    callback?: (data: { new_score: number; points_earned: number; updated_at: string }) => void,
  ) {
    if (this.socket) this.socket.off("score_update", callback)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.isConnecting = false
    this.reconnectAttempts = 0
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getSocket(): Socket | null {
    return this.socket
  }
}

export const socketManager = new SocketManager()
