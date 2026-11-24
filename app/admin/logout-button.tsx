'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';

/** Ends the admin session (clears the cookie) and returns to the login screen. */
export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const logout = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {}
    window.location.replace('/admin');
  };
  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-burgundy hover:text-burgundy transition disabled:opacity-50"
    >
      <LogOut className="h-3.5 w-3.5" />
      {loading ? 'Se iese…' : 'Ieși'}
    </button>
  );
}
