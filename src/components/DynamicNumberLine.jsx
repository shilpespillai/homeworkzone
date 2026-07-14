import React from 'react';

export default function DynamicNumberLine({ data }) {
  if (!data || typeof data !== 'object') return null;

  const { min = 0, max = 1, points = [], showLabels = true } = data;

  // points should be an array of objects: { value: 0.33, label: 'A' }
  // Ensure we sort them by value just for rendering consistency, but preserve labels if provided
  
  return (
    <div className="w-full py-14 px-6 select-none bg-slate-50/50 rounded-[32px] border-4 border-slate-100 shadow-inner my-6">
      <div className="relative w-full h-3 bg-indigo-200 border-2 border-indigo-400 rounded-full">
        {/* Min Tick */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-full" />
        <div className="absolute left-0 -top-8 -translate-x-1/2 text-xl font-black text-indigo-700">{min}</div>
        
        {/* Max Tick */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-full" />
        <div className="absolute right-0 -top-8 translate-x-1/2 text-xl font-black text-indigo-700">{max}</div>

        {/* Arrow at the end of the line */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 border-y-8 border-y-transparent border-l-[12px] border-l-indigo-400" />

        {/* Render Points */}
        {points.map((pt, idx) => {
          const value = typeof pt === 'number' ? pt : pt.value;
          const label = pt.label || String.fromCharCode(65 + idx); // A, B, C, D...
          
          const range = max - min;
          const clampedValue = Math.max(min, Math.min(max, value));
          const percentage = ((clampedValue - min) / range) * 100;

          return (
            <div 
              key={`pt-${idx}`} 
              className="absolute top-1/2 flex flex-col items-center"
              style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
            >
              {/* Tick Mark for the point itself */}
              <div className="w-1 h-5 bg-indigo-400 mt-2 mb-1" />
              
              {/* Arrow head pointing up */}
              <div className="w-0 h-0 border-x-6 border-x-transparent border-b-[10px] border-b-[#f43f5e] rotate-180 mb-1" />
              
              {/* Arrow shaft */}
              <div className="w-1.5 h-6 bg-[#f43f5e] mb-1" />

              {/* Label Box */}
              <div className="w-10 h-7 rounded-2xl border-4 border-[#f43f5e] bg-white flex items-center justify-center shadow-lg">
                 <span className="text-sm font-black text-[#e11d48]">{showLabels ? label : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
