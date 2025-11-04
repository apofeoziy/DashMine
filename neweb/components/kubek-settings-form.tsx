"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Plus, User } from "lucide-react"

export function KubekSettingsForm() {
  const [ftpSettings, setFtpSettings] = useState({
    ftpEnabled: false,
    login: "kubek",
    password: "****",
    port: "21",
  })

  const [generalSettings, setGeneralSettings] = useState({
    language: "russian",
    port: "3000",
    subnetAccess: false,
    subnets: "10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16\n100.64.0.0/10\n127.0.0.1/32",
  })

  const [authSettings, setAuthSettings] = useState({
    authEnabled: true,
    users: ["kubek"],
  })

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-6">
        <h2 className="mb-6 text-xl font-semibold">Настройки Kubek</h2>

        <Tabs defaultValue="ftp" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="ftp">Настройки FTP</TabsTrigger>
            <TabsTrigger value="general">Общие настройки</TabsTrigger>
            <TabsTrigger value="auth">Настройки авторизации</TabsTrigger>
          </TabsList>

          <TabsContent value="ftp" className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="ftp-enabled">FTP-сервер включён</Label>
              <Switch
                id="ftp-enabled"
                checked={ftpSettings.ftpEnabled}
                onCheckedChange={(checked) => setFtpSettings({ ...ftpSettings, ftpEnabled: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ftp-login">Логин</Label>
              <Input
                id="ftp-login"
                value={ftpSettings.login}
                onChange={(e) => setFtpSettings({ ...ftpSettings, login: e.target.value })}
                className="rounded-xl bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ftp-password">Пароль</Label>
              <Input
                id="ftp-password"
                type="password"
                value={ftpSettings.password}
                onChange={(e) => setFtpSettings({ ...ftpSettings, password: e.target.value })}
                className="rounded-xl bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ftp-port">Порт</Label>
              <Input
                id="ftp-port"
                value={ftpSettings.port}
                onChange={(e) => setFtpSettings({ ...ftpSettings, port: e.target.value })}
                className="rounded-xl bg-muted"
              />
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <div className="space-y-3">
              <Label>Язык интерфейса</Label>
              <RadioGroup
                value={generalSettings.language}
                onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}
              >
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="english" id="english" />
                    <Label htmlFor="english" className="cursor-pointer">
                      English
                    </Label>
                    <span className="text-xs text-muted-foreground">by apofeoziy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="japanese" id="japanese" />
                    <Label htmlFor="japanese" className="cursor-pointer">
                      日本語
                    </Label>
                    <span className="text-xs text-muted-foreground">by Rin-od</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="russian" id="russian" />
                    <Label htmlFor="russian" className="cursor-pointer">
                      Русский
                    </Label>
                    <span className="text-xs text-muted-foreground">by apofeoziy</span>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kubek-port">Порт Kubek (веб-интерфейса)</Label>
              <Input
                id="kubek-port"
                value={generalSettings.port}
                onChange={(e) => setGeneralSettings({ ...generalSettings, port: e.target.value })}
                className="rounded-xl bg-muted"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="subnet-access">Доступ только по списку подсетей</Label>
              <Switch
                id="subnet-access"
                checked={generalSettings.subnetAccess}
                onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, subnetAccess: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subnets">Список подсетей (для продвинутых)</Label>
              <Textarea
                id="subnets"
                value={generalSettings.subnets}
                onChange={(e) => setGeneralSettings({ ...generalSettings, subnets: e.target.value })}
                className="min-h-32 rounded-xl bg-muted font-mono text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="auth-enabled">Авторизация включена</Label>
              <Switch
                id="auth-enabled"
                checked={authSettings.authEnabled}
                onCheckedChange={(checked) => setAuthSettings({ ...authSettings, authEnabled: checked })}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Список пользователей</Label>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl bg-transparent">
                  <Plus className="h-4 w-4" />
                  Добавить новый аккаунт
                </Button>
              </div>

              {authSettings.users.map((user, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{user}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Button className="mt-8 w-full rounded-xl bg-primary hover:bg-primary/90">Сохранить</Button>
      </Card>
    </div>
  )
}
