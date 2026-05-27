import { cn } from '@/lib/utils';

type IconProps = {
  className?: string;
  size?: number;
};

/** Lit candle with flame — for prayer / pomelnice */
export function CandleIcon({ className, size = 32 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 32"
      width={size}
      height={(size * 32) / 24}
      className={cn(className)}
      aria-hidden
    >
      <defs>
        <radialGradient id="candle-flame" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#FBF6EE" />
          <stop offset="40%" stopColor="#EAC784" />
          <stop offset="100%" stopColor="#c9a361" />
        </radialGradient>
      </defs>
      {/* Flame */}
      <path
        fill="url(#candle-flame)"
        d="M12 1 C 9 5, 7 9, 9 12 C 9.5 13.5, 11 14, 12 14 C 13 14, 14.5 13.5, 15 12 C 17 9, 15 5, 12 1 Z"
      />
      {/* Flame highlight */}
      <ellipse cx="12" cy="8" rx="1.3" ry="3" fill="#FBF6EE" opacity="0.7" />
      {/* Wick */}
      <line x1="12" y1="14" x2="12" y2="17" stroke="#3d0f0a" strokeWidth="0.8" />
      {/* Candle body */}
      <rect x="8" y="17" width="8" height="14" rx="1" fill="currentColor" />
      {/* Candle top edge */}
      <ellipse cx="12" cy="17" rx="4" ry="1" fill="currentColor" opacity="0.7" />
      {/* Wax drip */}
      <path
        d="M 8 19 Q 7.5 22, 8.2 25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
      />
    </svg>
  );
}

/** Censer / incense burner (cădelniță) hanging on chains */
export function CenserIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      {/* Chains */}
      <line x1="16" y1="2" x2="9" y2="14" stroke="currentColor" strokeWidth="0.8" />
      <line x1="16" y1="2" x2="23" y2="14" stroke="currentColor" strokeWidth="0.8" />
      <line x1="16" y1="2" x2="16" y2="14" stroke="currentColor" strokeWidth="0.8" />
      {/* Hanging ring */}
      <circle cx="16" cy="2" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Lid */}
      <path d="M 8 16 Q 16 11, 24 16 L 22 18 L 10 18 Z" fill="currentColor" />
      {/* Bowl */}
      <path
        d="M 8 16 Q 16 30, 24 16 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Cross on top */}
      <rect x="15.4" y="6" width="1.2" height="4" fill="currentColor" />
      <rect x="14" y="7.2" width="4" height="1.2" fill="currentColor" />
      {/* Smoke wisps */}
      <path
        d="M 14 10 Q 12 8, 14 6 Q 16 4, 14 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.45"
      />
      <path
        d="M 18 10 Q 20 8, 18 6 Q 16 4, 18 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.45"
      />
    </svg>
  );
}

/** Orthodox church with onion dome and cross (Romanian/Russian style) */
export function ChurchIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      {/* Cross on top */}
      <rect x="15.5" y="1" width="1" height="5" fill="currentColor" />
      <rect x="14" y="2.5" width="4" height="1" fill="currentColor" />
      {/* Onion dome */}
      <path
        d="M 16 6 C 12 6, 11 11, 13 13 L 19 13 C 21 11, 20 6, 16 6 Z"
        fill="currentColor"
      />
      {/* Drum below dome */}
      <rect x="12.5" y="13" width="7" height="3" fill="currentColor" />
      {/* Side small domes/towers */}
      <rect x="5" y="14" width="4" height="2" fill="currentColor" />
      <path d="M 7 11 L 5 14 L 9 14 Z" fill="currentColor" />
      <rect x="23" y="14" width="4" height="2" fill="currentColor" />
      <path d="M 25 11 L 23 14 L 27 14 Z" fill="currentColor" />
      {/* Main body */}
      <rect x="4" y="16" width="24" height="14" fill="currentColor" opacity="0.95" />
      {/* Door */}
      <path d="M 14 30 L 14 22 Q 16 19, 18 22 L 18 30 Z" fill="#FBF6EE" opacity="0.85" />
      {/* Arched windows */}
      <path d="M 8 22 Q 9 19, 10 22 L 10 26 L 8 26 Z" fill="#FBF6EE" opacity="0.6" />
      <path d="M 22 22 Q 23 19, 24 22 L 24 26 L 22 26 Z" fill="#FBF6EE" opacity="0.6" />
    </svg>
  );
}

