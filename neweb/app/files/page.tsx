"use client"

import { ServerHeader } from "@/components/server-header"
import { FileManager } from "@/components/file-manager"
import { useServerContext } from "@/contexts/server-context"

export default function FilesPage() {
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
    <div className="flex h-screen flex-col">
      <ServerHeader serverName={selectedServer} />
      <div className="flex-1 overflow-auto">
        <FileManager serverName={selectedServer} />
      </div>
    </div>
  )
}
