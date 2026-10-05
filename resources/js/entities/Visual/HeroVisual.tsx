import React from 'react';
import { cn } from '@/shared/lib/utils';
import LazyVideo from '@/shared/components/ui/LazyVideo';

interface HeroVisualProps {
  videoSrc?: string;
  imageSrc?: string;
  alt?: string;
  className?: string;
}

export default function HeroVisual({ videoSrc, imageSrc, alt = 'Showers visual', className }: HeroVisualProps) {
  return (
    <div className={cn('w-full lg:w-1/2 flex justify-center lg:justify-end shrink-0 mt-8 lg:mt-0 perspective-[1500px]', className)}>
      <div className="relative w-full max-w-[540px] xl:max-w-[640px] transition-all duration-700 ease-out transform-3d animate-float-3d">
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-[60px] opacity-50 -z-10" />

        <div className="relative rounded-[24px] bg-[#16191B]/80 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl aspect-[16/10] sm:aspect-video lg:aspect-auto">
          <div className="absolute inset-0 rounded-[24px] border border-white/5 pointer-events-none z-20" />

          {videoSrc ? (
            <LazyVideo
              src={videoSrc}
              poster={imageSrc}
              theme="dark"
              className="w-full h-full"
              videoClassName="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500"
            />
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt={alt}
              className="w-full h-full object-cover block grayscale-[10%] hover:grayscale-0 transition-all duration-500"
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </div>
  );
}