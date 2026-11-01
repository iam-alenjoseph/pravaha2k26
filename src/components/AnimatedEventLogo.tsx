import { useState, useEffect, useRef, useCallback } from 'react';

const RESTING_LOGO = '/assets/fest/eventlogo.png';
const LOGO_FRAMES = Array.from({ length: 19 }, (_, i) => `/assets/fest/eventlogo${i + 1}.png`);

interface AnimatedEventLogoProps {
  className?: string;
  variant?: 'hero' | 'header' | 'footer';
  priority?: boolean;
}

export function AnimatedEventLogo({
  className = '',
  variant = 'hero',
  priority = false,
}: AnimatedEventLogoProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const burstTimeoutRef = useRef<number | null>(null);

  // Preload resting logo and all 19 animation frames
  useEffect(() => {
    [RESTING_LOGO, ...LOGO_FRAMES].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const stepFrame = useCallback(() => {
    setCurrentFrame(prev => (prev + 1) % LOGO_FRAMES.length);
  }, []);

  useEffect(() => {
    // When hovered: continuously cycle fast through all 19 animation frames
    if (isHovered) {
      if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      setIsAnimating(true);
      intervalRef.current = window.setInterval(stepFrame, 45); // ~22fps fast kinetic flicker
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }

    // When NOT hovered: resting phase displays eventlogo.png
    setIsAnimating(false);
    setCurrentFrame(0);

    let burstActive = false;
    let burstCount = 0;
    const TOTAL_BURST_STEPS = LOGO_FRAMES.length;

    const triggerPeriodicBurst = () => {
      if (burstActive) return;
      burstActive = true;
      burstCount = 0;
      setIsAnimating(true);

      const burstInterval = window.setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % LOGO_FRAMES.length);
        burstCount++;
        if (burstCount >= TOTAL_BURST_STEPS) {
          clearInterval(burstInterval);
          // Return to resting phase: eventlogo.png
          setIsAnimating(false);
          setCurrentFrame(0);
          burstActive = false;
          // Schedule next periodic burst
          burstTimeoutRef.current = window.setTimeout(triggerPeriodicBurst, 3200);
        }
      }, 42); // 42ms per frame fast motion
    };

    // First burst after mount
    burstTimeoutRef.current = window.setTimeout(triggerPeriodicBurst, 2500);

    return () => {
      if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, stepFrame]);

  const activeSrc = isAnimating ? LOGO_FRAMES[currentFrame] : RESTING_LOGO;

  return (
    <div
      className={`animated-eventlogo-wrapper animated-eventlogo-${variant} ${isHovered ? 'is-hovered' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsAnimating(false);
        setCurrentFrame(0);
      }}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => {
        setIsHovered(false);
        setIsAnimating(false);
        setCurrentFrame(0);
      }}
      role="img"
      aria-label="Pravaha 2k26 Animated Event Logo"
    >
      <img
        src={activeSrc}
        alt="Pravaha 2k26"
        className="animated-eventlogo-img"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
