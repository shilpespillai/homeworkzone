import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
// Used for the "unknown/hidden" segment
const UNKNOWN_COLOR = '#cbd5e1'; // slate-300

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].payload?.isUnknown ? '?' : payload[0].value;
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg">
        <p className="font-bold text-slate-700">{label || payload[0].name}</p>
        <p className="text-indigo-600 font-black">
          Value: {val}
        </p>
      </div>
    );
  }
  return null;
};

// Custom label for pie charts — hides value when unknown
const renderPieLabel = ({ name, percent, isUnknown }) => {
  if (isUnknown) return `${name} (?)`;
  return `${name} (${(percent * 100).toFixed(0)}%)`;
};

export default function DynamicChart({ data }) {
  if (!data) return null;

  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  const isArray = Array.isArray(parsedData);
  const actualData = isArray ? parsedData : parsedData.data;
  
  if (!actualData || actualData.length === 0) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-3xl p-6 flex items-center justify-center h-[300px] text-red-500 font-bold">
        Chart data is invalid or empty. Data received: {JSON.stringify(data)}
      </div>
    );
  }

  const type = isArray ? 'bar' : (parsedData.type || 'bar');
  const title = isArray ? null : parsedData.title;

  const headers = React.useMemo(() => {
    if (!actualData || actualData.length === 0) return ['Item', 'Value'];
    const sample = actualData[0];
    if (typeof sample !== 'object' || sample === null) return ['Item', 'Value'];
    const keys = Object.keys(sample);
    if (keys.length === 0) return ['Item', 'Value'];
    
    let valK = keys.find(k => typeof sample[k] === 'number');
    if (valK === undefined) {
      valK = keys.find(k => /value|val|temp|score|num|count|qty|price|cost/i.test(k));
    }
    if (valK === undefined) {
      valK = keys[1] || keys[0];
    }
    
    let nameK = keys.find(k => k !== valK);
    if (nameK === undefined) {
      nameK = keys[0];
    }
    
    const formatHeader = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    
    return [formatHeader(nameK), formatHeader(valK)];
  }, [actualData]);

  const chartData = actualData.map(row => {
    if (typeof row !== 'object' || row === null) {
      return { name: String(row), value: 0, displayValue: String(row), isUnknown: false };
    }
    
    const keys = Object.keys(row);
    if (keys.length === 0) return { name: '', value: 0, displayValue: '', isUnknown: false };
    
    let nameVal = '';
    let rawVal = '';
    
    if (row.name !== undefined && row.value !== undefined) {
      nameVal = row.name;
      rawVal = row.value;
    } else {
      let valueKey = keys.find(k => typeof row[k] === 'number');
      if (valueKey === undefined) {
        valueKey = keys.find(k => /value|val|temp|score|num|count|qty|price|cost/i.test(k));
      }
      if (valueKey === undefined) {
        valueKey = keys[1] || keys[0];
      }

      let nameKey = keys.find(k => k !== valueKey);
      if (nameKey === undefined) {
        nameKey = keys[0];
      }
      
      nameVal = row[nameKey];
      rawVal = row[valueKey];
    }

    // -1 signals a hidden/unknown value (the answer the student must find)
    const isUnknown = rawVal === -1 || rawVal === '-1';
    
    let numVal = 0;
    if (isUnknown) {
      // For pie charts, we still need a positive slice area.
      // Estimate: take the average of known values so the slice is visible but not revealing.
      numVal = -1; // will be replaced below for pie
    } else if (typeof rawVal === 'number') {
      numVal = rawVal;
    } else if (rawVal !== undefined && rawVal !== null) {
      const cleaned = String(rawVal).replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleaned);
      numVal = isNaN(parsed) ? 0 : parsed;
    }

    return {
      name: nameVal !== undefined ? String(nameVal) : '',
      value: numVal,
      displayValue: isUnknown ? '?' : (rawVal !== undefined ? String(rawVal) : ''),
      isUnknown,
    };
  });

  // For pie charts, replace -1 (unknown) with a proportional estimate so the slice is visible
  const knownTotal = chartData.filter(d => !d.isUnknown).reduce((s, d) => s + d.value, 0);
  const unknownCount = chartData.filter(d => d.isUnknown).length;
  const estimatedUnknown = unknownCount > 0
    ? Math.max(10, (100 - knownTotal) / unknownCount)
    : 10;
  const pieData = chartData.map(d =>
    d.isUnknown ? { ...d, value: estimatedUnknown } : d
  );

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderPieLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isUnknown ? UNKNOWN_COLOR : COLORS[index % COLORS.length]}
                    strokeDasharray={entry.isUnknown ? '6 3' : '0'}
                    stroke={entry.isUnknown ? '#94a3b8' : 'none'}
                    strokeWidth={entry.isUnknown ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
              <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={4} activeDot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'table':
        return (
          <div className="w-full h-full overflow-auto custom-scrollbar p-2 flex justify-center">
            <table className="w-full max-w-sm border-collapse rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <thead className="bg-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black text-slate-600 uppercase tracking-wider">{headers[0]}</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-slate-600 uppercase tracking-wider">{headers[1]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {chartData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-700 border-r border-slate-100">{row.name}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-black ${row.isUnknown ? 'text-slate-400 italic' : 'text-indigo-600'}`}>
                      {row.isUnknown ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-200 rounded-full text-slate-500 font-black text-base">?</span>
                      ) : row.displayValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
              <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}
                label={({ x, y, width, value, index }) => {
                  const entry = chartData[index];
                  if (!entry?.isUnknown) return null;
                  return (
                    <text x={x + width / 2} y={y - 8} textAnchor="middle" fill="#94a3b8" fontWeight="900" fontSize={18}>?</text>
                  );
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isUnknown ? UNKNOWN_COLOR : COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-6">
      {title && (
        <h4 className="text-center text-lg font-black text-slate-700 mb-4">{title}</h4>
      )}
      {/* Legend for unknown segment */}
      {chartData.some(d => d.isUnknown) && (
        <p className="text-center text-xs text-slate-400 font-bold mb-3">
          🔍 The <span className="text-slate-500 font-black">?</span> segment is what you need to find!
        </p>
      )}
      <div className="w-full h-[300px]">
        {renderChart()}
      </div>
    </div>
  );
}
