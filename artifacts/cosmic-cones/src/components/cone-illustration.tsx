import { useId } from 'react';

type ConeIllustrationProps = {
  colors: readonly string[];
  metallic?: boolean;
};

const bodyPath =
  'M100 13 C106 13 109 20 112 29 C127 68 149 112 166 148 C173 163 166 171 150 171 H50 C34 171 27 163 34 148 C51 112 73 68 88 29 C91 20 94 13 100 13 Z';

const spiralPaths = [
  'M100 16 C124 35 76 48 100 67 C124 85 78 101 101 119 C123 137 107 151 151 165',
  'M88 25 C108 43 63 57 86 76 C108 94 64 111 88 128 C107 143 87 155 51 165',
  'M112 25 C136 43 92 58 114 77 C136 96 92 112 116 130 C135 145 148 157 165 165',
];

export function ConeIllustration({
  colors,
  metallic = false,
}: ConeIllustrationProps) {
  const rawId = useId();
  const id = rawId.replaceAll(':', '');
  const baseColor =
    colors.length > 1 ? colors[colors.length - 1] : '#f9f3df';
  const ribbonColors = metallic
    ? [`url(#${id}-metal-ribbon)`, `url(#${id}-metal-ribbon-light)`]
    : colors.length > 1
      ? colors.slice(0, -1)
      : [colors[0] ?? '#f5c943'];

  return (
    <svg
      className="cone-illustration"
      viewBox="20 0 160 184"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-metal-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#777c80" />
          <stop offset=".16" stopColor="#f0f1f1" />
          <stop offset=".34" stopColor="#969b9e" />
          <stop offset=".52" stopColor="#ffffff" />
          <stop offset=".72" stopColor="#858a8d" />
          <stop offset="1" stopColor="#e3e5e6" />
        </linearGradient>
        <linearGradient id={`${id}-metal-ribbon`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#777c80" />
          <stop offset=".3" stopColor="#fafafa" />
          <stop offset=".6" stopColor="#999ea1" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={`${id}-metal-ribbon-light`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d7dadd" />
          <stop offset=".4" stopColor="#ffffff" />
          <stop offset=".8" stopColor="#8c9296" />
          <stop offset="1" stopColor="#f7f8f8" />
        </linearGradient>
        <linearGradient id={`${id}-side-shade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#172448" stopOpacity=".27" />
          <stop offset=".3" stopColor="#ffffff" stopOpacity=".08" />
          <stop offset=".58" stopColor="#ffffff" stopOpacity=".18" />
          <stop offset="1" stopColor="#172448" stopOpacity=".25" />
        </linearGradient>
        <clipPath id={`${id}-cone-clip`}>
          <path d={bodyPath} />
        </clipPath>
      </defs>

      <ellipse cx="100" cy="174" rx="59" ry="6" fill="#172448" opacity=".13" />
      <path
        d={bodyPath}
        fill={metallic ? `url(#${id}-metal-body)` : baseColor}
        stroke="#172448"
        strokeOpacity=".18"
        strokeWidth="2"
      />
      <g clipPath={`url(#${id}-cone-clip)`}>
        {spiralPaths.map((path, index) => {
          const ribbon = ribbonColors[index % ribbonColors.length]!;
          return (
            <g key={path}>
              <path
                d={path}
                fill="none"
                stroke="#172448"
                strokeOpacity=".12"
                strokeWidth="19"
                strokeLinecap="round"
              />
              <path
                d={path}
                fill="none"
                stroke={ribbon}
                strokeWidth="15"
                strokeLinecap="round"
              />
            </g>
          );
        })}
        <path
          d="M96 28 C79 69 61 110 44 145"
          fill="none"
          stroke="#ffffff"
          strokeOpacity=".42"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M35 149 C66 157 134 157 165 149"
          fill="none"
          stroke="#172448"
          strokeOpacity=".19"
          strokeWidth="2"
        />
        <path d={bodyPath} fill={`url(#${id}-side-shade)`} />
      </g>
    </svg>
  );
}