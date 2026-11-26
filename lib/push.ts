import webpush from 'web-push';
import { prisma } from './prisma';

const PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const PRIVATE = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT || 'mailto:contact@parohiasfteodoradelasihla.ro';

let configured = false;
function ensure(): boolean {
  if (configured) return true;
  if (!PUBLIC || !PRIVATE) return false;
  webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE);
  configured = true;
  return true;
}

export function isPushConfigured(): boolean {
  return !!(PUBLIC && PRIVATE);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * Send a notification to every subscriber. Dead subscriptions (410/404) are
 * pruned automatically. Returns how many were delivered / removed.
 */
export async function sendPushToAll(
  payload: PushPayload,
): Promise<{ sent: number; removed: number; total: number }> {
  if (!ensure()) return { sent: 0, removed: 0, total: 0 };

  const subs = await prisma.pushSubscription.findMany();
  const data = JSON.stringify({
    title: payload.title.slice(0, 120),
    body: payload.body.slice(0, 300),
    url: payload.url || '/',
  });

  let sent = 0;
  const dead: number[] = [];

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          data,
        );
        sent++;
      } catch (err: any) {
        const code = err?.statusCode;
        if (code === 404 || code === 410) dead.push(s.id);
      }
    }),
  );

  if (dead.length) {
    await prisma.pushSubscription
      .deleteMany({ where: { id: { in: dead } } })
      .catch(() => {});
  }

  return { sent, removed: dead.length, total: subs.length };
}
