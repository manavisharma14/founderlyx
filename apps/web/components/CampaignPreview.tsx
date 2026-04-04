// components/CampaignPreview.tsx
import { prisma } from "@repo/db"

export default async function CampaignPreview({ userId }: { userId: string }) {
  const sample = await prisma.contact.findFirst({
    where: { userId, status: "ready" },
  })

  if (!sample) {
    return (
      <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
        No drafts generated yet. Upload leads and click “Generate Drafts”.
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-2xl p-8 space-y-6 shadow-sm">
      <h2 className="text-xl font-semibold">Sequence Preview</h2>

      <PreviewBlock title="Opener" text={sample.draftOpener} />
      <PreviewBlock title="Day 3 Follow-up" text={sample.draftFollowup1} />
      <PreviewBlock title="Day 7 Follow-up" text={sample.draftFollowup2} />
      <PreviewBlock title="Day 14 Follow-up" text={sample.draftFollowup3} />
    </div>
  )
}

function PreviewBlock({ title, text }: { title: string; text?: string | null }) {
  return (
    <div className="border rounded-xl p-5 bg-gray-50">
      <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      <p className="text-gray-900 whitespace-pre-line">
        {text || "Not generated yet"}
      </p>
    </div>
  )
}