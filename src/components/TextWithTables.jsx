import React from 'react';

const TextWithTables = ({ text }) => {
  if (!text) return null;
  if (typeof text !== "string") return text;

  let processed = text.replace(/\|\s*\|/g, '|\n|');
  processed = processed.replace(/([.:])\s*\|/g, '$1\n|');
  processed = processed.replace(/\|\s*([A-Z])/g, '|\n$1');
  processed = processed.replace(/\\n/g, '\n');

  if (!processed.includes('|')) {
    return <div className="whitespace-pre-wrap">{processed}</div>;
  }

  const lines = processed.split('\n');
  const elements = [];
  let tableLines = [];
  
  const flushTable = () => {
    if (tableLines.length > 0) {
      const isSeparator = (line) => {
         const cleaned = line.replace(/[^|\-:\s]/g, '');
         return cleaned.length === line.length && line.includes('-');
      };
      
      const rows = tableLines.filter(l => !isSeparator(l)).map(l => {
         return l.split('|').filter((cell, i, arr) => {
            if (i === 0 && cell.trim() === '') return false;
            if (i === arr.length - 1 && cell.trim() === '') return false;
            return true;
         }).map(cell => cell.trim());
      });
      
      if (rows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto my-6 w-full rounded-xl shadow-sm border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm md:text-base">
              <thead className="bg-slate-100">
                <tr>
                  {rows[0].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left font-extrabold text-slate-700 border-r last:border-r-0 border-slate-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {rows.slice(1).map((row, ri) => (
                  <tr key={ri} className="hover:bg-slate-50 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-5 py-3 text-slate-600 font-bold border-r last:border-r-0 border-slate-100">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      tableLines = [];
    }
  };

  let buffer = [];
  lines.forEach(line => {
    if (line.includes('|') && line.split('|').length > 2) {
      if (buffer.length > 0) {
        elements.push(<div key={`text-${elements.length}`} className="whitespace-pre-wrap mb-2">{buffer.join('\n')}</div>);
        buffer = [];
      }
      tableLines.push(line);
    } else {
      flushTable();
      buffer.push(line);
    }
  });
  flushTable();
  
  if (buffer.length > 0) {
    elements.push(<div key={`text-${elements.length}`} className="whitespace-pre-wrap">{buffer.join('\n')}</div>);
  }

  return <div className="space-y-2">{elements}</div>;
};

export default TextWithTables;
