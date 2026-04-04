// app/api/send-reply/route.ts
import { prisma } from "@repo/db";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {

    const body = await req.json();

console.log("SEND REPLY PAYLOAD:", body);

const { contactId, text, sendingAddress, to } = body;

    if (!contactId || !text || !sendingAddress || !to) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ Get original subject for proper threading
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        messages: {
          where: { direction: "outbound" },
          orderBy: { createdAt: "asc" },
          take: 1,
        },
      },
    });

    const subject =
      contact?.messages?.[0]?.subject
        ? `Re: ${contact.messages[0].subject}`
        : "Re: your email";

    //  SEND VIA RESEND
    await resend.emails.send({
      from: sendingAddress,        //  your verified domain sender
      to: [to],
      subject,
      html: text.replace(/\n/g, "<br>"),
      replyTo: sendingAddress,     // ✅ critical for inbound reply threading
    });

    // ✅ SAVE OUTBOUND MESSAGE
    await prisma.message.create({
      data: {
        contactId,
        direction: "outbound",
        from: sendingAddress,
        to,
        subject,
        text,
        html: text.replace(/\n/g, "<br>"),
      },
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error("Reply send failed:", err);
    return Response.json({ error: "Failed to send reply" }, { status: 500 });
  }
}