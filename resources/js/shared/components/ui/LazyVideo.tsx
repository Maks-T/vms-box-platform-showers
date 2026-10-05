import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src?: string;
  poster?: string;
  theme?: 'dark' | 'neutral' | 'white';
  videoClassName?: string;
}

export default function LazyVideo({
                                    src,
                                    poster,
                                    theme = 'neutral',
                                    className,
                                    videoClassName,
                                    autoPlay = true,
                                    loop = true,
                                    muted = true,
                                    playsInline = true,
                                    ...props
                                  }: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsLoaded(true);
    }
  }, [src]);

  const themeStyles = {
    dark: {
      container: 'bg-[#16191B]',
      overlay: 'bg-[#16191B]/85 backdrop-blur-[2px]',
      spinner: 'border-white/20 border-t-white',
    },
    neutral: {
      container: 'bg-[#DCE2EA]',
      overlay: 'bg-[#DCE2EA]/90 backdrop-blur-[2px]',
      spinner: 'border-slate-400/40 border-t-primary',
    },
    white: {
      container: 'bg-[#F8F9FA]',
      overlay: 'bg-white/95 backdrop-blur-[2px]',
      spinner: 'border-primary/20 border-t-primary',
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.neutral;

  return (
    <div className={cn('relative w-full h-full overflow-hidden isolate transition-colors', currentTheme.container, className)}>
      {poster && !isLoaded && (
        <img
          src={poster}
          alt="Превью"
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105 opacity-60 z-0"
        />
      )}

      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500 pointer-events-none',
          currentTheme.overlay,
          isLoaded ? 'opacity-0' : 'opacity-100',
        )}
      >
        <div className={cn('w-9 h-9 md:w-11 md:h-11 border-[2.5px] rounded-full animate-spin', currentTheme.spinner)} />
      </div>

      {src ? (
        <video
          ref={videoRef}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          disablePictureInPicture
          poster={poster}
          onLoadedData={() => setIsLoaded(true)}
          onPlaying={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover block transition-opacity duration-700 ease-out',
            isLoaded ? 'opacity-100' : 'opacity-0',
            videoClassName,
          )}
          {...props}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}