import { useState, useEffect, useRef } from 'react';

const EVENT_ART_FRAMES: Record<string, string[]> = {
  dance: [
    '/assets/fest/dance.png',
    '/assets/fest/dance1.png',
    '/assets/fest/dance2.png',
    '/assets/fest/dance3.png',
    '/assets/fest/dance4.png',
    '/assets/fest/dance5.png',
  ],
  music: [
    '/assets/fest/music.png',
    '/assets/fest/music1.png',
    '/assets/fest/music2.png',
    '/assets/fest/music3.png',
    '/assets/fest/music4.png',
  ],
  fashion: [
    '/assets/fest/fashionshow.png',
    '/assets/fest/fashionshow1.png',
    '/assets/fest/fashionshow2.png',
    '/assets/fest/fashionshow3.png',
    '/assets/fest/fashionshow4.png',
    '/assets/fest/fashionshow5.png',
  ],
  'fashion-show': [
    '/assets/fest/fashionshow.png',
    '/assets/fest/fashionshow1.png',
    '/assets/fest/fashionshow2.png',
    '/assets/fest/fashionshow3.png',
    '/assets/fest/fashionshow4.png',
    '/assets/fest/fashionshow5.png',
  ],
};

interface AnimatedEventArtProps {
  eventId: string;
  alt: string;
  className?: string;
  isParentHovered?: boolean;
  priority?: boolean;
  staggerIndex?: number;
}

export function AnimatedEventArt({
  eventId,
  alt,
  className = '',
  isParentHovered = false,
  priority = false,
}: AnimatedEventArtProps) {
  const frames = EVENT_ART_FRAMES[eventId] || EVENT_ART_FRAMES[eventId.toLowerCase()] || EVENT_ART_FRAMES.dance;

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isSelfHovered, setIsSelfHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const activeHover = isParentHovered || isSelfHovered;

  // Preload all frames immediately
  useEffect(() => {
    frames.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [frames]);

  // Nonstop continuous animation loop
  useEffect(() => {
    // Medium speed nonstop animation (comfortably readable poses, responsive on hover)
    const speed = activeHover ? 100 : 140;

    intervalRef.current = window.setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % frames.length);
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeHover, frames.length]);

  return (
    <div
      className={`animated-event-art-container ${activeHover ? 'is-hovered' : ''} ${className}`}
      onMouseEnter={() => setIsSelfHovered(true)}
      onMouseLeave={() => setIsSelfHovered(false)}
      onTouchStart={() => setIsSelfHovered(true)}
      onTouchEnd={() => setIsSelfHovered(false)}
    >
      <img
        src={frames[currentFrame]}
        alt={alt}
        className="animated-event-art-img"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
