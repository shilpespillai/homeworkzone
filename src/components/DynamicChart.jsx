import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg">
        <p className="font-bold text-slate-700">{label}</p>
        <p className="text-indigo-600 font-black">
          Value: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
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
  const chartData = actualData;

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart width={450} height={300}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );
      
      case 'line':
        return (
          <LineChart width={450} height={300} data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
            <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={4} activeDot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} />
          </LineChart>
        );

      case 'bar':
      default:
        return (
          <BarChart width={450} height={300} data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
            <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-6">
      {title && (
        <h4 className="text-center text-lg font-black text-slate-700 mb-4">{title}</h4>
      )}
      <div className="w-full h-[300px]">
        {renderChart()}
      </div>
    </div>
  );
}
