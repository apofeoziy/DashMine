/**
 * React хук для мониторинга железа
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { HardwareApi, HardwareUsage } from '@/lib/hardware-api'

export function useHardware(serverName?: string, refreshInterval = 2000) {
  const [usage, setUsage] = useState<HardwareUsage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchUsage = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await HardwareApi.getUsage(serverName)
      setUsage(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [serverName])

  useEffect(() => {
    fetchUsage()

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchUsage, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchUsage, refreshInterval])

  return { usage, loading, error, refresh: fetchUsage }
}
