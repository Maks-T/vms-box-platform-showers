import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface BlurFadeTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'span';
}

export const BlurFadeText: React.FC<BlurFadeTextProps> = ({
  text,
  className = '',
  delay = 0,
  as: Component = 'span',
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

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

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      // @ts-ignore
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={cn(
        'inline-block transition-all duration-700 ease-out will-change-[filter,transform,opacity]',
        inView
          ? 'opacity-100 blur-0 translate-y-0'
          : 'opacity-0 blur-[8px] translate-y-3'
      )}
    >
      {text}
    </Component>
  );
};