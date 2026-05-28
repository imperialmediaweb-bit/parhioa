'use client';

import { useRef, useState } from 'react';
import { OrthodoxCross } from './cross-divider';
import { cn } from '@/lib/utils';

export type VideoItem = {
  src: string;
  poster: string;
  caption?: string;
};

/**
 * Big cinematic video card — used by FeaturedVideo and VideoGallery.
 * Shows poster + play button until clicked; then loads the video inline.
 */
function VideoCard({
  item,
  big = false,
  showCross = false,
}: {
  item: VideoItem;
  big?: boolean;
  showCross?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    setPlaying(true);
    setTimeout(() => videoRef.current?.play(), 50);
  };

  return (
    <div className={cn('relative', showCross && 'pt-8')}>
      {showCross && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
          <OrthodoxCross height={44} />
        </div>
      )}

      <div
        className={cn(
          'relative aspect-[16/9] rounded-[24px] overflow-hidden ring-[3px] ring-gold/70 shadow-[0_30px_60px_-22px_rgba(101,26,20,0.55)]',
        )}
        style={{
          background: 'linear-gradient(180deg, #1a0604 0%, #3d0f0a 100%)',
        }}
      >
        {playing ? (
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            controls
            playsInline
            className="absolute inset-0 w-full h-full object-cover bg-black"
          />
        ) : (
          <button
            onClick={play}
            aria-label="Redă video"
            className="group absolute inset-0 w-full h-full"
          >
            <img
              src={item.poster}
              alt={item.caption || 'Video parohie'}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/85 via-burgundy-dark/30 to-burgundy-dark/40" />

            {/* Gold corner accents */}
            <div className="absolute top-3 left-3 h-8 w-8 border-t-2 border-l-2 border-gold/70 rounded-tl-[14px]" />
            <div className="absolute top-3 right-3 h-8 w-8 border-t-2 border-r-2 border-gold/70 rounded-tr-[14px]" />
            <div className="absolute bottom-3 left-3 h-8 w-8 border-b-2 border-l-2 border-gold/70 rounded-bl-[14px]" />
            <div className="absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-gold/70 rounded-br-[14px]" />

            <div className="absolute top-5 left-5 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy-dark/85 text-cream ring-1 ring-gold/60 backdrop-blur-sm">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-ceremonial uppercase text-[10px] tracking-[0.26em]">
                Video
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex items-center justify-center">
                <span
                  className={cn(
                    'absolute rounded-full bg-gold/25 animate-ping',
                    big ? 'h-40 w-40 sm:h-44 sm:w-44' : 'h-24 w-24',
                  )}
                />
                <span
                  className={cn(
                    'relative flex items-center justify-center rounded-full bg-cream text-burgundy-dark ring-[4px] ring-gold shadow-[0_18px_40px_-8px_rgba(0,0,0,0.75)] group-hover:scale-110 transition-transform',
                    big ? 'h-24 w-24 sm:h-28 sm:w-28' : 'h-16 w-16',
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={cn('ml-1', big ? 'h-12 w-12 sm:h-14 sm:w-14' : 'h-7 w-7')}
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </div>

            {item.caption && (
              <div className="absolute bottom-5 left-0 right-0 text-center text-cream px-6">
                <p
                  className={cn(
                    'font-display drop-shadow-[0_3px_14px_rgba(0,0,0,0.8)]',
                    big ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-base sm:text-lg',
                  )}
                >
                  {item.caption}
                </p>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Video gallery — first item is featured big, rest displayed in a row below.
 * Pass a single video or many — layout adapts.
 */
export function VideoGallery({ videos }: { videos: VideoItem[] }) {
  if (videos.length === 0) return null;

  const [hero, ...rest] = videos;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <VideoCard item={hero} big showCross />

      {rest.length > 0 && (
        <div
          className={cn(
            'grid gap-5',
            rest.length === 1 && 'grid-cols-1',
            rest.length === 2 && 'sm:grid-cols-2',
            rest.length >= 3 && 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {rest.map((v, i) => (
            <VideoCard key={i} item={v} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Single-video shortcut for backwards compat. */
export function FeaturedVideo(props: VideoItem & { eyebrow?: string }) {
  return <VideoGallery videos={[{ src: props.src, poster: props.poster, caption: props.caption }]} />;
}
