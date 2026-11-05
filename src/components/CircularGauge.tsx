import React from 'react';

interface CircularGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: 'brand' | 'emerald' | 'amber' | 'rose' | 'auto';
  showPercentageSign?: boolean;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  colorScheme = 'auto',
  showPercentageSign = true,
}) => {
  const clampedPct = Math.min(100, Math.max(0, Math.round(percentage)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  let strokeColor = '#16a34a'; // India Green default
  let bgColor = '#f5f5f4'; // soft stone-100

  if (colorScheme === 'auto') {
    if (clampedPct >= 65) strokeColor = '#16a34a'; // emerald / green
    else if (clampedPct >= 50) strokeColor = '#ea580c'; // saffron / orange
    else strokeColor = '#dc2626'; // rose / alert
  } else if (colorScheme === 'emerald') {
    strokeColor = '#16a34a'; // National Green
  } else if (colorScheme === 'amber') {
    strokeColor = '#ea580c'; // Saffron Orange
  } else if (colorScheme === 'rose') {
    strokeColor = '#dc2626';
  } else if (colorScheme === 'brand') {
    strokeColor = '#15803d'; // Deep Green
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgColor}
            strokeWidth={strokeWidth}
            className="fill-none"
          />
          {/* Animated Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="fill-none transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl sm:text-2xl font-black text-slate-800 leading-none">
            {clampedPct}
            {showPercentageSign && <span className="text-xs font-semibold text-slate-500">%</span>}
          </span>
          {sublabel && (
            <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 leading-tight tracking-wider">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="text-xs font-semibold text-slate-700 mt-2 text-center max-w-[120px] truncate">
          {label}
        </span>
      )}
    </div>
  );
};
