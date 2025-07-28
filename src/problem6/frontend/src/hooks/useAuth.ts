import { useAuthStore } from "@/stores/authStore"

export function useAuth() {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
    refreshToken,
  } = useAuthStore()

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
    refreshToken,
  }
}
