// components/StatsBar.tsx
import { prisma } from '@repo/db';
import { getServerSession } from 'next-auth';

export default async function StatsBar() {
  const session = await getServerSession();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { dailySendLimit: true },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sentToday = await prisma.message.count({
    where: {
      direction: 'outbound',
      createdAt: { gte: today },
      contact: { user: { email: session.user.email } },
    },
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
        <div className="flex gap-8">
          <span className="text-slate-400">Sent today:</span>
          <span className="font-bold text-white">{sentToday} / {user?.dailySendLimit || 50}</span>
        </div>
        <div className="text-xs text-slate-500">Warm-up active</div>
      </div>
    </div>
  );
}