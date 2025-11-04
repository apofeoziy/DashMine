"use client"

import { ConsoleContent } from "@/components/console-content"
import { ServerHeader } from "@/components/server-header"
import { useServerContext } from "@/contexts/server-context"

export default function ConsolePage() {
  const { selectedServer, loading } = useServerContext()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    )
  }

  if (!selectedServer) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Серверы не найдены. Создайте сервер.</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <ServerHeader serverName={selectedServer} />
      <ConsoleContent serverName={selectedServer} />
    </div>
  )
}
