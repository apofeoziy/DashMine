"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wrench, Loader2 } from "lucide-react"
import { CoresApi, CoresList } from "@/lib/cores-api"
import { JavaApi } from "@/lib/java-api"
import { ServersApi } from "@/lib/servers-api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const serverTypes = [
  { id: "vanilla", name: "Vanilla", color: "bg-green-500" },
  { id: "papermc", name: "PaperMC", color: "bg-blue-400" },
  { id: "folia", name: "Folia (Beta)", color: "bg-cyan-500" },
  { id: "velocity", name: "Velocity (Proxy)", color: "bg-sky-400" },
  { id: "purpurmc", name: "PurpurMC", color: "bg-pink-500" },
  { id: "spigot", name: "Spigot", color: "bg-orange-500" },
]

const versions = [
  "1.21.8",
  "1.21.6",
  "1.21.5",
  "1.21.4",
  "1.20.6",
  "1.20.4",
  "1.20.2",
  "1.20.1",
  "1.19.4",
  "1.5.2",
  "1.6.1",
  "1.6.2",
  "1.6.4",
  "1.7.2",
  "1.7.3",
  "1.7.4",
  "1.7.5",
  "1.7.6",
  "1.7.7",
  "1.7.8",
  "1.7.9",
  "1.7.10",
  "1.8",
  "1.8.1",
  "1.8.2",
  "1.8.3",
  "1.8.4",
  "1.8.5",
  "1.8.6",
  "1.8.7",
  "1.8.8",
  "1.8.9",
  "1.9",
  "1.9.1",
  "1.9.2",
  "1.9.3",
  "1.9.4",
  "1.10",
  "1.10.1",
]

const javaVersions = ["Java 8", "Java 11", "Java 16", "Java 17", "Java 21"]

export function ServerCreationForm() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [serverName, setServerName] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedVersion, setSelectedVersion] = useState("")
  const [selectedJava, setSelectedJava] = useState("")
  const [memory, setMemory] = useState("2")
  const [port, setPort] = useState("25565")
  const [aikarFlags, setAikarFlags] = useState(false)
  
  const [cores, setCores] = useState<CoresList>({})
  const [versions, setVersions] = useState<string[]>([])
  const [javaVersions, setJavaVersions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // Загрузка ядер и Java версий
  useEffect(() => {
    const loadData = async () => {
      try {
        const [coresList, javaData] = await Promise.all([
          CoresApi.getCoresList(),
          JavaApi.getAllJava(),
        ])
        setCores(coresList)
        const allJava = [...javaData.installed, ...javaData.kubek]
        setJavaVersions(allJava)
        if (allJava.length > 0) {
          setSelectedJava(allJava[0])
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Загрузка версий при выборе ядра
  useEffect(() => {
    if (selectedType) {
      const loadVersions = async () => {
        try {
          const coreVersions = await CoresApi.getCoreVersions(selectedType)
          setVersions(coreVersions)
          if (coreVersions.length > 0) {
            setSelectedVersion(coreVersions[0])
          }
        } catch (error) {
          console.error('Failed to load versions:', error)
        }
      }
      loadVersions()
    }
  }, [selectedType])

  const handleCreate = async () => {
    if (!serverName || !selectedType || !selectedVersion || !selectedJava) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      })
      return
    }

    setCreating(true)
    try {
      const startParams = aikarFlags
        ? `-Xms${memory}G -Xmx${memory}G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1`
        : `-Xms${memory}G -Xmx${memory}G`

      await ServersApi.createServer({
        server: serverName,
        core: selectedType,
        coreVersion: selectedVersion,
        javaVersion: selectedJava,
        port,
        startParameters: startParams,
      })

      toast({
        title: "Успешно",
        description: `Сервер ${serverName} создан`,
      })

      router.push('/console')
    } catch (error) {
      console.error('Failed to create server:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось создать сервер",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const serverTypes = Object.entries(cores).map(([id, data]) => ({
    id,
    name: data.name,
    color: 'bg-primary',
  }))

  return (
    <div className="space-y-8">
      {/* Step 1: Server Name */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
            1
          </div>
          <h2 className="text-lg font-medium text-foreground">Имя нового сервера</h2>
        </div>
        <Input
          placeholder="Например, PixelCraft"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="max-w-2xl"
        />
      </div>

      {/* Step 2: Core Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
            2
          </div>
          <h2 className="text-lg font-medium text-foreground">Выбор ядра</h2>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Выбрать из списка</TabsTrigger>
            <TabsTrigger value="upload">Загрузить свой файл</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {serverTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-primary/50 ${
                    selectedType === type.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className={`h-16 w-16 rounded-lg ${type.color}`} />
                  <span className="text-sm font-medium text-foreground">{type.name}</span>
                </button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="upload" className="mt-6">
            <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">Перетащите файл сюда или нажмите для выбора</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Step 3: Version Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
            3
          </div>
          <h2 className="text-lg font-medium text-foreground">Версия ядра</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {versions.map((version) => (
            <button
              key={version}
              onClick={() => setSelectedVersion(version)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                selectedVersion === version
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-card-foreground hover:bg-accent"
              }`}
            >
              {version}
            </button>
          ))}
        </div>
      </div>

      {/* Step 4: Final Settings */}
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
            4
          </div>
          <h2 className="text-lg font-medium text-foreground">Завершающие настройки</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Java Version */}
          <div className="space-y-2">
            <Label htmlFor="java-version">Версия Java</Label>
            <select
              id="java-version"
              value={selectedJava}
              onChange={(e) => setSelectedJava(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {javaVersions.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
            {javaVersions.length === 0 && (
              <p className="text-sm text-destructive">Java не найдена. Установите Java.</p>
            )}
          </div>

          {/* Server Port */}
          <div className="space-y-2">
            <Label htmlFor="port">Порт сервера</Label>
            <Input id="port" type="number" value={port} onChange={(e) => setPort(e.target.value)} />
          </div>
        </div>

        {/* Memory Allocation */}
        <div className="space-y-2">
          <Label htmlFor="memory">Выделенная память</Label>
          <div className="flex items-center gap-3">
            <Input
              id="memory"
              type="number"
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">GB</span>
          </div>
        </div>

        {/* Aikar Flags */}
        <div className="flex items-center space-x-2">
          <Checkbox id="aikar" checked={aikarFlags} onCheckedChange={(checked) => setAikarFlags(checked as boolean)} />
          <label
            htmlFor="aikar"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Применить оптимизацию (Aikar Flags)
          </label>
        </div>
      </div>

      {/* Create Button */}
      <Button
        size="lg"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={!serverName || !selectedType || !selectedVersion || creating || !selectedJava}
        onClick={handleCreate}
      >
        {creating ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Wrench className="mr-2 h-5 w-5" />
        )}
        {creating ? 'Создание...' : `Создать ${serverName || "сервер"}`}
      </Button>
    </div>
  )
}
