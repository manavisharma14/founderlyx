import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@repo/db";
import { resend } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await request.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const cleanEmail = email.trim().toLowerCase();
  const domain = cleanEmail.split("@")[1];

  const existing = await prisma.user.findFirst({
    where: { domain },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Domain already in use" },
      { status: 409 }
    );
  }

  const { data, error } = await resend.domains.create({ name: domain });

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Resend error" },
      { status: 500 }
    );
  }

  //  Normalize & store DNS records
  const dnsRecords = data.records.map((r: any) => ({
    type: r.type.toUpperCase(),   // TXT / CNAME / MX
    name: r.name,
    value: r.value,
    status: "pending",           // pending | verified
  }));

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      sendingEmail: cleanEmail,
      domain,
      resendDomainId: data.id,
      dnsRecords,
      domainVerified: false,
      sendingEnabled: false,
    },
  });

  return NextResponse.json({
    success: true,
    email: cleanEmail,
    domain,
    dns: dnsRecords,
  });
}