/** Open Gospel book / Evanghelie */
export function GospelIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      {/* Book base */}
      <path
        d="M 3 8 L 16 6 L 29 8 L 29 26 L 16 27 L 3 26 Z"
        fill="currentColor"
      />
      {/* Spine */}
      <line x1="16" y1="6" x2="16" y2="27" stroke="#3d0f0a" strokeWidth="0.6" opacity="0.5" />
      {/* Page detail */}
      <path d="M 5 10 L 14 9 L 14 24 L 5 24 Z" fill="#FBF6EE" opacity="0.92" />
      <path d="M 18 9 L 27 10 L 27 24 L 18 24 Z" fill="#FBF6EE" opacity="0.92" />
      {/* Text lines */}
      <line x1="7" y1="13" x2="13" y2="13" stroke="#5a1813" strokeWidth="0.6" opacity="0.6" />
      <line x1="7" y1="15" x2="12" y2="15" stroke="#5a1813" strokeWidth="0.6" opacity="0.6" />
      <line x1="7" y1="17" x2="13" y2="17" stroke="#5a1813" strokeWidth="0.6" opacity="0.6" />
      <line x1="7" y1="19" x2="11" y2="19" stroke="#5a1813" strokeWidth="0.6" opacity="0.6" />
      <line x1="7" y1="21" x2="13" y2="21" stroke="#5a1813" strokeWidth="0.6" opacity="0.6" />
      <line x1="19" y1="13" x2="25" y2="13" stroke="#5a1813" strokeWidth="0.6" opacity="0.6" />
      <line x1="19" y1="15" x2="26" y2="15" stroke="#5a1813" strokeWidth="0.6" opacity="0.6" />
      <line x1="19" y1="17" x2="24" y2="17" stroke="#5a1813" strokeWidth="0.6" opacity="0.6" />
      <line x1="19" y1="19" x2="25" y2="19" stroke="#5a1813" strokeWidth="0.6" opacity="0.6" />
      <line x1="19" y1="21" x2="23" y2="21" stroke="#5a1813" strokeWidth="0.6" opacity="0.6" />
      {/* Cross on the right page */}
      <rect x="22.2" y="11" width="0.6" height="3" fill="#81231B" />
      <rect x="21.4" y="11.8" width="2.2" height="0.6" fill="#81231B" />
    </svg>
  );
}

/** Hanging kandila (oil lamp before icons) */
export function KandilaIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      {/* Chains */}
      <line x1="16" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="0.8" />
      <line x1="16" y1="2" x2="21" y2="13" stroke="currentColor" strokeWidth="0.8" />
      <line x1="16" y1="2" x2="16" y2="13" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="16" cy="2" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Bowl */}
      <path
        d="M 11 13 L 21 13 Q 22 24, 16 26 Q 10 24, 11 13 Z"
        fill="currentColor"
      />
      <ellipse cx="16" cy="13" rx="5" ry="1.2" fill="currentColor" opacity="0.7" />
      {/* Flame inside */}
      <path
        d="M 16 15 C 14.5 17, 14 19, 15 20.5 Q 16 21, 17 20.5 C 18 19, 17.5 17, 16 15 Z"
        fill="#EAC784"
      />
      <ellipse cx="16" cy="18" rx="0.8" ry="2" fill="#FBF6EE" opacity="0.8" />
    </svg>
  );
}

/** Hands holding a heart — milostenie */
export function HandsHeartIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      {/* Heart */}
      <path
        d="M 16 10 C 14 7, 9 7, 9 12 C 9 16, 16 21, 16 21 C 16 21, 23 16, 23 12 C 23 7, 18 7, 16 10 Z"
        fill="currentColor"
      />
      {/* Left hand */}
      <path
        d="M 4 19 Q 4 17, 6 17 L 14 17 L 16 22 L 14 27 L 6 27 Q 4 27, 4 25 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Right hand */}
      <path
        d="M 28 19 Q 28 17, 26 17 L 18 17 L 16 22 L 18 27 L 26 27 Q 28 27, 28 25 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Small cross on the heart */}
      <rect x="15.4" y="11" width="1.2" height="5" fill="#FBF6EE" />
      <rect x="13.5" y="12.5" width="5" height="1.2" fill="#FBF6EE" />
    </svg>
  );
}

/** Praying hands — rugăciune */
export function PrayingHandsIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      {/* Halo */}
      <circle cx="16" cy="6" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      {/* Left hand */}
      <path
        d="M 14 4 Q 12 8, 11 14 L 11 22 Q 12 26, 14 27 L 15.5 27 L 15.5 4 Z"
        fill="currentColor"
      />
      {/* Right hand */}
      <path
        d="M 18 4 Q 20 8, 21 14 L 21 22 Q 20 26, 18 27 L 16.5 27 L 16.5 4 Z"
        fill="currentColor"
      />
      {/* Wrist shading */}
      <path
        d="M 11 22 L 16 22 L 21 22 L 21 24 L 11 24 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

/** Mandorla / radiant sun — divine light */
export function MandorlaIcon({ className, size = 32 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      {/* Outer rays */}
      <g stroke="currentColor" strokeWidth="1" opacity="0.6">
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="16" y1="26" x2="16" y2="30" />
        <line x1="2" y1="16" x2="6" y2="16" />
        <line x1="26" y1="16" x2="30" y2="16" />
        <line x1="6" y1="6" x2="9" y2="9" />
        <line x1="26" y1="6" x2="23" y2="9" />
        <line x1="6" y1="26" x2="9" y2="23" />
        <line x1="26" y1="26" x2="23" y2="23" />
      </g>
      {/* Inner sun */}
      <circle cx="16" cy="16" r="7" fill="currentColor" opacity="0.85" />
      {/* Cross overlay */}
      <rect x="15.4" y="11" width="1.2" height="10" fill="#FBF6EE" />
      <rect x="11" y="15.4" width="10" height="1.2" fill="#FBF6EE" />
    </svg>
  );
}
