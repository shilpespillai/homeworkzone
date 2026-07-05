import React from 'react';

export const ClockFace = ({ timeStr }) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  const minuteAngle = minutes * 6;
  const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;

  return (
    <div className="flex justify-center my-6 w-full">
      <svg width="200" height="200" viewBox="0 0 100 100" className="drop-shadow-lg">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#334155" strokeWidth="4" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="1" />
        
        {/* 12 Hour Marks */}
        {[...Array(12)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="50" y1="10"
            x2="50" y2="15"
            stroke="#1e293b"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}

        {/* 60 Minute Marks */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 === 0) return null;
          return (
            <line
              key={`m-${i}`}
              x1="50" y1="10"
              x2="50" y2="12"
              stroke="#94a3b8"
              strokeWidth="1"
              strokeLinecap="round"
              transform={`rotate(${i * 6} 50 50)`}
            />
          )
        })}

        {/* Hour Hand */}
        <line
          x1="50" y1="50"
          x2="50" y2="25"
          stroke="#0f172a"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 50 50)`}
        />

        {/* Minute Hand */}
        <line
          x1="50" y1="50"
          x2="50" y2="15"
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 50 50)`}
        />

        {/* Center Dots */}
        <circle cx="50" cy="50" r="4" fill="#0f172a" />
        <circle cx="50" cy="50" r="2" fill="#ef4444" />
      </svg>
    </div>
  );
};

export const parseQuestionText = (text) => {
  if (!text) return { text: '', clockTime: null };
  const match = text.match(/\[CLOCK:(\d{1,2}:\d{2})\]/i);
  if (match) {
    return { 
      text: text.replace(match[0], '').trim(), 
      clockTime: match[1] 
    };
  }
  return { text, clockTime: null };
};
