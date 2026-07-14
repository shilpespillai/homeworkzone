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
    <div className="flex flex-col items-center w-full max-w-md mx-auto my-4 bg-slate-50/50 p-6 rounded-[32px] border-4 border-slate-100 shadow-inner relative">
      {/* Outside items */}
      {outsideItems.length > 0 && (
        <div className="absolute top-4 left-4 text-xs font-black text-rose-500 bg-rose-50 border-2 border-rose-200 px-3 py-1.5 rounded-full shadow-sm z-10">
          Outside: {outsideItems.join(', ')}
        </div>
      )}
      
      <svg viewBox="0 0 400 300" className="w-full h-auto drop-shadow-lg">
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
        <circle cx="150" cy="150" r="100" fill="url(#leftGrad)" stroke="#0284c7" strokeWidth="4" />
        
        {/* Right Circle */}
        <circle cx="250" cy="150" r="100" fill="url(#rightGrad)" stroke="#d97706" strokeWidth="4" />

        {/* Labels */}
        <text x="110" y="35" textAnchor="middle" fill="#0369a1" fontSize="18" fontFamily="'Nunito', 'Comic Sans MS', sans-serif" fontWeight="900">{leftLabel}</text>
        <text x="290" y="35" textAnchor="middle" fill="#b45309" fontSize="18" fontFamily="'Nunito', 'Comic Sans MS', sans-serif" fontWeight="900">{rightLabel}</text>

        {/* Left Items */}
        <foreignObject x="60" y="70" width="80" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center h-full space-y-2">
            {leftItems.map((item, idx) => (
              <span key={idx} className="text-xs font-black text-sky-900 bg-white border-2 border-sky-300 px-2.5 py-1 rounded-xl shadow-sm text-center break-words max-w-full leading-tight font-sans">
                {item}
              </span>
            ))}
          </div>
        </foreignObject>

        {/* Right Items */}
        <foreignObject x="260" y="70" width="80" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center h-full space-y-2">
            {rightItems.map((item, idx) => (
              <span key={idx} className="text-xs font-black text-amber-950 bg-white border-2 border-amber-300 px-2.5 py-1 rounded-xl shadow-sm text-center break-words max-w-full leading-tight font-sans">
                {item}
              </span>
            ))}
          </div>
        </foreignObject>

        {/* Intersection Items */}
        <foreignObject x="160" y="70" width="80" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center h-full space-y-2">
            {intersectionItems.map((item, idx) => (
              <span key={idx} className="text-xs font-black text-emerald-950 bg-white border-2 border-emerald-300 px-2.5 py-1 rounded-xl shadow-sm text-center break-words max-w-full leading-tight font-sans border border-slate-200">
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
