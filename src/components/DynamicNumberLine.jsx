import React from 'react';

export default function DynamicNumberLine({ data }) {
  if (!data || typeof data !== 'object') return null;

  const { min = 0, max = 1, points = [], showLabels = true } = data;

  // points should be an array of objects: { value: 0.33, label: 'A' }
  // Ensure we sort them by value just for rendering consistency, but preserve labels if provided
  
  return (
    <div className="w-full py-12 px-4 select-none">
      <div className="relative w-full h-2 bg-slate-300 rounded-full">
        {/* Min Tick */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-800 rounded-full" />
        <div className="absolute left-0 -top-8 -translate-x-1/2 text-xl font-black text-slate-800">{min}</div>
        
        {/* Max Tick */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-800 rounded-full" />
        <div className="absolute right-0 -top-8 translate-x-1/2 text-xl font-black text-slate-800">{max}</div>

        {/* Arrow at the end of the line to show it continues (optional, but looks good for number lines) */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 border-y-8 border-y-transparent border-l-[12px] border-l-slate-300" />

        {/* Render Points */}
        {points.map((pt, idx) => {
          const value = typeof pt === 'number' ? pt : pt.value;
          const label = pt.label || String.fromCharCode(65 + idx); // A, B, C, D...
          
          // Calculate percentage position (0 to 100)
          const range = max - min;
          const clampedValue = Math.max(min, Math.min(max, value));
          const percentage = ((clampedValue - min) / range) * 100;

          return (
            <div 
              key={`pt-${idx}`} 
              className="absolute top-1/2 flex flex-col items-center"
              style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
            >
              {/* Tick Mark for the point itself (optional, some number lines have just arrows) */}
              {/* The image showed arrows pointing UP to the line, with boxes below */}
              <div className="w-0.5 h-4 bg-slate-400 mt-2 mb-1" />
              
              {/* Arrow head pointing up */}
              <div className="w-0 h-0 border-x-4 border-x-transparent border-b-[8px] border-b-[#38BDF8] rotate-180 mb-1" />
              
              {/* Arrow shaft */}
              <div className="w-1 h-6 bg-[#38BDF8] mb-1" />

              {/* Label Box */}
              <div className="w-10 h-6 rounded-full border-2 border-[#38BDF8] bg-white flex items-center justify-center shadow-sm">
                 <span className="text-xs font-black text-[#0284C7]">{showLabels ? label : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
