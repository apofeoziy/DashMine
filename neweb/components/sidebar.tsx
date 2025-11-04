"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Terminal, FolderOpen, Puzzle, Settings, Code, Gauge, Plus, Cable as Cube, Server } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useServerContext } from "@/contexts/server-context"

const navigation = [
  { name: "Консоль", href: "/console", icon: Terminal },
  { name: "Файловый менеджер", href: "/files", icon: FolderOpen },
  { name: "Плагины и модификации", href: "/plugins", icon: Puzzle },
  { name: "Настройки сервера", href: "/server-settings", icon: Settings },
  { name: "Server.properties", href: "/server-properties", icon: Code },
  { name: "Настройки Kubek", href: "/kubek-settings", icon: Settings },
  { name: "Мониторинг системы", href: "/monitoring", icon: Gauge },
]

export function Sidebar() {
  const pathname = usePathname()
  const { serversList, selectedServer, setSelectedServer, loading } = useServerContext()

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Cube className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground">DashMine</span>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          {/* Create Server Button */}
          <Link href="/create-server">
            <Button
              variant="outline"
              className="mb-4 w-full justify-start gap-2 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Создать сервер
            </Button>
          </Link>

          {/* Server List */}
          <div className="mb-6">
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              Серверы
            </div>
            <div className="space-y-1">
              {loading ? (
                <div className="px-3 py-2 text-sm text-sidebar-foreground/50">
                  Загрузка...
                </div>
              ) : serversList.length === 0 ? (
                <div className="px-3 py-2 text-sm text-sidebar-foreground/50">
                  Нет серверов
                </div>
              ) : (
                serversList.map((server) => (
                  <button
                    key={server}
                    onClick={() => setSelectedServer(server)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      selectedServer === server
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Server className="h-4 w-4" />
                    <span className="truncate">{server}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  )
}
