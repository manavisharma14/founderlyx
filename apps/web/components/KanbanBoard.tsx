import { prisma } from "@repo/db"
import KanbanClient from "./KanbanClient"

export default async function KanbanBoard({ userId }: { userId: string }) {
  const contacts = await prisma.contact.findMany({
    where: { userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  })

  return <KanbanClient contacts={contacts} />
}