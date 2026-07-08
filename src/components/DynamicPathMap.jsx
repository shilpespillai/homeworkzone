import React from 'react';
import * as Icons from 'lucide-react';

export default function DynamicPathMap({ data }) {
  if (!data || !data.points || !Array.isArray(data.points)) return null;

  const { points, showArrows = true, closed = false } = data;

  // Render a specific icon from lucide-react, fallback to MapPin
  const renderIcon = (iconName, size = 16, color = '#334155') => {
    const IconComponent = Icons[iconName] || Icons.MapPin;
    return <IconComponent size={size} color={color} className="stroke-[2.5px]" />;
  };

  // Helper to calculate angle for arrow rotation
  const getAngle = (p1, p2) => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  };

  // Build the SVG path string
  let pathString = '';
  points.forEach((p, i) => {
    if (i === 0) pathString += `M ${p.x} ${p.y} `;
    else pathString += `L ${p.x} ${p.y} `;
  });
  if (closed && points.length > 2) {
    pathString += 'Z';
  }

  // Create segments for rendering arrows at midpoints
  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    segments.push({ p1: points[i], p2: points[i+1] });
  }
  if (closed && points.length > 2) {
    segments.push({ p1: points[points.length - 1], p2: points[0] });
  }

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-[#f8fafc] rounded-2xl border-4 border-slate-200 overflow-hidden shadow-inner p-4">
      {/* Container to hold the 100x100 coordinate system relative to its parent */}
      <div className="relative w-full h-full">
        {/* SVG layer for lines and arrows */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Main Path */}
          <path 
            d={pathString} 
            fill={closed ? "rgba(203, 213, 225, 0.3)" : "none"}
            stroke="#94a3b8" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Directional Arrows at midpoints */}
          {showArrows && segments.map((seg, idx) => {
            const midX = (seg.p1.x + seg.p2.x) / 2;
            const midY = (seg.p1.y + seg.p2.y) / 2;
            const angle = getAngle(seg.p1, seg.p2);
            
            return (
              <g 
                key={`arrow-${idx}`}
                transform={`translate(${midX}, ${midY}) rotate(${angle})`}
              >
                {/* Arrowhead */}
                <polygon 
                  points="-1.5,-1.5 1.5,0 -1.5,1.5" 
                  fill="#f1f5f9"
                  stroke="#64748b"
                  strokeWidth="0.5"
                />
              </g>
            );
          })}
        </svg>

        {/* HTML layer for icons and labels (perfectly positioned over the SVG) */}
        {points.map((p, idx) => (
          <div 
            key={`point-${idx}`}
            className="absolute flex flex-col items-center justify-center pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)' // Center exactly on coordinate
            }}
          >
            {/* The actual dot/vertex */}
            <div className="w-2 h-2 rounded-full bg-slate-800 border border-white shadow-sm" />
            
            {/* Icon (if provided) */}
            {p.icon && (
              <div className="absolute bottom-3 mb-0.5">
                {renderIcon(p.icon)}
              </div>
            )}
            
            {/* Label (if provided) */}
            {p.label && (
              <div className="absolute top-3 mt-0.5 whitespace-nowrap bg-white/80 px-1 rounded text-[10px] font-bold text-slate-700 shadow-sm">
                {p.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
