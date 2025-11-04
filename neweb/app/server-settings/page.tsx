import { ServerHeader } from "@/components/server-header"
import { ServerSettingsForm } from "@/components/server-settings-form"

export default function ServerSettingsPage() {
  return (
    <div className="flex h-screen flex-col">
      <ServerHeader />
      <div className="flex-1 overflow-auto p-6">
        <ServerSettingsForm />
      </div>
    </div>
  )
}
