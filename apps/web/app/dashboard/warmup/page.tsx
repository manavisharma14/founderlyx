// app/dashboard/warmup/page.tsx — FINAL PRODUCTION VERSION

import { prisma } from '@repo/db';
import { getServerSession } from 'next-auth';
import { FlameKindling, CheckCircle, Zap, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function addWarmupEmails(formData: FormData) {
  'use server';

  const session = await getServerSession();
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return;

  const raw = formData.get('emails') as string;
  if (!raw) return;

  const emails = raw
    .split(/\n|,|\s+/)
    .map(e => e.trim())
    .filter(e => e.includes('@') && e.length > 5);

  if (emails.length === 0) return;

  await prisma.warmupEmail.createMany({
    data: emails.map(email => ({
      userId: user.id,
      email,
    })),
    skipDuplicates: true,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      warmupMode: true,
      warmupStartedAt: new Date(),
      dailySendLimit: 10,
    },
  });

  revalidatePath('/dashboard/warmup');
}

export default async function WarmupPage() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      domain: true,
      warmupMode: true,
      warmupStartedAt: true,
      dailySendLimit: true,
    },
  });

  if (!user) redirect('/login');

  const days = user.warmupStartedAt
    ? Math.floor((Date.now() - user.warmupStartedAt.getTime()) / 86400000)
    : 0;

  const isComplete = days >= 14 || !user.warmupMode;

  const warmupEmails = await prisma.warmupEmail.findMany({
    where: { user: { email: session.user.email } },
    select: { email: true },
  });

  return (
    <div className="max-w-5xl mx-auto py-16 px-6 bg-gray-50 min-h-screen">
      {/* Same light theme UI as before */}
      {/* ... header ... */}

      {isComplete ? (
        <div className="text-center py-20">
          <CheckCircle className="w-28 h-28 text-green-600 mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Warm-up Complete!</h2>
          <p className="text-2xl text-gray-700">300+ emails/day unlocked.</p>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          {/* ... same as before ... */}

          <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-10">
            <div className="text-center mb-8">
              <Zap className="w-9 h-9 text-amber-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">Add your warm-up emails</h2>
              <p className="text-gray-600 mt-3">
                These are <strong>never</strong> used for real campaigns.
              </p>
            </div>

            <form action={addWarmupEmails} className="space-y-8 max-w-2xl mx-auto">
              <textarea
                name="emails"
                rows={9}
                className="w-full px-6 py-5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 resize-none font-mono text-base"
                placeholder="you@gmail.com&#10;you@work.com&#10;friend@company.com"
                required
              />

              <Button type="submit" size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-xl py-8">
                <Mail className="w-7 h-7 mr-3" />
                Add Emails & Start Warm-up
              </Button>
            </form>

            {warmupEmails.length > 0 && (
              <div className="mt-10 text-center">
                <p className="font-medium text-gray-700 mb-3">
                  Warm-up emails ({warmupEmails.length}):
                </p>
                <div className="text-gray-600">
                  {warmupEmails.map(w => w.email).join(', ')}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}