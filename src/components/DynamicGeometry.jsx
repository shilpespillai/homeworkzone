import React from 'react';

export default function DynamicGeometry({ data }) {
  if (!data || !data.type) return null;

  const { type, labels = {} } = data;
  const { width, height, radius, base } = labels;

  const renderShape = () => {
    switch (type.toLowerCase()) {
      case 'rectangle':
        return (
          <svg viewBox="-20 -20 240 140" className="w-full h-full drop-shadow-md">
            <rect x="0" y="0" width="200" height="100" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="4" />
            {width && <text x="100" y="-10" textAnchor="middle" fill="#0369a1" fontWeight="bold" fontSize="14">{width}</text>}
            {height && <text x="-10" y="55" textAnchor="middle" fill="#0369a1" fontWeight="bold" fontSize="14" transform="rotate(-90 -10 55)">{height}</text>}
          </svg>
        );
      
      case 'triangle':
        return (
          <svg viewBox="-20 -20 240 240" className="w-full h-full drop-shadow-md">
            <polygon points="100,0 200,200 0,200" fill="#fde047" stroke="#eab308" strokeWidth="4" />
            {base && <text x="100" y="220" textAnchor="middle" fill="#a16207" fontWeight="bold" fontSize="16">{base}</text>}
            {height && (
              <>
                <line x1="100" y1="0" x2="100" y2="200" stroke="#ca8a04" strokeWidth="2" strokeDasharray="4 4" />
                <text x="110" y="120" textAnchor="start" fill="#a16207" fontWeight="bold" fontSize="16">{height}</text>
              </>
            )}
          </svg>
        );

      case 'circle':
        return (
          <svg viewBox="-20 -20 240 240" className="w-full h-full drop-shadow-md">
            <circle cx="100" cy="100" r="100" fill="#fbcfe8" stroke="#ec4899" strokeWidth="4" />
            <circle cx="100" cy="100" r="4" fill="#be185d" />
            <line x1="100" y1="100" x2="200" y2="100" stroke="#be185d" strokeWidth="3" />
            {radius && <text x="150" y="90" textAnchor="middle" fill="#be185d" fontWeight="bold" fontSize="16">{radius}</text>}
          </svg>
        );

      case 'cylinder':
        return (
          <svg viewBox="-40 -20 280 260" className="w-full h-full drop-shadow-md">
            {/* Back curve of bottom ellipse */}
            <path d="M0,200 A100,30 0 0,1 200,200" fill="none" stroke="#65a30d" strokeWidth="2" strokeDasharray="4 4" />
            {/* Body */}
            <path d="M0,40 L0,200 A100,30 0 0,0 200,200 L200,40 Z" fill="#d9f99d" stroke="#65a30d" strokeWidth="4" />
            {/* Top ellipse */}
            <ellipse cx="100" cy="40" rx="100" ry="30" fill="#bef264" stroke="#65a30d" strokeWidth="4" />
            
            {height && (
              <>
                <line x1="220" y1="40" x2="220" y2="200" stroke="#4d7c0f" strokeWidth="2" />
                <line x1="215" y1="40" x2="225" y2="40" stroke="#4d7c0f" strokeWidth="2" />
                <line x1="215" y1="200" x2="225" y2="200" stroke="#4d7c0f" strokeWidth="2" />
                <text x="235" y="125" textAnchor="start" fill="#4d7c0f" fontWeight="bold" fontSize="16">{height}</text>
              </>
            )}
            {radius && (
              <>
                <circle cx="100" cy="40" r="3" fill="#4d7c0f" />
                <line x1="100" y1="40" x2="200" y2="40" stroke="#4d7c0f" strokeWidth="2" />
                <text x="150" y="30" textAnchor="middle" fill="#4d7c0f" fontWeight="bold" fontSize="16">{radius}</text>
              </>
            )}
          </svg>
        );

      case 'cube':
        return (
          <svg viewBox="-20 -20 240 240" className="w-full h-full drop-shadow-md">
            <polygon points="60,0 180,0 180,120 60,120" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
            <polygon points="0,40 120,40 180,0 60,0" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2" />
            <polygon points="120,40 180,0 180,120 120,160" fill="#a5b4fc" stroke="#6366f1" strokeWidth="2" />
            <polygon points="0,40 120,40 120,160 0,160" fill="#818cf8" stroke="#6366f1" strokeWidth="2" />
            
            {width && <text x="60" y="180" textAnchor="middle" fill="#4338ca" fontWeight="bold" fontSize="14">{width}</text>}
            {height && <text x="-15" y="105" textAnchor="middle" fill="#4338ca" fontWeight="bold" fontSize="14" transform="rotate(-90 -15 105)">{height}</text>}
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-6 flex justify-center items-center">
      <div className="w-48 h-48 sm:w-64 sm:h-64">
        {renderShape()}
      </div>
    </div>
  );
}
