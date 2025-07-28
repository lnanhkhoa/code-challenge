import { create } from "zustand"
import { authAPI, type User } from "@/lib/api"
import { socketManager } from "@/lib/socket"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  refreshProfile: () => Promise<User | null>
  refreshToken: () => Promise<boolean>
  initializeAuth: () => Promise<void>
  setLoading: (loading: boolean) => void
  updateUser: (user: User) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  // Actions
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  updateUser: (user: User) => {
    set({ user })
    localStorage.setItem("user", JSON.stringify(user))
  },

  logout: async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      socketManager.disconnect()

      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  },

  refreshProfile: async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return null

      const user = await authAPI.getProfile()
      set({ user })
      localStorage.setItem("user", JSON.stringify(user))
      return user
    } catch (error) {
      console.error("Error refreshing profile:", error)
      // If profile refresh fails, user might be logged out
      get().logout()
      return null
    }
  },

  refreshToken: async () => {
    try {
      const { token } = get()
      if (!token) return false

      // Check token expiration (JWT typically expires in 1 hour)
      const tokenData = JSON.parse(atob(token.split(".")[1]))
      const expirationTime = tokenData.exp * 1000 // Convert to milliseconds

      // If token is about to expire (less than 5 minutes remaining)
      if (Date.now() > expirationTime - 5 * 60 * 1000) {
        const response = await authAPI.refreshToken()

        if (response.success && response.token) {
          localStorage.setItem("auth_token", response.token)
          if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user))
            set({
              token: response.token || null,
              user: response.user || null,
            })
          } else {
            set({
              token: response.token || null,
            })
          }

          // Reconnect socket with new token
          socketManager.connect(response.token)
          return true
        }
        return false
      }
      return true
    } catch (error) {
      console.error("Error refreshing token:", error)
      return false
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true })

      const response = await authAPI.login(email, password)

      if (response.success && response.token && response.user) {
        localStorage.setItem("auth_token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))

        set({
          user: response.user,
          token: response.token,
          isLoading: false,
          isAuthenticated: true,
        })

        // Connect socket with new token only if not already connected
        if (!socketManager.isConnected()) {
          socketManager.connect(response.token)
        }

        return { success: true, message: response.message }
      } else {
        set({ isLoading: false })
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      set({ isLoading: false })
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  },

  register: async (email: string, username: string, password: string) => {
    try {
      set({ isLoading: true })

      const response = await authAPI.register(email, username, password)

      if (response.success && response.token && response.user) {
        localStorage.setItem("auth_token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))

        set({
          user: response.user,
          token: response.token,
          isLoading: false,
          isAuthenticated: true,
        })

        // Connect socket with new token only if not already connected
        if (!socketManager.isConnected()) {
          socketManager.connect(response.token)
        }

        return { success: true, message: response.message }
      } else {
        set({ isLoading: false })
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      set({ isLoading: false })
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  },

  initializeAuth: async () => {
    const token = localStorage.getItem("auth_token")
    const userJson = localStorage.getItem("user")

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User
        set({
          token,
          user,
          isLoading: false,
          isAuthenticated: true,
        })

        // Connect socket with new token only if not already connected
        if (!socketManager.isConnected()) socketManager.connect(token)

        // Refresh user profile to get latest data
        get().refreshProfile()
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
        get().logout()
      }
    } else {
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  },
}))

// Initialize auth on store creation
useAuthStore.getState().initializeAuth()

// Set up token refresh interval
let tokenRefreshInterval: NodeJS.Timeout | null = null

useAuthStore.subscribe((state) => {
  if (state.isAuthenticated && !tokenRefreshInterval) {
    // Check token on authentication
    state.refreshToken()

    // Set up periodic token refresh (every 15 minutes)
    tokenRefreshInterval = setInterval(() => {
      useAuthStore.getState().refreshToken()
    }, 15 * 60 * 1000)
  } else if (!state.isAuthenticated && tokenRefreshInterval) {
    // Clear interval when not authenticated
    clearInterval(tokenRefreshInterval)
    tokenRefreshInterval = null
  }
})
