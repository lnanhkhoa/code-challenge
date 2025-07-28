import axios from "axios"
import { API_BASE_URL } from "./config"

// Types matching the backend API
export interface User {
  id: number
  email: string
  username: string
  score: number
  createdAt: string
  updatedAt: string
}

export interface LeaderboardEntry {
  id: number
  username: string
  score: number
  rank: number
}

export interface MathProblem {
  operand1: number
  operand2: number
  action: "plus" | "minus"
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: User
  message: string
}

export interface ScoreActionResponse {
  success: boolean
  result: number
  points_earned: number
  new_score: number
  message: string
}

export interface LeaderboardResponse {
  success: boolean
  leaderboard: LeaderboardEntry[]
  user_rank?: number
  message: string
}

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API functions
export const authAPI = {
  register: async (email: string, username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", { email, username, password })
    return response.data
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout")
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/profile")
    return response.data.user
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post("/auth/refresh")
    return response.data
  },
}

// Score API functions
export const scoreAPI = {
  executeAction: async (
    action: "plus" | "minus",
    operand1: number,
    operand2: number,
    result: number,
  ): Promise<ScoreActionResponse> => {
    const response = await api.post("/score/action", {
      action,
      operand1,
      operand2,
      result,
    })
    return response.data
  },

  generateProblem: async (): Promise<MathProblem> => {
    const response = await api.get("/score/problem")
    return response.data.problem
  },

  getActionHistory: async (limit = 10): Promise<any[]> => {
    const response = await api.get(`/score/history?limit=${limit}`)
    return response.data.actions
  },
}

// Leaderboard API functions
export const leaderboardAPI = {
  getLeaderboard: async (): Promise<LeaderboardResponse> => {
    const response = await api.get(`/leaderboard`)
    return response.data
  },
}

export default api
