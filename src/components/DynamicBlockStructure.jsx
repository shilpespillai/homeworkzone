import React from 'react';

export default function DynamicBlockStructure({ data }) {
  if (!data) return null;

  let grid = [];
  if (data.grid && Array.isArray(data.grid) && Array.isArray(data.grid[0])) {
    grid = data.grid;
  } else if (data.rows && Array.isArray(data.rows)) {
    grid = data.rows.map(r => r.columns || []);
  }

  if (!grid || grid.length === 0 || !Array.isArray(grid[0])) return null;

  const rows = grid.length;
  const cols = Math.max(...grid.map(row => (row && row.length) ? row.length : 0));
  
  if (rows === 0 || cols === 0) return null;

  // Dimensions of a single isometric face
  const w = 24; // half-width
  const h = 12; // half-height

  // Find max height to calculate bounding box
  let maxZ = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] > maxZ) maxZ = grid[y][x];
    }
  }

  // Calculate bounding box for the viewBox
  const minX = (0 - (rows - 1)) * w - w;
  const maxX = ((cols - 1) - 0) * w + w;
  
  // The highest point on screen is the top of the tallest block in the back row
  const minY = (0 + 0) * h - (maxZ * 2 * h);
  // The lowest point is the bottom of the front-most block
  const maxY = ((cols - 1) + (rows - 1)) * h + (4 * h);

  const viewBoxWidth = maxX - minX + (w * 2);
  const viewBoxHeight = maxY - minY + (h * 4);
  
  // Shift origin so everything fits in the SVG positively
  const originX = Math.abs(minX) + w;
  const originY = Math.abs(minY) + h * 2;

  // Build the list of cubes to draw
  const cubes = [];
  
  // We draw back to front:
  // y from 0 to rows-1 (y=0 is back row)
  // x from 0 to cols-1 (x=0 is leftmost column)
  // z from 0 to height-1 (z=0 is bottom)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const height = grid[y][x];
      for (let z = 0; z < height; z++) {
        cubes.push({ x, y, z });
      }
    }
  }

  return (
    <div className="flex justify-center items-center w-full my-6 bg-slate-50/50 rounded-[32px] p-8 border-4 border-slate-100 shadow-inner">
      <svg 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        className="w-full max-w-[300px] drop-shadow-md"
      >
        {cubes.map((cube, i) => {
          const { x, y, z } = cube;
          
          // Calculate center of the top face for this specific block
          const cx = originX + (x - y) * w;
          const cy = originY + (x + y) * h - (z * 2 * h);

          // Beautiful toy block color palettes (top, left, right)
          const palettes = [
            { top: "#bae6fd", left: "#38bdf8", right: "#0284c7" }, // Blue
            { top: "#fef08a", left: "#facc15", right: "#ca8a04" }, // Yellow
            { top: "#a7f3d0", left: "#34d399", right: "#059669" }, // Green
            { top: "#fecdd3", left: "#fb7185", right: "#e11d48" }, // Red/Pink
            { top: "#c7d2fe", left: "#818cf8", right: "#4f46e5" }, // Indigo
            { top: "#fed7aa", left: "#fb923c", right: "#ea580c" }, // Orange
          ];

          const paletteIdx = (x + y) % palettes.length;
          const { top: colorTop, left: colorLeft, right: colorRight } = palettes[paletteIdx];
          const strokeColor = "#1e293b"; // Dark outline for comic/cartoon style

          return (
            <g key={`cube-${x}-${y}-${z}`}>
              {/* Top Face */}
              <polygon
                points={`
                  ${cx},${cy} 
                  ${cx + w},${cy + h} 
                  ${cx},${cy + 2 * h} 
                  ${cx - w},${cy + h}
                `}
                fill={colorTop}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Left Face */}
              <polygon
                points={`
                  ${cx - w},${cy + h} 
                  ${cx},${cy + 2 * h} 
                  ${cx},${cy + 4 * h} 
                  ${cx - w},${cy + 3 * h}
                `}
                fill={colorLeft}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Right Face */}
              <polygon
                points={`
                  ${cx},${cy + 2 * h} 
                  ${cx + w},${cy + h} 
                  ${cx + w},${cy + 3 * h} 
                  ${cx},${cy + 4 * h}
                `}
                fill={colorRight}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
