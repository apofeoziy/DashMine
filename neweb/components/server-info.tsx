import { Card } from "@/components/ui/card"
import { Globe, MapPin, Package } from "lucide-react"

const info = [
  { label: "Version", value: "1.20.4", icon: Package },
  { label: "IP Address", value: "mc.example.com", icon: Globe },
  { label: "Location", value: "US East", icon: MapPin },
]

export function ServerInfo() {
  return (
    <Card className="rounded-[1.3rem] border-border bg-card p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Server Info</h3>
          <p className="text-sm text-muted-foreground">Configuration details</p>
        </div>

        <div className="space-y-4">
          {info.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <item.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium text-card-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
