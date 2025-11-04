import { ServerHeader } from "@/components/server-header"
import { KubekSettingsForm } from "@/components/kubek-settings-form"

export default function KubekSettingsPage() {
  return (
    <div className="flex h-screen flex-col">
      <ServerHeader />
      <div className="flex-1 overflow-auto p-6">
        <KubekSettingsForm />
      </div>
    </div>
  )
}
