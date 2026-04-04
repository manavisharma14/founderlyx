// app/dashboard/campaigns/page.tsx
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@repo/db"
import WarmupHealthCircle from "@/components/WarmupHealthCircle"
import GenerateDraftsButton from "@/components/GenerateDraftsButton"
import SendCampaignButton from "@/components/SendCampaignButton"
import CampaignPreview from "@/components/CampaignPreview"

export default async function CampaignsPage() {
  const session = await getSession()
  if (!session?.user?.id) redirect("/login")

  const userId = session.user.id

  const [user, readyLeads, sendingLeads, finishedLeads] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { warmupHealth: true },
    }),
    prisma.contact.findMany({ where: { userId, status: "ready" } }),
    prisma.contact.findMany({ where: { userId, status: "sending" } }),
    prisma.contact.findMany({ where: { userId, status: "finished" } }),
  ])

  const healthScore = user?.warmupHealth ?? 0

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Campaigns</h1>
        <p className="text-gray-600 mt-2">
          Generate personalized sequences and launch thoughtful outbound.
        </p>
      </div>

      {/* TOP BAR: Stats + Warmup + Actions */}
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-gray-500">Ready</p>
              <p className="text-3xl font-bold text-blue-600">{readyLeads.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sending</p>
              <p className="text-3xl font-bold text-amber-600">{sendingLeads.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Finished</p>
              <p className="text-3xl font-bold text-green-600">{finishedLeads.length}</p>
            </div>
          </div>

          {/* Warmup Circle */}
          <div className="flex flex-col items-center">
            <WarmupHealthCircle score={healthScore} size="lg" />
            <p className="mt-4 font-medium text-gray-900">Warmup Health</p>
            <p className="text-sm text-gray-600 text-center max-w-xs">
              {healthScore >= 80
                ? "Healthy — campaigns active"
                : healthScore >= 50
                ? "Warming up — almost there!"
                : "Add warmup emails (friends, colleagues) to unlock sending"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 justify-center">
            <GenerateDraftsButton userId={userId} />
            <SendCampaignButton userId={userId} warmupHealth={healthScore} disabled={healthScore < 80} />
          </div>
        </div>
      </div>

      {/* SEQUENCE PREVIEW */}
      <CampaignPreview userId={userId} />
    </div>
  )
}