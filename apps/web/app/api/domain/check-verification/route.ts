import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@repo/db";
import { resend } from "@/lib/resend";

export async function GET() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ verified: false })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user?.resendDomainId || !user.domain || !Array.isArray(user.dnsRecords)) {
    return NextResponse.json({ verified: false })
  }

  // if already verified, never hit Resend again
  if (user.domainVerified === true) {
    const spf = user.dnsRecords.some(
      (r: any) => r.type === "TXT" && r.value.includes("spf1")
    )

    const dkim1 = user.dnsRecords.some(
      (r: any) => r.type === "TXT" && r.name.includes("domainkey")
    )

    return NextResponse.json({
      verified: true,
      domain: user.domain,
      email: user.sendingEmail,
      dns: user.dnsRecords,
      spf,
      dkim1,
    })
  }

  
  //  LIVE CHECK ONLY WHILE NOT VERIFIED
  const { data } = await resend.domains.get(user.resendDomainId)
  if (!data?.records) {
    return NextResponse.json({ verified: false })
  }

  const updatedRecords = user.dnsRecords.map((r: any) => {
    const matched = data.records.some(
      (live: any) =>
        live.type.toUpperCase() === r.type &&
        live.name === r.name &&
        live.value === r.value
    )

    return { ...r, status: matched ? "verified" : "pending" }
  })

  const spf = updatedRecords.some(
    r => r.type === "TXT" && r.value.includes("spf1") && r.status === "verified"
  )

  const dkim1 = updatedRecords.some(
    r => r.type === "TXT" && r.name.includes("domainkey") && r.status === "verified"
  )

  const verified = spf && dkim1

  if (verified) {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        domainVerified: true,
        sendingEnabled: true,
        dnsRecords: updatedRecords,
      },
    })
  }

  return NextResponse.json({
    verified,
    domain: user.domain,
    email: user.sendingEmail,
    dns: updatedRecords,
    spf,
    dkim1,
  })
}