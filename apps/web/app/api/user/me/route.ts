import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@repo/db'

export async function GET() {
  const session = await getSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      sendingEmail: true,
      domain: true,
      domainVerified: true
    }
  })

  return NextResponse.json(user)
}