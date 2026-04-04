import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@repo/db'
import { getSession } from '@/lib/auth'
import { ContactStatus } from "@prisma/client"   

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "not authenticated" }, { status: 404 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const validStatuses = [  
    "new",
    "ready",
    "sending",
    "replied",
    "interested",
    "meeting_booked",
    "finished",
    "dead",
    "unsubscribed" ] as const

  const statusFilter =
    status && validStatuses.includes(status as any)
      ? (status as ContactStatus)
      : undefined

  const contacts = await prisma.contact.findMany({
    where: {
      userId: session.user.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
      company: true,
      status: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(contacts, { status: 200 })
}

