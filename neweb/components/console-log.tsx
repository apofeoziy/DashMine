import { Card } from "@/components/ui/card"
import { Terminal } from "lucide-react"

const logs = [
  { time: "14:32:45", message: "[INFO] Player Steve joined the game", type: "info" },
  { time: "14:31:22", message: "[INFO] Player Alex joined the game", type: "info" },
  { time: "14:28:15", message: "[WARN] Can't keep up! Is the server overloaded?", type: "warn" },
  { time: "14:25:03", message: "[INFO] Saving chunks for level 'world'", type: "info" },
  { time: "14:20:18", message: "[INFO] Player Creeper_King joined the game", type: "info" },
]

export function ConsoleLog() {
  return (
    <Card className="rounded-[1.3rem] border-border bg-card p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Console</h3>
        </div>

        <div className="space-y-2 rounded-xl bg-accent p-4 font-mono text-xs">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-3">
              <span className="text-muted-foreground">{log.time}</span>
              <span className={log.type === "warn" ? "text-destructive" : "text-accent-foreground"}>{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
