import { useState, useEffect } from 'react'
import { socketManager } from '@/lib/socket'
import { useAuth } from '@/hooks/useAuth'

export function useConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected')
  
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setConnectionStatus('disconnected')
      return
    }

    const socket = socketManager.getSocket()
    if (!socket) {
      setConnectionStatus('disconnected')
      return
    }

    const handleConnect = () => setConnectionStatus('connected')
    const handleDisconnect = () => setConnectionStatus('disconnected')
    const handleConnecting = () => setConnectionStatus('connecting')

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connecting', handleConnecting)

    // Set initial status
    if (socket.connected) {
      setConnectionStatus('connected')
    } else {
      setConnectionStatus('disconnected')
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connecting', handleConnecting)
    }
  }, [isAuthenticated])

  return connectionStatus
}