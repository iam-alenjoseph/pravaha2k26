import { useEffect, useRef } from 'react';

export function CursorGlow({ reduced }: { reduced?: boolean }) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || window.matchMedia('(hover: none)').matches) return;

    const glow = glowRef.current;
    if (!glow) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let isHovering = false;
    let animationId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (target && target.closest('a, button, [role="button"], .event-card, .lineup-composition')) {
        isHovering = true;
      } else {
        isHovering = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const loop = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${isHovering ? 1.6 : 1})`;
      glow.style.opacity = isHovering ? '0.65' : '0.4';

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={glowRef}
      className="fest-cursor-glow"
      aria-hidden="true"
    />
  );
}

