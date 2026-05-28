'use client';

import { useEffect, useRef } from 'react';

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

/**
 * Floating golden embers — like candle sparks drifting upward through
 * a dark section. Canvas-based for performance. Drop into any container
 * that has a dark background; respects user's prefers-reduced-motion.
 */
export function FloatingEmbers({
  density = 28,
  className,
}: {
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const embers: Ember[] = [];

    const spawn = (initial = false): Ember => {
      const maxLife = 280 + Math.random() * 280;
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(0.18 + Math.random() * 0.42),
        size: 0.8 + Math.random() * 2.2,
        alpha: 0.0,
        life: initial ? Math.random() * maxLife : 0,
        maxLife,
      };
    };

    for (let i = 0; i < density; i++) embers.push(spawn(true));

    let rafId = 0;
    let lastTime = performance.now();
    let visible = true;

    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const tick = (now: number) => {
      const dt = Math.min(50, now - lastTime);
      lastTime = now;
      if (!visible) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life += dt * 0.06;
        e.x += e.vx * (dt / 16);
        e.y += e.vy * (dt / 16);
        // Slight horizontal drift like rising heat
        e.vx += (Math.random() - 0.5) * 0.008;
        e.vx = Math.max(-0.5, Math.min(0.5, e.vx));

        // Fade in for first 15% of life, fade out after 70%
        const lifeRatio = e.life / e.maxLife;
        const targetAlpha =
          lifeRatio < 0.15
            ? lifeRatio / 0.15
            : lifeRatio > 0.7
              ? Math.max(0, 1 - (lifeRatio - 0.7) / 0.3)
              : 1;
        e.alpha += (targetAlpha - e.alpha) * 0.08;

        if (e.life >= e.maxLife || e.y < -20) {
          embers[i] = spawn(false);
          continue;
        }

        // Soft golden glow with radial gradient
        const r = e.size * 4;
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, r);
        grad.addColorStop(0, `rgba(255, 220, 140, ${0.85 * e.alpha})`);
        grad.addColorStop(0.4, `rgba(234, 199, 132, ${0.55 * e.alpha})`);
        grad.addColorStop(1, 'rgba(234, 199, 132, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.fillStyle = `rgba(255, 245, 210, ${e.alpha})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibility);
      ro.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className || ''}`}
      aria-hidden
    />
  );
}
