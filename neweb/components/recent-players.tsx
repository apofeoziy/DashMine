import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const players = [
  { name: "Steve", status: "online", time: "2h 34m", avatar: "/minecraft-steve.jpg" },
  { name: "Alex", status: "online", time: "1h 12m", avatar: "/minecraft-alex.jpg" },
  { name: "Creeper_King", status: "online", time: "45m", avatar: "/minecraft-creeper.png" },
  { name: "Diamond_Miner", status: "offline", time: "3h ago", avatar: "/minecraft-diamond.png" },
  { name: "Enderman_Pro", status: "offline", time: "5h ago", avatar: "/minecraft-enderman.png" },
]

export function RecentPlayers() {
  return (
    <Card className="rounded-[1.3rem] border-border bg-card p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Recent Players</h3>
          <p className="text-sm text-muted-foreground">Last 24 hours</p>
        </div>

        <div className="space-y-3">
          {players.map((player) => (
            <div key={player.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{player.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${player.status === "online" ? "bg-chart-3" : "bg-muted"}`} />
                <span className="text-xs text-muted-foreground capitalize">{player.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
