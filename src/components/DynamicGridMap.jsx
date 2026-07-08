import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function DynamicGridMap({ data }) {
  if (!data || typeof data !== 'object') return null;

  const { columns = 5, rows = 5, items = [] } = data;

  // Generate column labels (A, B, C...)
  const getColLabel = (index) => String.fromCharCode(65 + index);
  
  // Calculate grid dimensions
  const colLabels = Array.from({ length: columns }, (_, i) => getColLabel(i));
  const rowLabels = Array.from({ length: rows }, (_, i) => rows - i); // Top to bottom: 5, 4, 3, 2, 1

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-6 flex flex-col items-center">
      <div 
        className="relative bg-white border-2 border-slate-300 rounded-lg shadow-sm"
        style={{
          display: 'grid',
          gridTemplateColumns: `40px repeat(${columns}, minmax(40px, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(40px, 1fr)) 40px`,
          gap: '1px',
          backgroundColor: '#cbd5e1', // Grid line color
          padding: '1px'
        }}
      >
        {/* Y-axis labels (left) and grid cells */}
        {rowLabels.map((rowLabel, rowIndex) => (
          <React.Fragment key={`row-${rowLabel}`}>
            {/* Y-axis label */}
            <div className="bg-slate-50 flex items-center justify-center font-black text-slate-500 text-sm">
              {rowLabel}
            </div>
            
            {/* Grid cells for this row */}
            {colLabels.map((colLabel, colIndex) => {
              // Check if any item is at this coordinate
              // We support matching either by direct string like "A3" or by explicit col/row
              const cellItems = items.filter(item => {
                if (item.coordinate) {
                  return item.coordinate.toUpperCase() === `${colLabel}${rowLabel}`;
                }
                return item.col === colLabel && item.row === rowLabel;
              });

              return (
                <div key={`${colLabel}${rowLabel}`} className="bg-white flex flex-col items-center justify-center p-2 relative min-h-[60px]">
                  {cellItems.map((item, i) => {
                    const IconComponent = LucideIcons[item.icon] || LucideIcons['MapPin'];
                    return (
                      <div key={i} className="flex flex-col items-center justify-center">
                        <IconComponent className="w-6 h-6 text-indigo-500 mb-1" strokeWidth={2.5} />
                        <span className="text-[10px] font-bold text-slate-700 text-center leading-tight bg-slate-100/80 px-1 rounded-md">
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
        <div className="bg-slate-50"></div>

        {/* X-axis labels (bottom) */}
        {colLabels.map((colLabel) => (
          <div key={`col-${colLabel}`} className="bg-slate-50 flex items-center justify-center font-black text-slate-500 text-sm">
            {colLabel}
          </div>
        ))}
      </div>
    </div>
  );
}
