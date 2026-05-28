'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Wraps the app with Lenis-driven smooth scrolling. Mounted once at the
 * root layout so navigation, anchor links, and scroll-triggered effects
 * all share the same eased scroll state.
 */
export function SmoothScrollProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
