import { ServerCreationForm } from "@/components/server-creation-form"

export default function CreateServerPage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl p-8">
          <h1 className="mb-8 text-2xl font-semibold text-foreground">Новый сервер</h1>
          <ServerCreationForm />
        </div>
      </div>
    </div>
  )
}
