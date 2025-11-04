"use client"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useServerLog } from "@/hooks/use-server-log"
import { useHardware } from "@/hooks/use-hardware"
import { useServer } from "@/hooks/use-server"
import { humanizeFileSize, getProgressGradientColor } from "@/lib/utils-extended"

interface ConsoleContentProps {
  serverName?: string
}

export function ConsoleContent({ serverName = "default" }: ConsoleContentProps) {
  const [command, setCommand] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const { logEntries, loading: logLoading } = useServerLog(serverName, 1000)
  const { usage } = useHardware(serverName, 2000)
  const { sendCommand } = useServer(serverName)

  // Автоскролл вниз при новых логах
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logEntries])

  const handleSendCommand = async () => {
    if (!command.trim()) return

    try {
      await sendCommand(command)
      setCommand("")
    } catch (error) {
      console.error('Failed to send command:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendCommand()
    }
  }

  const cpuPercent = usage?.cpu || 0
  const ramPercent = usage?.ram?.percent || 0
  const cpuColor = getProgressGradientColor(cpuPercent)
  const ramColor = getProgressGradientColor(ramPercent)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Console */}
        <Card className="lg:col-span-2 flex flex-col">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Консоль</h2>
          </div>
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-2 font-mono text-sm">
              {logLoading && logEntries.length === 0 ? (
                <div className="text-muted-foreground">Загрузка логов...</div>
              ) : logEntries.length === 0 ? (
                <div className="text-muted-foreground">Нет логов</div>
              ) : (
                logEntries.map((log, i) => (
                  <div key={i} className="flex gap-3">
                    {log.time && (
                      <span className="text-muted-foreground">{log.time}</span>
                    )}
                    <span
                      className={
                        log.type === "error"
                          ? "text-destructive"
                          : log.type === "warning"
                          ? "text-[#ff9800]"
                          : "text-foreground"
                      }
                    >
                      {log.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите команду..."
                className="flex-1 rounded-xl bg-muted"
              />
              <Button
                size="icon"
                className="rounded-xl bg-primary hover:bg-primary/90"
                onClick={handleSendCommand}
                disabled={!command.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Performance Metrics */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${cpuPercent * 2.51} ${100 * 2.51}`}
                    style={{ stroke: cpuColor }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round(cpuPercent)}%</span>
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground">CPU</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${ramPercent * 2.51} ${100 * 2.51}`}
                    style={{ stroke: ramColor }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round(ramPercent)}%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">RAM</div>
                {usage?.ram && (
                  <div className="text-xs text-muted-foreground">
                    {humanizeFileSize(usage.ram.used)} / {humanizeFileSize(usage.ram.total)}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
