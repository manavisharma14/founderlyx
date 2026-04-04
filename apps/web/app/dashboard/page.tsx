import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import TopStatusBar from "@/components/TopStatusBar";
import DomainStatusCard from "@/components/DomainStatusCard";
import ActivityLog from "@/components/ActivityLog";
import { prisma } from "@repo/db";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const contacts = await prisma.contact.findMany({
    where: { userId: session.user.id },
  });

  // ✅ SAFE DNS ARRAY CAST (FIXES `.some()` ERROR)
  const dns = Array.isArray(user?.dnsRecords)
    ? (user.dnsRecords as any[])
    : [];

  // ✅ REAL DOMAIN AUTH STATES
  const spf = dns.some(
    r => r.type === "TXT" && r.value.includes("spf1") && r.status === "verified"
  );

  const dkim1 = dns.some(
    r => r.type === "TXT" && r.name.includes("domainkey") && r.status === "verified"
  );

  const dkim2 = false; // ✅ Resend only issues ONE DKIM

  const dmarc = dns.some(
    r => r.type === "TXT" && r.name.includes("_dmarc") && r.status === "verified"
  );

  const sentToday = contacts.filter(c => c.status === "sending").length;
  const replied = contacts.filter(c => c.status === "replied").length;

  return (
    <div className="space-y-10">

      {/* ✅ LIVE DELIVERY METRICS */}
      <TopStatusBar
        domainVerified={user?.domainVerified ?? false}
        sendingEnabled={user?.sendingEnabled ?? false}
        sentToday={sentToday}
      />

      {/* ✅ REAL DOMAIN AUTH STATE */}
      <DomainStatusCard
        domain={user?.domain}
        spf={spf}
        dkim1={dkim1}
        dkim2={dkim2}
        dmarc={dmarc}
      />

      {/* ✅ ACTIVITY FEED */}
      <ActivityLog
        logs={[
          `Sent today: ${sentToday}`,
          `Replies received: ${replied}`,
          user?.domainVerified ? "Domain verified" : "Domain pending verification",
          "Campaign started",
        ]}
      />

    </div>
  );
}