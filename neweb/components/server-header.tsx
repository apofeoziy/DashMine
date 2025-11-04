"use client"

import { Cable as Cube, Play, StopCircle, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useServer } from "@/hooks/use-server"
import { useToast } from "@/hooks/use-toast"

interface ServerHeaderProps {
  serverName: string
}

export function ServerHeader({ serverName }: ServerHeaderProps) {
  const { serverInfo, startServer, stopServer, restartServer, loading } = useServer(serverName)
  const { toast } = useToast()

  const handleStart = async () => {
    try {
      await startServer()
      toast({
        title: "Сервер запускается",
        description: `${serverName} начал запуск`,
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось запустить сервер",
        variant: "destructive",
      })
    }
  }

  const handleStop = async () => {
    try {
      await stopServer()
      toast({
        title: "Сервер останавливается",
        description: `${serverName} останавливается`,
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось остановить сервер",
        variant: "destructive",
      })
    }
  }

  const handleRestart = async () => {
    try {
      await restartServer()
      toast({
        title: "Сервер перезапускается",
        description: `${serverName} перезапускается`,
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось перезапустить сервер",
        variant: "destructive",
      })
    }
  }

  const status = serverInfo?.status || 'stopped'
  const statusConfig = {
    running: { color: 'bg-green-500', label: 'Работает' },
    stopped: { color: 'bg-destructive', label: 'Остановлен' },
    starting: { color: 'bg-yellow-500', label: 'Запускается' },
    stopping: { color: 'bg-orange-500', label: 'Останавливается' },
  }

  const currentStatus = statusConfig[status] || statusConfig.stopped

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Cube className="h-6 w-6 text-primary" />
        </div>
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {serverInfo?.name || serverName}
            </h1>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${currentStatus.color}`} />
              <span className="text-sm text-muted-foreground">
                {currentStatus.label}
              </span>
              {serverInfo?.players && (
                <span className="text-sm text-muted-foreground ml-2">
                  • {serverInfo.players.online}/{serverInfo.players.max} игроков
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {status === 'running' && (
          <>
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={handleRestart}
              disabled={loading}
            >
              <RotateCw className="h-4 w-4" />
              Перезапустить
            </Button>
            <Button
              variant="destructive"
              className="gap-2 rounded-xl"
              onClick={handleStop}
              disabled={loading}
            >
              <StopCircle className="h-4 w-4" />
              Остановить
            </Button>
          </>
        )}
        {status === 'stopped' && (
          <Button
            className="gap-2 rounded-xl bg-primary hover:bg-primary/90"
            onClick={handleStart}
            disabled={loading}
          >
            <Play className="h-4 w-4" />
            Запустить
          </Button>
        )}
        {(status === 'starting' || status === 'stopping') && (
          <Button className="gap-2 rounded-xl" disabled>
            {status === 'starting' ? 'Запускается...' : 'Останавливается...'}
          </Button>
        )}
      </div>
    </header>
  )
}
