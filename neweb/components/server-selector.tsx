"use client"

import { useEffect, useState } from "react"
import { ServersApi } from "@/lib/servers-api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ServerSelectorProps {
  onServerChange: (server: string) => void
  selectedServer: string | null
}

export function ServerSelector({ onServerChange, selectedServer }: ServerSelectorProps) {
  const [servers, setServers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServers = async () => {
      try {
        const serversList = await ServersApi.getServersList()
        setServers(serversList)
        if (serversList.length > 0 && !selectedServer) {
          onServerChange(serversList[0])
        }
      } catch (error) {
        console.error('Failed to load servers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadServers()
  }, [])

  if (loading) {
    return <div className="text-sm text-muted-foreground">Загрузка...</div>
  }

  if (servers.length === 0) {
    return (
      <div className="text-sm text-destructive">
        Серверы не найдены. Создайте сервер в панели управления.
      </div>
    )
  }

  return (
    <Select value={selectedServer || undefined} onValueChange={onServerChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Выберите сервер" />
      </SelectTrigger>
      <SelectContent>
        {servers.map((server) => (
          <SelectItem key={server} value={server}>
            {server}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
