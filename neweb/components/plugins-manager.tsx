"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, Loader2 } from "lucide-react"
import { PluginsApi } from "@/lib/plugins-api"
import { useToast } from "@/hooks/use-toast"

interface PluginsManagerProps {
  serverName: string
}

export function PluginsManager({ serverName }: PluginsManagerProps) {
  const { toast } = useToast()
  const [pluginList, setPluginList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const loadPlugins = async () => {
    try {
      const plugins = await PluginsApi.getPlugins(serverName)
      setPluginList(plugins)
    } catch (error) {
      console.error('Failed to load plugins:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список плагинов",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlugins()
  }, [serverName])

  const handleDelete = async (pluginName: string) => {
    try {
      await PluginsApi.deletePlugin(serverName, pluginName)
      toast({
        title: "Успешно",
        description: `Плагин ${pluginName} удален`,
      })
      await loadPlugins()
    } catch (error) {
      console.error('Failed to delete plugin:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить плагин",
        variant: "destructive",
      })
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('server-plugin-input', file)
      
      await PluginsApi.uploadPlugin(serverName, formData)
      toast({
        title: "Успешно",
        description: `Плагин ${file.name} загружен`,
      })
      await loadPlugins()
    } catch (error) {
      console.error('Failed to upload plugin:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить плагин",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Plugins */}
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Плагины</h2>
            <Button size="sm" className="gap-2" disabled={uploading} asChild>
              <label>
                <Upload className="h-4 w-4" />
                {uploading ? 'Загрузка...' : 'Загрузить'}
                <input
                  type="file"
                  accept=".jar"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </Button>
          </div>
          <div className="space-y-2">
            {pluginList.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Плагины не найдены
              </p>
            ) : (
              pluginList.map((plugin, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{plugin}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(plugin)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Modifications */}
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Модификации</h2>
            <Button variant="outline" size="icon" className="rounded-xl bg-transparent">
              <Upload className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">Нет модификаций</div>
        </Card>
      </div>
    </div>
  )
}
