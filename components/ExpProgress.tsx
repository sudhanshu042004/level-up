import React from 'react';

const ExpProgress = ({
  currentExp,
  maxExp,
  size,
  className,
}: {
  currentExp: number,
  className: string,
  maxExp: number,
  size: number
}) => {
  const percent = (currentExp / maxExp) * 100;
  const viewBoxSize = 144;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={`relative ${className} `}>
      <svg
        className="-rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        <circle
          cx={72}
          cy={72}
          r={60}
          stroke="#e5e7eb"
          strokeWidth={8}
          fill="none"
        />
        <circle
          cx={72}
          cy={72}
          r={60}
          stroke="url(#gradient)"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          // className={`${className}`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.8s ease'
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEC300" />
            <stop offset="100%" stopColor="#FD6325" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default ExpProgress;
