"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { ServersApi } from "@/lib/servers-api"

interface ServerContextType {
  selectedServer: string | null
  setSelectedServer: (server: string) => void
  serversList: string[]
  loading: boolean
  refreshServers: () => Promise<void>
}

const ServerContext = createContext<ServerContextType | undefined>(undefined)

export function ServerProvider({ children }: { children: React.ReactNode }) {
  const [selectedServer, setSelectedServerState] = useState<string | null>(null)
  const [serversList, setServersList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const loadServers = async () => {
    try {
      const servers = await ServersApi.getServersList()
      setServersList(servers)
      
      // Load saved server from localStorage
      const saved = localStorage.getItem("selectedServer")
      if (saved && servers.includes(saved)) {
        setSelectedServerState(saved)
      } else if (servers.length > 0) {
        // If no saved server or it doesn't exist, select first
        setSelectedServerState(servers[0])
        localStorage.setItem("selectedServer", servers[0])
      }
    } catch (error) {
      console.error('Failed to load servers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServers()
  }, [])

  const setSelectedServer = (server: string) => {
    setSelectedServerState(server)
    localStorage.setItem("selectedServer", server)
  }

  const refreshServers = async () => {
    await loadServers()
  }

  return (
    <ServerContext.Provider
      value={{ 
        selectedServer, 
        setSelectedServer, 
        serversList, 
        loading,
        refreshServers 
      }}
    >
      {children}
    </ServerContext.Provider>
  )
}

export function useServerContext() {
  const context = useContext(ServerContext)
  if (context === undefined) {
    throw new Error("useServerContext must be used within a ServerProvider")
  }
  return context
}
