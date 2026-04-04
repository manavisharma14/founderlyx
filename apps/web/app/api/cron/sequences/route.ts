// app/api/cron/sequences/route.ts

import { prisma } from '@repo/db';
import { resend } from '@/lib/resend';
import { ContactStatus } from '@prisma/client';

const DELAYS = [0, 3, 7, 14]; // days between steps

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function GET() {
  console.log("CRON HIT:", new Date().toISOString());

  const now = new Date();
  let totalProcessed = 0;


  const users = await prisma.user.findMany({
    where: {
      domainVerified: true,
      sendingEnabled: true,
    },
    select: {
      id: true,
      email: true,
      sendingEmail: true,
      warmupMode: true,         // legacy — can deprecate later
      warmupStartedAt: true,
      dailySendLimit: true,
      warmupHealth: true,        // NEW: 0-100 score
      lastWarmupIncrementAt: true
    },
  });

  console.log("USERS FOUND:", users.length);

  

  for (const user of users) {
    let warmupSentToday = false;

    console.log("PROCESSING USER:", user.email);

    // Calculate sent today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sentToday = await prisma.message.count({
      where: {
        direction: 'outbound',
        createdAt: { gte: today },
        contact: { userId: user.id },
      },
    });

    let remainingDaily = user.dailySendLimit - sentToday;
    if (remainingDaily <= 0) {
      console.log("DAILY LIMIT HIT →", user.email);
      continue;
    }

    console.log(`SENT TODAY: ${sentToday}/${user.dailySendLimit} → ${remainingDaily} left`);

 
    console.log(`WARMUP HEALTH: ${user.warmupHealth ?? 0}/100`);

    const targets: {
      email: string;
      name: string;
      company?: string;
      id: string;
      sequenceStep?: number;
      draftOpener?: string | null;
      draftFollowup1?: string | null;
      draftFollowup2?: string | null;
      draftFollowup3?: string | null;
      mode: 'warmup' | 'campaign';
    }[] = [];

    // =====================
    // 1. WARMUP SENDS — Always run if warmup emails exist (ongoing reputation buffer)
    // =====================

    const warmupEmails = await prisma.warmupEmail.findMany({
      where: { userId: user.id },
      select: { email: true },
    });

    if (warmupEmails.length > 0) {
      const daysSinceStart = user.warmupStartedAt
        ? Math.floor((Date.now() - user.warmupStartedAt.getTime()) / 86400000)
        : 0;

      // Gradual ramp: start low, increase safely
      const warmupDailyMax = Math.min(10 + Math.floor(daysSinceStart / 3) * 5, 50);
      const warmupLimit = Math.min(remainingDaily, warmupDailyMax);

      console.log(`WARMUP ACTIVE: ${warmupEmails.length} addresses → sending up to ${warmupLimit}`);

      for (let i = 0; i < warmupLimit && i < warmupEmails.length; i++) {
        const w = warmupEmails[i];
        targets.push({
          email: w.email,
          name: w.email.split('@')[0],
          company: 'Warm-up',
          id: `warmup-${w.email}`,
          sequenceStep: 0,
          draftOpener: null,
          draftFollowup1: null,
          draftFollowup2: null,
          draftFollowup3: null,
          mode: 'warmup',
        });
      }

      remainingDaily -= targets.filter(t => t.mode === 'warmup').length;
    } else {
      console.log("NO WARMUP EMAILS CONFIGURED");
    }

    // =====================
    // 2. REAL CAMPAIGN SENDS — Only if warmup health is good enough
    // =====================
    const warmupHealthy = (user.warmupHealth ?? 0) >= 80; // Adjust threshold as needed (70-85 common)

    if (remainingDaily > 0 && warmupHealthy) {
      const realContacts = await prisma.contact.findMany({
        where: {
          userId: user.id,
          repliedAt: null,
          sequenceStep: { lt: 4 },
          nextSendAt: { lte: now },
        },
        orderBy: { nextSendAt: 'asc' },
        select: {
          id: true,
          email: true,
          name: true,
          company: true,
          sequenceStep: true,
          draftOpener: true,
          draftFollowup1: true,
          draftFollowup2: true,
          draftFollowup3: true,
        },
      });

      const realLimit = Math.min(remainingDaily, 50);
      console.log(`CAMPAIGN UNLOCKED (Health ${user.warmupHealth}/100) → ${realContacts.length} due → sending up to ${realLimit}`);

      for (let i = 0; i < realLimit && i < realContacts.length; i++) {
        const c = realContacts[i];
        targets.push({
          ...c,
          company: c.company || undefined,
          mode: 'campaign',
        });
      }
    } else if (remainingDaily > 0 && !warmupHealthy) {
      console.log(`CAMPAIGN BLOCKED — Warmup health too low (${user.warmupHealth ?? 0}/100). Add warmup emails and wait for better reputation.`);
    }

    // =====================
    // 3. SEND LOOP
    // =====================
    for (const t of targets) {
      const isWarmup = t.mode === 'warmup';
      const step = isWarmup ? 0 : t.sequenceStep || 0;

      const templates = isWarmup
        ? ['Hey {{firstName}}, mind opening this? Just warming up my new email setup.', '', '', '']
        : [
            t.draftOpener ?? '',
            t.draftFollowup1 ?? '',
            t.draftFollowup2 ?? '',
            t.draftFollowup3 ?? '',
          ];

      const html = templates[step]?.trim();
      if (!html) {
        console.log("NO CONTENT FOR STEP:", step, t.email);
        continue;
      }

      const firstName = t.name?.split(' ')[0] || 'there';
      const company = t.company || 'your company';

      const subject = isWarmup
        ? 'Quick email setup test'
        : step === 0
        ? `quick question about ${company}`
        : step === 1
        ? 'just checking in'
        : step === 2
        ? 'one more thing'
        : 'final follow-up';

      const body = html
        .replace(/{{firstName}}/g, firstName)
        .replace(/{{company}}/g, company);

      const finalHtml = `
        ${body}
        <div style="font-size:11px;color:#666;margin-top:40px;text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_URL}/api/unsubscribe?email=${encodeURIComponent(t.email)}">
            Unsubscribe
          </a>
        </div>
        <img src="${process.env.NEXT_PUBLIC_URL}/track/open?id=${t.id}" width="1" height="1" style="display:none" />
      `;

      console.log(`SENDING ${isWarmup ? 'WARMUP' : 'CAMPAIGN'} →`, t.email, subject);

      try {
        const { data, error } = await resend.emails.send({
          from: user.sendingEmail!,
          to: [t.email],
          subject,
          html: finalHtml,
          replyTo: user.sendingEmail!,
          tags: [{ name: 'contact_id', value: t.id.replace(/[^a-zA-Z0-9_-]/g, '') }],
        });

        if (error) {
          console.error("RESEND ERROR →", t.email, error);
          continue;
        }

        console.log("SENT →", t.email, data?.id);

        if(isWarmup){
          warmupSentToday = true;
        }

        

        if (!isWarmup) {
          await prisma.$transaction(async (tx) => {
            await tx.message.create({
              data: {
                contactId: t.id,
                direction: "outbound",
                from: user.sendingEmail!,
                to: t.email,
                subject,
                html: body,
              },
            });

            await tx.contact.update({
              where: { id: t.id },
              data: {
                status: step + 1 >= 4 ? ContactStatus.finished : ContactStatus.sending,
                sequenceStep: step + 1,
                nextSendAt: step + 1 < 4
                  ? new Date(now.getTime() + DELAYS[step + 1] * 86400000)
                  : null,
                sentAt: new Date(),
              },
            });
          });

          console.log("CONTACT UPDATED →", t.email);
        }

        totalProcessed++;
      } catch (e) {
        console.error("SEND FAILED →", t.email, e);
      }

      await new Promise(r => setTimeout(r, 300));
    }
    if(warmupSentToday){
          const alreadyIncrementedToday = 
            user.lastWarmupIncrementAt && 
            isSameDay(user.lastWarmupIncrementAt, new Date());

          if(!alreadyIncrementedToday){
            await prisma.user.update({
              where: {id: user.id},
              data: {
                warmupHealth: {
                  increment:5 
                },
                lastWarmupIncrementAt: new Date()
              }
            })
            await prisma.$executeRaw`
              UPDATE "User"
              SET "warmupHealth" = LEAST("warmupHealth", 100)
              where id = ${user.id}
            `;
            console.log("warmup health + 5", user.email);

          }
        }
  }

  console.log("TOTAL EMAILS SENT TODAY:", totalProcessed);
  return Response.json({ processed: totalProcessed });
}