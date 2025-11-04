import { ServerHeader } from "@/components/server-header"
import { Card } from "@/components/ui/card"

export default function MonitoringPage() {
  return (
    <div className="flex h-screen flex-col">
      <ServerHeader />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Мониторинг системы</h2>
            <p className="text-sm text-muted-foreground">
              Здесь будет отображаться информация о системных ресурсах и производительности сервера.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
