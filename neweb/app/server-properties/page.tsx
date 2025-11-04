import { ServerHeader } from "@/components/server-header"
import { ServerPropertiesForm } from "@/components/server-properties-form"

export default function ServerPropertiesPage() {
  return (
    <div className="flex h-screen flex-col">
      <ServerHeader />
      <div className="flex-1 overflow-auto p-6">
        <ServerPropertiesForm />
      </div>
    </div>
  )
}
