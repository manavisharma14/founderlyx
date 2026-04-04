// app/api/webhook/resend/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@repo/db";
import { ContactStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const events = await req.json();
  const list = Array.isArray(events) ? events : [events];

  for (const event of list) {
    const { type, data } = event;

    if (type === 'email.bounced' || type === 'email.complained') {
      await prisma.contact.updateMany({
        where: { email: data.to },
        data: { status: ContactStatus.dead },
      });
    }

    if (type === 'email.opened') {
      const contactId = data.tags?.find((t: any) => t.name === 'contact-id')?.value;
      if (contactId) {
        await prisma.contact.update({
          where: { id: contactId },
          data: { openedAt: new Date() },
        });
      }
    }

    if (type === "email.received") {
      const contact = await prisma.contact.findFirst({
        where: {
          email: data.from,
          sendingAddress: data.to,
        },
      });
    
      if (!contact) {
        console.log("Reply received but no contact matched:", data.from);
        continue;
      }

      await prisma.$transaction([
        prisma.message.create({
          data: {
            id: data.id,
            contactId: contact.id,
            direction: "inbound",
            from: data.from,
            to: data.to,
            subject: data.subject || "Re: your email",
            text: data.text || "",
            html: data.html,
          },
        }),
        prisma.contact.update({
          where: { id: contact.id },
          data: {
            status: ContactStatus.replied,
            repliedAt: new Date(),
            nextSendAt: null,
            sequenceStep: 999,
          },
        }),
      ]);
    }
  }

  return Response.json({ success: true });
}