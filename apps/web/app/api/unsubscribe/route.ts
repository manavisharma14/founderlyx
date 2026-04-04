// app/api/unsubscribe/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@repo/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (email) {
    await prisma.contact.updateMany({
      where: { email: decodeURIComponent(email) },
      data: { unsubscribed: true, unsubscribedAt: new Date(), status: "dead" },
    });
  }

  return new Response(
    `<h1>You've been unsubscribed</h1><p>No more emails will be sent.</p>`,
    { headers: { "Content-Type": "text/html" } }
  );
}