import React, { useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface MagnetProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  strength = 14,
  className,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!elementRef.current || ('ontouchstart' in window)) return;
    const { left, top, width, height } = elementRef.current.getBoundingClientRect();
    const middleX = left + width / 2;
    const middleY = top + height / 2;
    const offsetX = (e.clientX - middleX) / (width / 2);
    const offsetY = (e.clientY - middleY) / (height / 2);

    setPosition({
      x: offsetX * strength,
      y: offsetY * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={elementRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 ? 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'transform 0.1s ease-out',
      }}
      className={cn('inline-block will-change-transform', className)}
    >
      {children}
    </div>
  );
};