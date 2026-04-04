// app/api/email/send/route.ts 
import { NextRequest, NextResponse } from 'next/server'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { prisma } from '@repo/db'
import { getSession } from '@/lib/auth'
import crypto from 'crypto'

const ses = new SESClient({ region: 'us-east-1' })

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { from, subject, htmlTemplate, contacts } = await req.json()

  if (!from || !subject || !htmlTemplate || !Array.isArray(contacts)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const results = { sent: 0, failed: 0 }

  for (const contact of contacts) {
    const { id, email, firstName, company } = contact
    if (!email || !id) continue

    // GENERATE UNIQUE REPLY-TO 
    const uniqueId = crypto.randomUUID().replace(/-/g, '').slice(0, 20)
    const domain = from.split('@')[1]  
    const uniqueReplyTo = `${uniqueId}@${domain}`

    let personalizedHtml = htmlTemplate
      .replace(/{{firstName}}/g, firstName || 'there')
      .replace(/{{company}}/g, company || 'your company')

    const pixelUrl = `${process.env.NEXT_PUBLIC_URL}/api/email/track?id=${id}`
    personalizedHtml += `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none" />`

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`
    personalizedHtml += `<div style="font-size:11px;color:#999;margin-top:30px;"><a href="${unsubscribeUrl}">Unsubscribe</a></div>`

    const command = new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [email] },
      ConfigurationSetName: 'founderlyx-events',
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: personalizedHtml } },
      },
      ReplyToAddresses: [uniqueReplyTo],
      Tags: [
        { Name: 'user-id', Value: session.user.id },
        { Name: 'contact-id', Value: id.toString() },
      ],
    })

    try {
      await ses.send(command)

      await prisma.contact.update({
        where: { id },
        data: {
          status: 'sending',
          sendingAddress: uniqueReplyTo, 
          sentAt: new Date(),
        },
      })

      results.sent++
    } catch (error: any) {
      console.error('Send failed →', email, error.message)
      results.failed++
    }
    await new Promise(r => setTimeout(r, 100))
  }
  return NextResponse.json({ success: true, ...results })
}
