/**
 * React хук для работы с серверами
 */

import { useState, useEffect, useCallback } from 'react'
import { ServersApi, ServerInfo } from '@/lib/servers-api'

export function useServer(serverName?: string) {
  const [server, setServer] = useState<string | null>(serverName || null)
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchServerInfo = useCallback(async () => {
    if (!server) return

    setLoading(true)
    setError(null)

    try {
      const info = await ServersApi.getServerInfo(server)
      setServerInfo(info)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [server])

  const sendCommand = useCallback(
    async (cmd: string) => {
      if (!server) return

      try {
        await ServersApi.sendCommand(server, cmd)
      } catch (err) {
        setError(err as Error)
        throw err
      }
    },
    [server]
  )

  const startServer = useCallback(async () => {
    if (!server) return

    try {
      await ServersApi.startServer(server)
      await fetchServerInfo()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [server, fetchServerInfo])

  const stopServer = useCallback(async () => {
    if (!server) return

    try {
      await ServersApi.stopServer(server)
      await fetchServerInfo()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [server, fetchServerInfo])

  const restartServer = useCallback(async () => {
    if (!server) return

    try {
      await ServersApi.restartServer(server)
      await fetchServerInfo()
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }, [server, fetchServerInfo])

  useEffect(() => {
    if (server) {
      fetchServerInfo()
    }
  }, [server, fetchServerInfo])

  return {
    server,
    setServer,
    serverInfo,
    loading,
    error,
    sendCommand,
    startServer,
    stopServer,
    restartServer,
    refresh: fetchServerInfo,
  }
}

export function useServersList() {
  const [servers, setServers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchServers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const serversList = await ServersApi.getServersList()
      setServers(serversList)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServers()
  }, [fetchServers])

  return { servers, loading, error, refresh: fetchServers }
}
