// app/api/messages/[contactId]/route.ts
import { prisma } from '@repo/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contactId: string }> }  
) {
  const { contactId } = await params  

  const messages = await prisma.message.findMany({
    where: { contactId },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(messages)
}