// Frontend configuration
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
export const API_BASE_URL = `${API_URL}/api`

// Socket.io configuration
export const SOCKET_URL = "ws://localhost:3000"

// Environment
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD

// App configuration
export const APP_NAME = "Live Scoreboard"
export const APP_VERSION = "1.0.0"
