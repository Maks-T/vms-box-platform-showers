import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface BlurTextProps {
  text: string;
  delay?: number;
  stepDelay?: number;
  className?: string;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 150,
  stepDelay = 28,
  className = '',
}) => {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={cn('inline-flex flex-wrap gap-x-1.5 gap-y-1', className)}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            transitionDelay: `${delay + i * stepDelay}ms`,
          }}
          className={cn(
            'inline-block transition-all duration-500 ease-out will-change-[filter,transform,opacity]',
            inView ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-[10px] translate-y-2'
          )}
        >
          {word}
        </span>
      ))}
    </div>
  );
};