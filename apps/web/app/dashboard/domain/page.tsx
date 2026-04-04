import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import DomainSetup from "@/components/DomainSetup"

export default async function DomainPage() {
  const session = await getSession()

  if (!session?.user?.email) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-8 py-16">

        {/* HEADER */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-black mb-4 text-gray-900">
            Domain Setup
          </h1>
          <p className="text-lg text-gray-600">
            Verify your sending domain to unlock inbox delivery
          </p>
        </div>

        {/* DOMAIN FLOW */}
        <DomainSetup />

      </div>
    </div>
  )
}