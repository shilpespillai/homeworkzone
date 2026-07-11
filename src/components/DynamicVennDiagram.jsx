import React from 'react';

const DynamicVennDiagram = ({ data }) => {
  if (!data) return null;

  const {
    leftLabel = 'Set A',
    rightLabel = 'Set B',
    leftItems = [],
    rightItems = [],
    intersectionItems = [],
    outsideItems = []
  } = data;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto my-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative">
      {/* Outside items */}
      {outsideItems.length > 0 && (
        <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 z-10">
          Outside: {outsideItems.join(', ')}
        </div>
      )}
      
      <svg viewBox="0 0 400 300" className="w-full h-auto drop-shadow-sm">
        <defs>
          <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="rightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Left Circle */}
        <circle cx="150" cy="150" r="100" fill="url(#leftGrad)" stroke="#0284c7" strokeWidth="2" />
        
        {/* Right Circle */}
        <circle cx="250" cy="150" r="100" fill="url(#rightGrad)" stroke="#d97706" strokeWidth="2" />

        {/* Labels */}
        <text x="100" y="35" textAnchor="middle" fill="#0284c7" className="text-sm font-black" fontWeight="bold">{leftLabel}</text>
        <text x="300" y="35" textAnchor="middle" fill="#d97706" className="text-sm font-black" fontWeight="bold">{rightLabel}</text>

        {/* Left Items */}
        <foreignObject x="60" y="70" width="80" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center h-full space-y-1">
            {leftItems.map((item, idx) => (
              <span key={idx} className="text-[10px] font-bold text-sky-900 bg-sky-100/50 px-1.5 py-0.5 rounded shadow-sm text-center break-words max-w-full leading-tight">
                {item}
              </span>
            ))}
          </div>
        </foreignObject>

        {/* Right Items */}
        <foreignObject x="260" y="70" width="80" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center h-full space-y-1">
            {rightItems.map((item, idx) => (
              <span key={idx} className="text-[10px] font-bold text-amber-900 bg-amber-100/50 px-1.5 py-0.5 rounded shadow-sm text-center break-words max-w-full leading-tight">
                {item}
              </span>
            ))}
          </div>
        </foreignObject>

        {/* Intersection Items */}
        <foreignObject x="160" y="70" width="80" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center h-full space-y-1">
            {intersectionItems.map((item, idx) => (
              <span key={idx} className="text-[10px] font-bold text-slate-800 bg-white/80 px-1.5 py-0.5 rounded shadow-sm text-center break-words max-w-full leading-tight border border-slate-200">
                {item}
              </span>
            ))}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

export default DynamicVennDiagram;
