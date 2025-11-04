/**
 * React хук для работы с логами сервера
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { ServersApi } from '@/lib/servers-api'

export interface LogEntry {
  type: 'info' | 'error' | 'warning'
  text: string
  time: string
}

export function useServerLog(serverName: string, refreshInterval = 1000) {
  const [log, setLog] = useState<string>('')
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const parseLog = useCallback((logText: string): LogEntry[] => {
    if (!logText) return []

    const lines = logText.split('\n').filter((line) => line.trim())
    return lines.map((line) => {
      const timeMatch = line.match(/\[?(\d{2}:\d{2}:\d{2})\]?/)
      const time = timeMatch ? timeMatch[1] : ''

      let type: 'info' | 'error' | 'warning' = 'info'
      if (line.toLowerCase().includes('error') || line.toLowerCase().includes('exception')) {
        type = 'error'
      } else if (line.toLowerCase().includes('warn')) {
        type = 'warning'
      }

      return {
        type,
        text: line,
        time,
      }
    })
  }, [])

  const fetchLog = useCallback(async () => {
    if (!serverName) return

    setLoading(true)
    setError(null)

    try {
      const logText = await ServersApi.getServerLog(serverName)
      setLog(logText)
      setLogEntries(parseLog(logText))
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [serverName, parseLog])

  useEffect(() => {
    fetchLog()

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchLog, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchLog, refreshInterval])

  return { log, logEntries, loading, error, refresh: fetchLog }
}
