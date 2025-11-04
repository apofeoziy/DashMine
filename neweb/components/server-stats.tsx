import { Card } from "@/components/ui/card"
import { Users, Activity, Zap, HardDrive } from "lucide-react"

const stats = [
  {
    label: "Players Online",
    value: "24",
    max: "100",
    icon: Users,
    color: "text-chart-1",
  },
  {
    label: "Server Status",
    value: "Online",
    subtext: "99.9% uptime",
    icon: Activity,
    color: "text-chart-3",
  },
  {
    label: "TPS",
    value: "19.8",
    max: "20.0",
    icon: Zap,
    color: "text-chart-5",
  },
  {
    label: "RAM Usage",
    value: "6.2 GB",
    max: "16 GB",
    icon: HardDrive,
    color: "text-chart-2",
  },
]

export function ServerStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-[1.3rem] border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
                {stat.max && <span className="text-sm text-muted-foreground">/ {stat.max}</span>}
              </div>
              {stat.subtext && <p className="text-xs text-muted-foreground">{stat.subtext}</p>}
            </div>
            <div className={`rounded-xl bg-accent p-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
