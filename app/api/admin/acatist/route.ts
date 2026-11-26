import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { uniqueFirstNames, buildAcatistHtml } from '@/lib/acatist';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Printable acatist as a normal same-tab HTML page (works in in-app browsers
 * like WhatsApp, which block window.open popups). Auth via admin cookie or ?key.
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!isAdminAuthorized(key)) {
    return new NextResponse('Acces refuzat', { status: 403 });
  }

  const period = req.nextUrl.searchParams.get('period') || 'all';

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let gte: Date | undefined;
  let label: string | undefined;
  if (period === 'week') {
    gte = weekStart;
    label = 'Săptămâna aceasta';
  } else if (period === 'month') {
    gte = monthStart;
    label = 'Luna aceasta';
  } else {
    label = 'Toți ctitorii';
  }

  const donations = await prisma.donation
    .findMany({
      where: {
        status: { in: ['completed', 'self_reported_bank'] },
        ...(gte ? { createdAt: { gte } } : {}),
        donor: { is: { name: { not: null } } },
      },
      include: { donor: true },
      take: 2000,
    })
    .catch(() => [] as any[]);

  const fullNames = donations
    .map((d: any) => d.donor?.name)
    .filter((n: any): n is string => !!n && n.trim().length > 1);
  const names = uniqueFirstNames(fullNames);

  const html = buildAcatistHtml(names, label);
  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
