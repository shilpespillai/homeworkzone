import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function DynamicGridMap({ data }) {
  if (!data || typeof data !== 'object') return null;

  const { 
    columns = 5, 
    rows = 5, 
    items = [], 
    showCompass = false, 
    scale = null,
    streetStyle = false
  } = data;

  // Generate column labels (A, B, C...)
  const getColLabel = (index) => String.fromCharCode(65 + index);
  
  // Calculate grid dimensions
  const colLabels = Array.from({ length: columns }, (_, i) => getColLabel(i));
  const rowLabels = Array.from({ length: rows }, (_, i) => rows - i); // Top to bottom: 5, 4, 3, 2, 1

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-6 flex flex-col items-center relative">
      
      {/* Compass */}
      {showCompass && (
        <div className="absolute top-4 left-4 flex flex-col items-center opacity-70">
          <span className="text-xs font-black text-slate-600 mb-1">N</span>
          <LucideIcons.ArrowUp size={24} className="text-slate-800" strokeWidth={3} />
        </div>
      )}

      <div 
        className={`relative ${streetStyle ? 'bg-slate-300' : 'bg-white'} border-2 border-slate-300 rounded-lg shadow-sm`}
        style={{
          display: 'grid',
          gridTemplateColumns: `40px repeat(${columns}, minmax(40px, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(40px, 1fr)) 40px`,
          gap: streetStyle ? '8px' : '1px',
          backgroundColor: streetStyle ? '#94a3b8' : '#cbd5e1', // Thicker gaps for streets
          padding: streetStyle ? '8px' : '1px'
        }}
      >
        {/* Y-axis labels (left) and grid cells */}
        {rowLabels.map((rowLabel, rowIndex) => (
          <React.Fragment key={`row-${rowLabel}`}>
            {/* Y-axis label */}
            <div className="bg-slate-50 flex items-center justify-center font-black text-slate-500 text-sm m-[-8px] mr-0 ml-[-8px]">
              {rowLabel}
            </div>
            
            {/* Grid cells for this row */}
            {colLabels.map((colLabel, colIndex) => {
              const cellItems = items.filter(item => {
                if (item.coordinate) {
                  return item.coordinate.toUpperCase() === `${colLabel}${rowLabel}`;
                }
                return item.col === colLabel && item.row === rowLabel;
              });

              return (
                <div 
                  key={`${colLabel}${rowLabel}`} 
                  className={`${streetStyle ? 'bg-slate-200 rounded-sm' : 'bg-white'} flex flex-col items-center justify-center p-2 relative min-h-[60px]`}
                >
                  {cellItems.map((item, i) => {
                    const IconComponent = LucideIcons[item.icon] || LucideIcons['MapPin'];
                    return (
                      <div key={i} className="flex flex-col items-center justify-center">
                        <IconComponent className="w-6 h-6 text-indigo-500 mb-1" strokeWidth={2.5} />
                        <span className="text-[10px] font-bold text-slate-700 text-center leading-tight bg-slate-100/80 px-1 rounded-md shadow-sm">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* Bottom-left empty corner */}
        <div className="bg-slate-50 m-[-8px]"></div>

        {/* X-axis labels (bottom) */}
        {colLabels.map((colLabel) => (
          <div key={`col-${colLabel}`} className="bg-slate-50 flex items-center justify-center font-black text-slate-500 text-sm m-[-8px] mt-0">
            {colLabel}
          </div>
        ))}
      </div>

      {/* Scale Bar */}
      {scale && (
        <div className="mt-6 flex flex-col items-start self-start ml-12">
          <div className="flex items-end h-4 border-b-2 border-l-2 border-r-2 border-slate-800 w-32 relative">
            <span className="absolute -top-4 left-0 text-[10px] font-bold text-slate-600 -translate-x-1/2">0</span>
            <span className="absolute -top-4 right-0 text-[10px] font-bold text-slate-600 translate-x-1/2">{scale}</span>
          </div>
        </div>
      )}

    </div>
  );
}
