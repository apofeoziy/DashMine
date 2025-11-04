"use client"

import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { time: "00:00", tps: 20, ram: 4.2 },
  { time: "04:00", tps: 19.8, ram: 5.1 },
  { time: "08:00", tps: 19.5, ram: 6.8 },
  { time: "12:00", tps: 19.2, ram: 7.2 },
  { time: "16:00", tps: 19.8, ram: 6.5 },
  { time: "20:00", tps: 19.9, ram: 6.2 },
]

export function PerformanceMetrics() {
  return (
    <Card className="rounded-[1.3rem] border-border bg-card p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Performance</h3>
          <p className="text-sm text-muted-foreground">Last 24 hours</p>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                }}
              />
              <Line type="monotone" dataKey="tps" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ram" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-5" />
            <span className="text-muted-foreground">TPS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">RAM (GB)</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
