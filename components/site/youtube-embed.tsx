'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

/**
 * Lightweight YouTube player: shows the thumbnail + a play button and only
 * loads the heavy YouTube iframe when the viewer clicks (keeps the page fast).
 */
export function YoutubeEmbed({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [play, setPlay] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border-2 border-gold/50 bg-black shadow-[0_30px_60px_-30px_rgba(101,26,20,0.55)]"
      style={{ aspectRatio: '16 / 9' }}
    >
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerated-sensors; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          aria-label={`Redă: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <span className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-burgundy/90 text-cream shadow-lg group-hover:scale-105 transition-transform">
            <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}
