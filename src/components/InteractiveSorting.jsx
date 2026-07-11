import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { GripVertical } from 'lucide-react';

export default function InteractiveSorting({ items, onReorder, disabled }) {
  const [list, setList] = useState(items || []);

  useEffect(() => {
    setList(items || []);
  }, [items]);

  const handleReorder = (newOrder) => {
    setList(newOrder);
    if (onReorder) {
      onReorder(newOrder);
    }
  };

  if (!list || list.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <Reorder.Group 
        axis="y" 
        values={list} 
        onReorder={handleReorder}
        className="space-y-3"
      >
        {list.map((item) => (
          <Reorder.Item
            key={item}
            value={item}
            className={`
              flex items-center justify-between p-4 bg-white rounded-2xl 
              border-4 border-slate-100 shadow-sm
              ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:border-indigo-300'}
              transition-colors
            `}
            dragListener={!disabled}
          >
            <span className="text-xl font-bold text-slate-700 select-none">
              {item}
            </span>
            <div className="text-slate-400">
              <GripVertical className="w-6 h-6" />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
