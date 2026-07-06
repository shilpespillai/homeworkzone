import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Printer, 
  TrendingUp, 
  Award, 
  Clock, 
  Activity,
  ChevronRight,
  ClipboardCheck,
  ClipboardList
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');

export default function ChildReportView({ studentName, currentStudentProfile, submissions = [], homeworks = [] }) {
  const [selectedReportIndex, setSelectedReportIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // 1. Filter and sort student submissions chronologically
  const studentSubs = submissions
    .filter(sub => normalizeName(sub.studentName) === normalizeName(studentName))
    .sort((a, b) => {
      const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(a.submittedAt || 0);
      const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(b.submittedAt || 0);
      return dateA - dateB;
    });

  // 2. Prepare chart data
  const chartData = studentSubs.map((sub, idx) => {
    const hw = homeworks.find(h => h.id === sub.homeworkId);
    const hwTitle = hw ? hw.title : 'Mission';
    const dateStr = sub.submittedAt ? new Date(sub.submittedAt.toDate ? sub.submittedAt.toDate() : sub.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Quiz ${idx + 1}`;
    
    // Class average calculation
    const hwSubs = submissions.filter(s => s.homeworkId === sub.homeworkId);
    const classAvg = hwSubs.length > 0 ? Math.round(hwSubs.reduce((acc, s) => acc + (s.score || 0), 0) / hwSubs.length) : 70;

    return {
      name: dateStr,
      title: hwTitle,
      studentScore: sub.score,
      classAverage: classAvg
    };
  });

  const parentReports = currentStudentProfile?.parentReports || [];

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = (report) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Child Progress Report - ${studentName}</title>
          <style>
            body { font-family: 'Nunito', 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1, h2, h3 { color: #166534; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .header p { margin: 5px 0; color: #64748b; font-weight: bold; }
            .content { white-space: pre-wrap; font-size: 14px; background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Homework Zone - Child Progress Report</h1>
            <p><strong>Student Name:</strong> ${studentName}</p>
            <p><strong>Class:</strong> ${currentStudentProfile?.className || 'Classroom Student'}</p>
            <p><strong>Published Date:</strong> ${report.date}</p>
            <p><strong>Teacher Name:</strong> ${report.teacherName}</p>
          </div>
          <div class="content">${report.content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-green-800 tracking-tight mb-2">Child Progress Report</h1>
          <p className="text-sm font-bold text-[#166534] italic">Inspect learning gaps, growth trajectories, and progress summaries. 📈</p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm shrink-0">
          <Award className="w-5 h-5 text-orange-600" />
          <div>
            <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest block">Parent Corner</span>
            <span className="text-xs font-black text-orange-950">{studentName}'s Dashboard</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: AI Teacher Reports */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-green-50/50 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-700" />
                <h2 className="text-lg font-black text-slate-800">Teacher's Progress Reports ({parentReports.length})</h2>
              </div>
              {parentReports.length > 0 && (
                <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-xl text-xs font-black border border-orange-100">
                  Newest First
                </span>
              )}
            </div>

            {parentReports.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-bold italic bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 px-6">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl mx-auto mb-4 border border-slate-100">🎒</div>
                <p className="text-slate-500 font-black mb-1">No reports published yet</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Reports generated by your teacher will appear here to help you guide learning at home.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Reports Navigation Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-100 custom-scrollbar">
                  {parentReports.map((report, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedReportIndex(idx)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black shrink-0 transition-all ${
                        selectedReportIndex === idx
                          ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      Report - {report.date}
                    </button>
                  ))}
                </div>

                {/* Active Report Box */}
                {parentReports[selectedReportIndex] && (
                  <div className="space-y-6 animate-in zoom-in-95 duration-200 text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-green-50/60 border border-green-100/40 px-5 py-3 rounded-2xl text-xs text-green-700 font-black">
                      <span className="flex items-center gap-1.5">👨‍🏫 Teacher: {parentReports[selectedReportIndex].teacherName}</span>
                      <span className="flex items-center gap-1.5">📅 Published: {parentReports[selectedReportIndex].date}</span>
                    </div>

                    <div className="bg-slate-50/70 border border-slate-100/80 rounded-2xl p-6 text-slate-700 text-xs font-bold leading-relaxed whitespace-pre-wrap font-sans max-h-[380px] overflow-y-auto custom-scrollbar">
                      {parentReports[selectedReportIndex].content}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleCopy(parentReports[selectedReportIndex].content)}
                        className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                      >
                        {copied ? (
                          <>
                            <ClipboardCheck className="w-4 h-4 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <ClipboardList className="w-4 h-4 text-slate-500" />
                            Copy Report
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handlePrint(parentReports[selectedReportIndex])}
                        className="py-3 px-6 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-black shadow-md shadow-green-100/40 transition-all flex items-center justify-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Performance Trajectory & Growth Stats */}
        <div className="lg:col-span-5 space-y-6">
          {/* Performance Trajectory Chart */}
          <div className="bg-white rounded-[40px] p-8 border border-green-50/50 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-lg font-black text-slate-800">Quiz Trajectory</h2>
            </div>
            
            {chartData.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-bold italic bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                No quiz submissions trajectory logged yet. 🚀
              </div>
            ) : (
              <div className="space-y-6">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#cbd5e1" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                      <YAxis domain={[0, 100]} stroke="#cbd5e1" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-[10px] space-y-1 font-bold">
                                <p className="text-orange-400 font-black">{data.title}</p>
                                <p className="text-slate-300">Date: {data.name}</p>
                                <p>Score: <span className="text-orange-400 font-black">{data.studentScore}%</span></p>
                                <p>Class Avg: <span className="text-green-400 font-black">{data.classAverage}%</span></p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="studentScore" stroke="#EA580C" strokeWidth={3.5} dot={{ r: 4, strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="classAverage" stroke="#166534" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Growth indicator */}
                {chartData.length > 1 && (
                  <div className="p-4 bg-orange-50/50 border border-orange-100/50 rounded-2xl flex items-center justify-between text-left">
                    <div>
                      <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest block mb-0.5">Accuracy Growth</span>
                      <span className="text-xs font-black text-orange-900">
                        {chartData[chartData.length - 1].studentScore - chartData[0].studentScore >= 0 
                          ? `+${chartData[chartData.length - 1].studentScore - chartData[0].studentScore}% overall improvement`
                          : `${chartData[chartData.length - 1].studentScore - chartData[0].studentScore}% overall change`}
                      </span>
                    </div>
                    <span className="text-xl">🚀</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Mastery Summary Tiers */}
          <div className="bg-white rounded-[40px] p-8 border border-green-50/50 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <Activity className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-black text-slate-800">Mastery Stats</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50/40 rounded-2xl border border-green-100/20 text-left">
                <span className="text-[10px] font-black text-[#166534] block mb-1 uppercase tracking-widest">Average Grade</span>
                <span className="text-2xl font-black text-green-700">
                  {studentSubs.length > 0
                    ? Math.round(studentSubs.reduce((acc, s) => acc + (s.score || 0), 0) / studentSubs.length)
                    : 0}%
                </span>
              </div>
              <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100/20 text-left">
                <span className="text-[10px] font-black text-[#166534] block mb-1 uppercase tracking-widest">Quizzes Done</span>
                <span className="text-2xl font-black text-orange-600">{studentSubs.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
