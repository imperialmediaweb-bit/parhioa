'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoSectionProps {
  poster: string;
  videoSrc?: string;
  youtubeId?: string;
  className?: string;
}

export function VideoSection({ poster, videoSrc, youtubeId, className }: VideoSectionProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={cn('relative aspect-video rounded-3xl overflow-hidden shadow-2xl', className)}>
      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 w-full h-full"
          aria-label="Redă video-ul"
        >
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-burgundy-dark/30 group-hover:bg-burgundy-dark/45 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="relative flex items-center justify-center">
              <span className="absolute h-20 w-20 rounded-full bg-white/30 animate-ping" />
              <span className="relative h-20 w-20 rounded-full bg-white text-burgundy flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 ml-1" fill="currentColor" />
              </span>
            </span>
          </div>
        </button>
      ) : youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : videoSrc ? (
        <video src={videoSrc} controls autoPlay className="absolute inset-0 h-full w-full bg-black" />
      ) : null}
    </div>
  );
}
