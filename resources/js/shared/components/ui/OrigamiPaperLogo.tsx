import React, { useState } from 'react';

export type OrigamiMode = 'loop' | 'hover' | 'entrance';

interface Props {
  /** Ширина значка в px */
  size?: number;
  /**
   * - 'loop': бесконечный цикл (прелоадер): раскрытие → пауза → складывание
   * - 'hover': в покое раскрыт, при наведении складывается в малый кусочек
   * - 'entrance': один раз раскладывается из кусочка при монтировании
   */
  mode?: OrigamiMode;
  /** Длительность цикла в секундах (для loop) */
  duration?: number;
  className?: string;
  onClick?: () => void;
  /** Вызывается, когда 'entrance' закончился (удобно для скрытия прелоадера) */
  onEntranceEnd?: () => void;
}

export const OrigamiPaperLogo: React.FC<Props> = ({
                                                    size = 32,
                                                    mode = 'loop',
                                                    duration = 3.8,
                                                    className = '',
                                                    onClick,
                                                    onEntranceEnd,
                                                  }) => {
  const [isHovered, setIsHovered] = useState(false);
  const folded = mode === 'hover' && isHovered;
  const m = mode === 'loop' ? 'loop' : mode === 'entrance' ? 'ent' : 'int';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => mode === 'hover' && setIsHovered(true)}
      onMouseLeave={() => mode === 'hover' && setIsHovered(false)}
      style={{ width: size, height: size * (325 / 160), ['--origami-d' as string]: `${duration}s` }}
      className={`relative shrink-0 select-none overflow-visible ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <style>{`
        /* Точки вращения считаются от bbox самого элемента — не зависят от viewBox */
        .og { transform-box: fill-box; will-change: transform, filter, opacity; }
        .og-base  { transform-origin: 50% 50%; }
        .og-spine { transform-origin: 50% 100%; }   /* растёт от нижнего края */
        .og-top   { transform-origin: 0% 100%; }    /* вращается вокруг диагонального шва */

        /* ============ LOOP: один цикл = раскрытие, пауза, складывание ============ */

        /* Малый кусочек: приседает перед выходом ленты, отдаёт, затем принимает её обратно */
        @keyframes og-base-loop {
          0%        { transform: scale(1); }
          8%        { transform: scale(.94) translateY(2px); animation-timing-function: cubic-bezier(.2,.9,.3,1.2); }
          20%       { transform: scale(1.04) translateY(-1.5px); animation-timing-function: ease-out; }
          28%, 72%  { transform: scale(1) translateY(0); animation-timing-function: ease-in-out; }
          80%       { transform: scale(.96) translateY(2px); animation-timing-function: cubic-bezier(.2,.9,.3,1.2); }
          90%       { transform: scale(1.03) translateY(0); animation-timing-function: ease-out; }
          96%, 100% { transform: scale(1); }
        }

        /* Тело: вытягивается с перелётом, затем плавно оседает; складывается с ускорением */
        @keyframes og-spine-loop {
          0%, 8%    { transform: scaleY(0); opacity: 0; filter: brightness(.6); animation-timing-function: cubic-bezier(.22,1,.36,1); }
          10%       { opacity: 1; }
          26%       { transform: scaleY(1.05) rotate(-.6deg); filter: brightness(1.08); animation-timing-function: ease-in-out; }
          36%       { transform: scaleY(.985) rotate(.1deg); }
          42%, 72%  { transform: scaleY(1) rotate(0); opacity: 1; filter: brightness(1); animation-timing-function: cubic-bezier(.55,0,.8,.4); }
          82%       { transform: scaleY(.45); filter: brightness(.75); opacity: 1; animation-timing-function: ease-in; }
          88%       { transform: scaleY(0); filter: brightness(.55); opacity: .7; }
          89%, 100% { transform: scaleY(0); opacity: 0; }
        }

        /* Клапан: раскрывается внахлёст с телом, с упругим отскоком; захлопывается первым */
        @keyframes og-top-loop {
          0%, 24%   { transform: rotate(-32.5deg) scaleY(0) rotate(32.5deg); opacity: 0; filter: brightness(.55); animation-timing-function: cubic-bezier(.3,1.4,.5,1); }
          26%       { opacity: 1; }
          40%       { transform: rotate(-32.5deg) scaleY(1.1) rotate(32.5deg); filter: brightness(1.12); animation-timing-function: ease-in-out; }
          48%       { transform: rotate(-32.5deg) scaleY(.98) rotate(32.5deg); }
          54%, 62%  { transform: rotate(-32.5deg) scaleY(1) rotate(32.5deg); opacity: 1; filter: brightness(1); animation-timing-function: cubic-bezier(.55,0,.8,.4); }
          70%       { transform: rotate(-32.5deg) scaleY(0) rotate(32.5deg); filter: brightness(.55); opacity: 1; }
          71%, 100% { transform: rotate(-32.5deg) scaleY(0) rotate(32.5deg); opacity: 0; }
        }

        .og-loop-base  { animation: og-base-loop  var(--origami-d) infinite; }
        .og-loop-spine { animation: og-spine-loop var(--origami-d) infinite; }
        .og-loop-top   { animation: og-top-loop   var(--origami-d) infinite; }

        /* ============ ENTRANCE: только раскрытие, один раз ============ */
        @keyframes og-base-ent {
          0%   { transform: scale(.6) translateY(10px); opacity: 0; }
          35%  { transform: scale(1.06) translateY(-1px); opacity: 1; }
          55%  { transform: scale(.97); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes og-spine-ent {
          0%, 22% { transform: scaleY(0); opacity: 0; filter: brightness(.6); animation-timing-function: cubic-bezier(.22,1,.36,1); }
          26%     { opacity: 1; }
          60%     { transform: scaleY(1.05) rotate(-.6deg); filter: brightness(1.08); animation-timing-function: ease-in-out; }
          80%     { transform: scaleY(.985) rotate(.1deg); }
          100%    { transform: scaleY(1); opacity: 1; filter: brightness(1); }
        }
        @keyframes og-top-ent {
          0%, 48% { transform: rotate(-32.5deg) scaleY(0) rotate(32.5deg); opacity: 0; filter: brightness(.55); animation-timing-function: cubic-bezier(.3,1.4,.5,1); }
          50%     { opacity: 1; }
          80%     { transform: rotate(-32.5deg) scaleY(1.1) rotate(32.5deg); filter: brightness(1.12); animation-timing-function: ease-in-out; }
          92%     { transform: rotate(-32.5deg) scaleY(.98) rotate(32.5deg); }
          100%    { transform: rotate(-32.5deg) scaleY(1) rotate(32.5deg); opacity: 1; filter: brightness(1); }
        }
        .og-ent-base  { animation: og-base-ent  1.1s both; }
        .og-ent-spine { animation: og-spine-ent 1.1s .15s both; }
        .og-ent-top   { animation: og-top-ent   1.1s .15s both; }

        /* ============ HOVER: плавные переходы со сдвигом по времени ============ */
        .og-int { transition: transform .6s cubic-bezier(.34,1.25,.64,1), opacity .4s ease, filter .6s ease; }
        .og-int.og-spine { transition-delay: 0s; }
        .og-int.og-top   { transition-delay: .12s; }          /* раскрытие: тело, потом клапан */
        .og-folded .og-top   { transform: rotate(-32.5deg) scaleY(0) rotate(32.5deg); opacity: 0; filter: brightness(.55); transition-delay: 0s; }
        .og-folded .og-spine { transform: scaleY(0); opacity: 0; filter: brightness(.6); transition-delay: .12s; }
        .og-folded .og-base  { transform: scale(1.08); }

        /* ============ Доступность ============ */
        @media (prefers-reduced-motion: reduce) {
          .og, .og-int { animation: none !important; transition: none !important; }
        }
      `}</style>

      <svg
        viewBox="740 25 160 325"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full overflow-visible ${folded ? 'og-folded' : ''}`}
      >
        <defs>
          <filter id="origami-ambient-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="8" stdDeviation="6" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Тень — на общей группе, чтобы анимация filter у частей её не перебивала */}
        <g filter="url(#origami-ambient-shadow)">
          {/* 1. Тело */}
          <path
            className={`og og-spine og-${m}-spine`.replace('og-int-spine', 'og-int')}
            d="M784.138 36C797.609 42.5845 820.034 56.8362 833.254 64.8364C849.833 74.8733 871.385 86.8853 887.171 97.4804C887.553 147.942 887.81 200.711 887.183 251.166C874.362 259.936 860.081 268.575 846.85 276.929C839.989 281.263 829.079 288.602 822.321 292.177L822.281 212.905C814.194 207.958 806.078 203.058 797.934 198.202C794.016 195.86 787.503 192.242 783.962 189.625C783.659 180.708 783.785 172.136 783.899 163.221C784.013 121.707 783.061 77.2401 784.138 36Z"
            fill="#0D7EFB"
          />

          {/* 2. Верхний клапан */}
          <path
            className={`og og-top og-${m}-top`.replace('og-int-top', 'og-int')}
            onAnimationEnd={mode === 'entrance' ? onEntranceEnd : undefined}
            d="M784.138 36C797.609 42.5845 820.034 56.8362 833.254 64.8364C849.833 74.8733 871.385 86.8853 887.171 97.4804C862.768 113.699 837.257 129.318 812.557 145.172C806.865 148.824 789.203 161.091 783.899 163.221C784.013 121.707 783.061 77.2401 784.138 36Z"
            fill="#41A2FD"
          />

          {/* 3. Малый кусочек (база) */}
          <path
            className={`og og-base og-${m}-base`.replace('og-int-base', 'og-int')}
            d="M813.088 214.831C814.491 216.932 813.972 287.642 813.966 296.875C798.915 306.841 783.3 316.208 768.198 326.111C763.385 329.266 758.298 332.497 753.233 335.19C752.8 327.619 753.028 316.907 752.999 309.126C753.079 290.404 753.056 271.681 752.931 252.958C760.225 247.623 770.896 241.339 778.755 236.37C789.996 229.268 801.704 221.59 813.088 214.831Z"
            fill="#41A2FD"
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * Пример полноэкранного прелоадера:
 *
 * export function PagePreloader({ visible }: { visible: boolean }) {
 *   return (
 *     <div
 *       className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0f12]
 *         transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
 *     >
 *       <OrigamiPaperLogo size={56} mode="loop" />
 *     </div>
 *   );
 * }
 */