"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function ServerPropertiesForm() {
  const [properties, setProperties] = useState({
    serverPort: "25565",
    queryPort: "25565",
    enableQuery: true,
    onlineMode: false,
    motd: "$fads",
  })

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-6">
        <h2 className="mb-6 text-xl font-semibold">Server.properties</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="server-port">server-port</Label>
            <Input
              id="server-port"
              value={properties.serverPort}
              onChange={(e) => setProperties({ ...properties, serverPort: e.target.value })}
              className="rounded-xl bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="query-port">queryport</Label>
            <Input
              id="query-port"
              value={properties.queryPort}
              onChange={(e) => setProperties({ ...properties, queryPort: e.target.value })}
              className="rounded-xl bg-muted"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enable-query">enable-query</Label>
            <Switch
              id="enable-query"
              checked={properties.enableQuery}
              onCheckedChange={(checked) => setProperties({ ...properties, enableQuery: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="online-mode">online-mode</Label>
            <Switch
              id="online-mode"
              checked={properties.onlineMode}
              onCheckedChange={(checked) => setProperties({ ...properties, onlineMode: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motd">motd</Label>
            <Input
              id="motd"
              value={properties.motd}
              onChange={(e) => setProperties({ ...properties, motd: e.target.value })}
              className="rounded-xl bg-muted"
            />
          </div>
        </div>

        <Button className="mt-8 w-full rounded-xl bg-primary hover:bg-primary/90">Сохранить</Button>
      </Card>
    </div>
  )
}
