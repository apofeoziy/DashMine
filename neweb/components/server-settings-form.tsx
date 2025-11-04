"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ServerSettingsForm() {
  const [settings, setSettings] = useState({
    startupScript: '"C:\\Program Files\\Java\\jdk-17\\bin\\java.exe" -Dfile.encoding=UTF-8',
    restartOnCrash: true,
    restartAttempts: "3",
    stopCommand: "stop",
  })

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-6">
        <h2 className="mb-6 text-xl font-semibold">Настройки сервера</h2>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Общие настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="startup-script">Скрипт запуска</Label>
              <Input
                id="startup-script"
                value={settings.startupScript}
                onChange={(e) => setSettings({ ...settings, startupScript: e.target.value })}
                className="rounded-xl bg-muted font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="restart-crash">Перезапускать сервер при крахе</Label>
              <Switch
                id="restart-crash"
                checked={settings.restartOnCrash}
                onCheckedChange={(checked) => setSettings({ ...settings, restartOnCrash: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restart-attempts">Кол-во попыток перезапуска</Label>
              <Input
                id="restart-attempts"
                type="number"
                value={settings.restartAttempts}
                onChange={(e) => setSettings({ ...settings, restartAttempts: e.target.value })}
                className="rounded-xl bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop-command">Команда остановки сервера</Label>
              <Input
                id="stop-command"
                value={settings.stopCommand}
                onChange={(e) => setSettings({ ...settings, stopCommand: e.target.value })}
                className="rounded-xl bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Удалить сервер?</Label>
              <Button
                variant="outline"
                className="rounded-xl border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 bg-transparent"
              >
                Удалить
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Button className="mt-8 w-full rounded-xl bg-primary hover:bg-primary/90">Сохранить</Button>
      </Card>
    </div>
  )
}
