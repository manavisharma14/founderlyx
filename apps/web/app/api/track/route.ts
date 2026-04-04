// app/api/track/open/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@repo/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    await prisma.contact.update({
      where: { id },
      data: { openedAt: new Date() },
    });
  }

  // 1×1 transparent pixel
  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "base64"
  );

  return new Response(pixel, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}