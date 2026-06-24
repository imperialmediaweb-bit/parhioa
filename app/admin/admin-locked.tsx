import { isAdminConfigured } from '@/lib/admin-auth';

/**
 * Shown whenever an admin route rejects the request. The "configure
 * ADMIN_KEY" notice appears ONLY here (the locked screen), never next to
 * real data — so a misconfigured deploy is locked, not leaking.
 */
export function AdminLocked() {
  const configured = isAdminConfigured();
  return (
    <div className="container py-24 max-w-md mx-auto text-center">
      <div className="text-4xl mb-4">🔒</div>
      <h1 className="font-display text-2xl text-burgundy mb-3">Acces restricționat</h1>
      <p className="text-ink-muted text-sm">
        Această zonă este disponibilă doar administratorilor parohiei.
      </p>
      {!configured && (
        <p className="mt-6 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          ⚠️ <strong>ADMIN_KEY</strong> nu este setat în variabilele de mediu.
          Panoul rămâne blocat până când administratorul îl configurează în
          Railway.
        </p>
      )}
    </div>
  );
}
