import React, {useEffect, useState} from 'react';

const STATIC_STEPS = [
  'Инициализация ядра платформы VMS-NC...',
  'Подключение к удаленной базе данных...'
];

interface ShowCalcLoaderProps {
  isWidgetReady: boolean;
}

export const ShowCalcLoader: React.FC<ShowCalcLoaderProps> = ({isWidgetReady}) => {
  const [inertiaStep, setInertiaStep] = useState(0);

  useEffect(() => {
    if (isWidgetReady) return;

    const interval = setInterval(() => {
      setInertiaStep((prev) => (prev < STATIC_STEPS.length - 1 ? prev + 1 : prev));
    }, 750);

    return () => clearInterval(interval);
  }, [isWidgetReady]);

  if (isWidgetReady) return null;

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-transparent w-full h-full min-h-[480px]">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes loaderFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .loader-text-animate {
          animation: loaderFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `
      }}/>

      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-14 h-14 rounded-full bg-[hsl(var(--primary))/0.05] animate-ping"/>
        <div
          className="w-10 h-10 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin"/>
      </div>

      <div className="text-center max-w-md space-y-2">
        <h3 className="text-[var(--camera-calc-text-dark)] font-semibold text-base tracking-tight">
          Загрузка модулей
        </h3>
        <p
          key={inertiaStep}
          className="loader-text-animate text-[var(--camera-calc-gray-700)] text-sm font-medium"
        >
          {STATIC_STEPS[inertiaStep]}
        </p>
      </div>

      <div className="flex gap-1.5 mt-8">
        {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === inertiaStep
                ? 'w-6 bg-[hsl(var(--primary))]'
                : idx < inertiaStep
                  ? 'w-1.5 bg-[hsl(var(--primary))/0.3]'
                  : 'w-1.5 bg-[hsl(var(--border-dark))/0.4]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
