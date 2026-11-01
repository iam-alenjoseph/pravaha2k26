import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  loop?: boolean;
}

export function TypewriterText({
  text,
  typingSpeed = 85,
  deletingSpeed = 40,
  pauseDuration = 2800,
  className = '',
  loop = true,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || document.documentElement.dataset.motion === 'reduced') {
      setIsReduced(true);
      setDisplayedText(text);
      return;
    }

    let timer: number;

    if (!isDeleting) {
      if (displayedText.length < text.length) {
        timer = window.setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else if (loop) {
        timer = window.setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayedText.length > 0) {
        timer = window.setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        timer = window.setTimeout(() => {
          setIsDeleting(false);
        }, 500);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, text, typingSpeed, deletingSpeed, pauseDuration, loop]);

  if (isReduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`typewriter-container ${className}`} aria-label={text}>
      <span aria-hidden="true" className="typewriter-text">
        {displayedText}
      </span>
      <span aria-hidden="true" className="typewriter-cursor" />
      <span className="sr-only">{text}</span>
    </span>
  );
}

