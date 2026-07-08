import React from 'react';

export default function DynamicInstrument({ data }) {
  if (!data || !data.type) return null;

  const { type, min = 0, max = 100, value = 50, unit = '', step = 10 } = data;

  // Calculate percentage for fill levels
  const getPercentage = () => {
    const range = max - min;
    const clampedValue = Math.max(min, Math.min(max, value));
    return ((clampedValue - min) / range) * 100;
  };

  // Generate tick marks
  const ticks = [];
  for (let i = min; i <= max; i += step) {
    ticks.push(i);
  }

  const percentage = getPercentage();

  if (type === 'thermometer') {
    return (
      <div className="flex flex-col items-center justify-center py-6 w-full max-w-[200px] mx-auto select-none">
        <div className="relative flex flex-col items-center">
          {/* Unit Label */}
          <div className="text-sm font-black text-slate-500 mb-2">{unit}</div>
          
          {/* Thermometer Body */}
          <div className="relative w-12 h-64 bg-slate-100 rounded-t-full border-4 border-slate-300 shadow-inner flex justify-center pb-8 z-10">
            {/* The liquid track */}
            <div className="absolute top-2 bottom-8 w-4 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="absolute bottom-0 w-full bg-red-500 transition-all duration-1000 ease-out"
                style={{ height: `${percentage}%` }}
              />
            </div>
            
            {/* Tick Marks (positioned outside the body to the right) */}
            <div className="absolute left-full ml-2 top-2 bottom-8 w-16">
              {ticks.map((tick, i) => {
                const tickPct = ((tick - min) / (max - min)) * 100;
                return (
                  <div 
                    key={i} 
                    className="absolute w-full flex items-center gap-1"
                    style={{ bottom: `${tickPct}%`, transform: 'translateY(50%)' }}
                  >
                    <div className="w-2 h-0.5 bg-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{tick}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Bulb */}
          <div className="w-20 h-20 bg-red-500 rounded-full border-4 border-slate-300 -mt-10 z-0 shadow-sm flex items-center justify-center">
             <div className="w-16 h-16 bg-red-400 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'beaker') {
    return (
      <div className="flex flex-col items-center justify-center py-6 w-full max-w-[250px] mx-auto select-none">
        <div className="relative flex flex-col items-center">
          {/* Unit Label */}
          <div className="text-sm font-black text-slate-500 mb-2">{unit}</div>
          
          {/* Beaker Body */}
          <div className="relative w-32 h-48 bg-blue-50/30 rounded-b-xl border-x-4 border-b-4 border-slate-300 flex flex-col justify-end overflow-hidden">
            
            {/* Liquid */}
            <div 
              className="w-full bg-blue-400/80 transition-all duration-1000 ease-out border-t-2 border-blue-500 relative"
              style={{ height: `${percentage}%` }}
            >
              {/* Subtle liquid shine */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-white/20" />
            </div>

            {/* Tick Marks (Overlayed on left side) */}
            <div className="absolute left-0 bottom-0 top-0 w-12 border-r border-slate-300/50">
              {ticks.map((tick, i) => {
                const tickPct = ((tick - min) / (max - min)) * 100;
                // Don't render the 0 tick at the very bottom edge if it looks crowded
                if (tick === min) return null;
                return (
                  <div 
                    key={i} 
                    className="absolute w-full flex items-center gap-1"
                    style={{ bottom: `${tickPct}%`, transform: 'translateY(50%)' }}
                  >
                    <div className="w-3 h-0.5 bg-slate-500" />
                    <span className="text-[10px] font-bold text-slate-700">{tick}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Beaker Lip */}
          <div className="w-36 h-2 bg-slate-300 rounded-full -mt-49" style={{ marginTop: '-194px' }} />
        </div>
      </div>
    );
  }

  if (type === 'ruler') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 w-full select-none">
        {/* Measured Object */}
        <div className="w-full relative mb-1 h-12">
           <div 
             className="absolute left-0 bottom-0 h-8 bg-amber-400 rounded-sm border-2 border-amber-600 shadow-sm flex items-center justify-center overflow-hidden"
             style={{ width: `${percentage}%` }}
           >
              {/* Pattern for the object (looks like a pencil or block) */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #000 5px, #000 10px)' }} />
           </div>
           
           {/* Dotted line showing exact measurement */}
           <div 
             className="absolute bottom-0 h-16 border-l-2 border-dashed border-red-500 z-10"
             style={{ left: `${percentage}%` }}
           />
        </div>

        {/* Ruler Body */}
        <div className="w-full relative h-16 bg-[#fbbf24] border-2 border-amber-700 rounded-sm shadow-md flex items-start px-[1px]">
          {ticks.map((tick, i) => {
            const tickPct = ((tick - min) / (max - min)) * 100;
            return (
              <div 
                key={i} 
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${tickPct}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-0.5 h-4 bg-amber-900" />
                <span className="text-xs font-black text-amber-900 mt-1">{tick}</span>
              </div>
            );
          })}
          {/* Sub-ticks for extra realism */}
          {[...Array(Math.floor((max - min) / (step / 2)))].map((_, i) => {
            const subTickVal = min + (i * (step / 2));
            if (ticks.includes(subTickVal)) return null;
            const tickPct = ((subTickVal - min) / (max - min)) * 100;
            return (
              <div 
                key={`sub-${i}`} 
                className="absolute top-0 w-px h-2 bg-amber-800/60"
                style={{ left: `${tickPct}%`, transform: 'translateX(-50%)' }}
              />
            );
          })}
          
          <div className="absolute bottom-1 right-2 text-[10px] font-black text-amber-900/60">{unit}</div>
        </div>
      </div>
    );
  }

  return null;
}
