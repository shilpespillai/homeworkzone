import React from 'react';

export const ClockFace = ({ timeStr }) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  const minuteAngle = minutes * 6;
  const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;

  return (
    <div className="flex justify-center my-8 w-full">
      <svg width="250" height="250" viewBox="0 0 100 100" className="drop-shadow-2xl">
        {/* Outer Rim Shadow & Bezel */}
        <circle cx="50" cy="52" r="48" fill="#cbd5e1" />
        <circle cx="50" cy="50" r="48" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
        
        {/* Inner Clock Face */}
        <circle cx="50" cy="50" r="40" fill="#ffffff" />
        
        {/* 12 Hour Numbers */}
        {[...Array(12)].map((_, i) => {
          const hour = i === 0 ? 12 : i;
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = 50 + 29 * Math.cos(angle);
          const y = 50 + 29 * Math.sin(angle);
          return (
            <text
              key={`h-${i}`}
              x={x} y={y}
              fill="#1e293b"
              fontSize="12"
              fontWeight="900"
              fontFamily="'Nunito', 'Comic Sans MS', sans-serif"
              textAnchor="middle"
              alignmentBaseline="central"
            >
              {hour}
            </text>
          );
        })}

        {/* 60 Minute Marks */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 === 0) return null;
          return (
            <line
              key={`m-${i}`}
              x1="50" y1="11"
              x2="50" y2="13"
              stroke="#94a3b8"
              strokeWidth="1"
              strokeLinecap="round"
              transform={`rotate(${i * 6} 50 50)`}
            />
          )
        })}

        {/* Hour Hand Shadow & Hand */}
        <line
          x1="50" y1="50" x2="50" y2="28"
          stroke="#94a3b8" strokeWidth="5" strokeLinecap="round"
          transform={`rotate(${hourAngle} 51 51)`}
        />
        <line
          x1="50" y1="50" x2="50" y2="28"
          stroke="#0f172a" strokeWidth="5" strokeLinecap="round"
          transform={`rotate(${hourAngle} 50 50)`}
        />

        {/* Minute Hand Shadow & Hand */}
        <line
          x1="50" y1="50" x2="50" y2="15"
          stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"
          transform={`rotate(${minuteAngle} 51 51)`}
        />
        <line
          x1="50" y1="50" x2="50" y2="15"
          stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
          transform={`rotate(${minuteAngle} 50 50)`}
        />

        {/* Center Dots */}
        <circle cx="50" cy="50" r="5" fill="#0f172a" />
        <circle cx="50" cy="50" r="2.5" fill="#facc15" />
      </svg>
    </div>
  );
};

export const parseQuestionText = (text) => {
  if (!text) return { text: '', clockTime: null, inlineSvg: null };
  let newText = text;
  let clockTime = null;
  let inlineSvg = null;

  const clockMatch = newText.match(/\[CLOCK:(\d{1,2}:\d{2})\]/i);
  if (clockMatch) {
    clockTime = clockMatch[1];
    newText = newText.replace(clockMatch[0], '').trim();
  }

  const svgMatch = newText.match(/<svg[\s\S]*?<\/svg>/i);
  if (svgMatch) {
    inlineSvg = svgMatch[0];
    newText = newText.replace(svgMatch[0], '').trim();
  }

  return { text: newText, clockTime, inlineSvg };
};
