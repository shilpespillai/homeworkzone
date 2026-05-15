import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Rocket,
  Star,
  BrainCircuit
} from 'lucide-react';
import { motion } from 'framer-motion';

const CLASS_TREND_DATA = [
  { week: 'W1', score: 65 },
  { week: 'W2', score: 72 },
  { week: 'W3', score: 68 },
  { week: 'W4', score: 81 },
  { week: 'W5', score: 84 },
  { week: 'W6', score: 89 },
];

const STUDENT_COMPARISON_DATA = [
  { name: 'Jamie L.', score: 94, progress: '+5%' },
  { name: 'Sarah K.', score: 88, progress: '+2%' },
  { name: 'Marcus T.', score: 82, progress: '-1%' },
  { name: 'Elena V.', score: 76, progress: '+8%' },
  { name: 'Alex P.', score: 71, progress: '+4%' },
  { name: 'Zoe M.', score: 65, progress: '-3%' },
];

const SUBJECT_PERFORMANCE = [
  { subject: 'English', score: 88, color: '#b04c95' },
  { subject: 'Maths', score: 74, color: '#f29130' },
  { subject: 'Science', score: 92, color: '#1fbcd2' },
];

export default function TeacherAnalytics() {
  return (
    <div className="space-y-12 animate-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-primary/10 text-primary flex-center rounded-[24px] shadow-tactile border-2 border-primary/10">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight lowercase">Classroom Analytics</h2>
            <p className="text-xs text-slate-400 uppercase font-black tracking-[0.25em]">Intelligence & Performance Insights</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-bubble bg-white border-4 border-slate-50 text-slate-400 h-12 px-6 text-xs font-black gap-2">
            <Filter className="w-4 h-4" /> filter grade
          </button>
          <button className="btn-bubble btn-primary h-12 px-8 text-xs">Export intelligence report</button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Class Velocity (Trend) */}
        <div className="card-bubble lg:col-span-2 space-y-10 border-none bg-white shadow-2xl shadow-slate-200/40">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 lowercase">Class Performance Trend</h3>
              <p className="text-sm text-slate-400 font-bold lowercase">Average score trajectory over the last 6 missions</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black shadow-sm border-2 border-emerald-100/50">
              <ArrowUpRight className="w-4 h-4" /> 12% growth
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CLASS_TREND_DATA}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9d50bb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#9d50bb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="week" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  labelStyle={{ fontWeight: 900, marginBottom: '8px', color: '#9d50bb' }}
                  itemStyle={{ fontWeight: 900, fontSize: '14px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#9d50bb" 
                  strokeWidth={5} 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="card-bubble space-y-8 border-none bg-white shadow-2xl shadow-slate-200/40">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 lowercase">Subject Mastery</h3>
            <p className="text-sm text-slate-400 font-bold lowercase">Avg. score by core curriculum</p>
          </div>

          <div className="space-y-8 pt-4">
            {SUBJECT_PERFORMANCE.map((item, idx) => (
              <div key={item.subject} className="space-y-3">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.subject}
                  </span>
                  <span className="text-slate-900 text-lg">{item.score}%</span>
                </div>
                <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border-2 border-slate-50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ delay: idx * 0.2, duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full shadow-tactile"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-primary/5 rounded-[32px] border-4 border-white shadow-tactile mt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex-center shadow-bubble text-primary">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed lowercase">
                <span className="text-primary font-black">AI Insight:</span> Classroom focus should shift to Maths fractions this week to boost mastery levels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Comparison Matrix */}
      <div className="card-bubble space-y-12 border-none bg-white shadow-2xl shadow-slate-200/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 lowercase">Student Comparison Matrix</h3>
            <p className="text-sm text-slate-400 font-bold lowercase">Benchmarking individual mission performance</p>
          </div>
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Performers</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(157,80,187,0.4)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Group</span>
             </div>
          </div>
        </div>

        <div className="h-96 w-full pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={STUDENT_COMPARISON_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc', radius: 16 }}
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', padding: '16px' }}
              />
              <Bar dataKey="score" radius={[12, 12, 0, 0]} barSize={50} animationDuration={1500}>
                {STUDENT_COMPARISON_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score >= 85 ? '#10b981' : '#9d50bb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Comparison Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {STUDENT_COMPARISON_DATA.map((student, idx) => (
             <div key={student.name} className="card-bubble p-6 bg-[#f8f9fe]/50 border-none shadow-sm hover:translate-y-[-4px] transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[20px] bg-white flex-center font-black text-sm text-slate-400 border-2 border-slate-50 group-hover:border-primary transition-all shadow-tactile">
                      {student.name.split(' ')[0][0]}{student.name.split(' ')[1][0]}
                    </div>
                    <div>
                      <p className="text-md font-black text-slate-900 lowercase">{student.name}</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Grade 6 · Honors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">{student.score}%</p>
                    <p className={`text-[10px] font-black flex items-center justify-end gap-1 ${student.progress.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {student.progress.includes('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {student.progress}
                    </p>
                  </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
