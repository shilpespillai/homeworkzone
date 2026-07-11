import React from 'react';
import { Apple, Star, Car, Heart, Circle, Square, Triangle, Bird, Bug, Cat, Dog, Fish, Flower2 } from 'lucide-react';

const ICON_MAP = {
  Apple, Star, Car, Heart, Circle, Square, Triangle, Bird, Bug, Cat, Dog, Fish, Flower2
};

const EarlyMathVisualizer = ({ data }) => {
  if (!data || !data.type) return null;

  const { type, groups = [], icon = 'Star' } = data;

  const renderCubes = () => {
    let globalIndex = 0;
    return (
      <div className="flex flex-wrap items-center justify-center gap-1 my-6">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="flex items-center">
            {Array.from({ length: group.count }).map((_, i) => {
              globalIndex++;
              return (
                <div 
                  key={`${gIdx}-${i}`} 
                  className={`w-12 h-12 flex items-center justify-center shadow-sm relative ${group.color ? group.color.replace('text-', 'bg-') : 'bg-blue-500'} border-2 border-black/10`}
                  style={{
                    borderRadius: '8px',
                    marginLeft: i > 0 ? '-4px' : '0', // Interlocking effect
                    zIndex: 100 - globalIndex
                  }}
                >
                  {/* The interlocking nub */}
                  <div className="absolute -right-2 w-3 h-6 bg-black/20 rounded-r-md" style={{ top: '50%', transform: 'translateY(-50%)', zIndex: -1 }}></div>
                  {/* The inner circle detail */}
                  <div className="w-6 h-6 rounded-full border-2 border-black/10 bg-white/10"></div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderObjects = () => {
    const IconComponent = ICON_MAP[icon] || Star;
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 my-6">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: group.count }).map((_, i) => (
              <IconComponent 
                key={`${gIdx}-${i}`} 
                className={`w-12 h-12 ${group.color || 'text-yellow-400'}`} 
                strokeWidth={1.5}
                fill="currentColor"
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderTenFrame = () => {
    // Generate an array of exactly 10 slots
    const slots = Array(10).fill(null);
    let currentSlot = 0;

    groups.forEach(group => {
      for (let i = 0; i < group.count && currentSlot < 10; i++) {
        slots[currentSlot] = group.color ? group.color.replace('text-', 'bg-') : 'bg-red-500';
        currentSlot++;
      }
    });

    return (
      <div className="flex justify-center my-6">
        <div className="grid grid-cols-5 grid-rows-2 gap-2 bg-white border-4 border-slate-800 p-2 rounded-xl">
          {slots.map((color, i) => (
            <div key={i} className="w-14 h-14 border-2 border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
              {color && (
                <div className={`w-10 h-10 rounded-full ${color} shadow-sm transform transition-all hover:scale-110`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-50/50 rounded-2xl p-4 border-2 border-slate-100 my-4">
      {type === 'cubes' && renderCubes()}
      {type === 'objects' && renderObjects()}
      {type === 'ten-frame' && renderTenFrame()}
    </div>
  );
};

export default EarlyMathVisualizer;
