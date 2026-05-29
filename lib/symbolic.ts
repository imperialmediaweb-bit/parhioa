/**
 * Symbolic translation of RON donations into Orthodox-coded units
 * (bricks, foundation stones, beams, stained-glass windows, icons).
 *
 * Used by the church progress visualization, the donor list, and the
 * symbolic-stats medallions on the campaign page.
 */

export type SymbolicUnit = 'caramizi' | 'pietre' | 'grinzi' | 'vitralii' | 'icoane';

export const TIER_VALUES: Record<SymbolicUnit, number> = {
  caramizi: 10,
  pietre: 50,
  grinzi: 100,
  vitralii: 250,
  icoane: 500,
};

export function ronToBricks(amount: number): number {
  return Math.floor(amount / TIER_VALUES.caramizi);
}

export function unitsFromTotal(amount: number): Record<SymbolicUnit, number> {
  return {
    caramizi: Math.floor(amount / TIER_VALUES.caramizi),
    pietre: Math.floor(amount / TIER_VALUES.pietre),
    grinzi: Math.floor(amount / TIER_VALUES.grinzi),
    vitralii: Math.floor(amount / TIER_VALUES.vitralii),
    icoane: Math.floor(amount / TIER_VALUES.icoane),
  };
}

/** Single best-fit symbolic translation for one donation amount. */
export function symbolicLabel(amount: number): { icon: string; label: string } {
  if (amount >= TIER_VALUES.icoane) {
    const n = Math.floor(amount / TIER_VALUES.icoane);
    return { icon: '🕯️', label: `${n} ${n === 1 ? 'icoană' : 'icoane'}` };
  }
  if (amount >= TIER_VALUES.vitralii) {
    const n = Math.floor(amount / TIER_VALUES.vitralii);
    return { icon: '🪟', label: `${n} ${n === 1 ? 'vitraliu' : 'vitralii'}` };
  }
  if (amount >= TIER_VALUES.grinzi) {
    const n = Math.floor(amount / TIER_VALUES.grinzi);
    return { icon: '🪵', label: `${n} ${n === 1 ? 'grindă' : 'grinzi'}` };
  }
  if (amount >= TIER_VALUES.pietre) {
    const n = Math.floor(amount / TIER_VALUES.pietre);
    return { icon: '🪨', label: `${n} ${n === 1 ? 'piatră' : 'pietre'} de temelie` };
  }
  const n = Math.max(1, Math.floor(amount / TIER_VALUES.caramizi));
  return { icon: '🧱', label: `${n} ${n === 1 ? 'cărămidă' : 'cărămizi'}` };
}
