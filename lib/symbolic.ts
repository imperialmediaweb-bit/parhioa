/**
 * Realistic unit prices for the church construction work.
 * Used by the donor list (symbolic representation of each gift) and by
 * the donate form's preset descriptions.
 *
 * Prices are approximate market values for materials + labor in Botoșani,
 * meant to be defensible if a parishioner asks "what does my gift actually buy?".
 */

export type SymbolicUnit =
  | 'caramizi'      // 1 cărămidă plină
  | 'saciCiment'    // 1 sac de ciment 25 kg
  | 'tencuiala'     // 1 m² de tencuială (materiale + manoperă)
  | 'zidarie'       // 1 m² de zidărie completă
  | 'grinzi';       // 1 grindă de lemn pentru acoperiș

export const TIER_VALUES: Record<SymbolicUnit, number> = {
  caramizi: 10,
  saciCiment: 50,
  tencuiala: 100,
  zidarie: 250,
  grinzi: 500,
};

export function ronToBricks(amount: number): number {
  return Math.floor(amount / TIER_VALUES.caramizi);
}

/**
 * Best-fit symbolic translation for a single donation amount.
 * Returns the largest realistic unit the gift covers in full.
 */
export function symbolicLabel(amount: number): { icon: string; label: string } {
  if (amount >= TIER_VALUES.grinzi) {
    const n = Math.floor(amount / TIER_VALUES.grinzi);
    return { icon: '🪵', label: `${n} ${n === 1 ? 'grindă' : 'grinzi'} pentru acoperiș` };
  }
  if (amount >= TIER_VALUES.zidarie) {
    const n = Math.floor(amount / TIER_VALUES.zidarie);
    return { icon: '🧱', label: `${n} m² de zidărie` };
  }
  if (amount >= TIER_VALUES.tencuiala) {
    const n = Math.floor(amount / TIER_VALUES.tencuiala);
    return { icon: '🛠️', label: `${n} m² de tencuială` };
  }
  if (amount >= TIER_VALUES.saciCiment) {
    const n = Math.floor(amount / TIER_VALUES.saciCiment);
    return { icon: '🪨', label: `${n} ${n === 1 ? 'sac' : 'saci'} de ciment` };
  }
  const n = Math.max(1, Math.floor(amount / TIER_VALUES.caramizi));
  return { icon: '🧱', label: `${n} ${n === 1 ? 'cărămidă' : 'cărămizi'}` };
}
