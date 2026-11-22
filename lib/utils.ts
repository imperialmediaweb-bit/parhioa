import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Remove emoji / pictographs (and their variation selectors, ZWJ and flag
 * pairs) from text imported from Facebook, so titles and excerpts read cleanly.
 * Collapses the leftover double spaces and spaces before punctuation.
 */
export function stripEmoji(s?: string | null): string {
  if (!s) return '';
  return s
    .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/[️‍⃣]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?…])/g, '$1')
    .trim();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRo(date: Date | string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
