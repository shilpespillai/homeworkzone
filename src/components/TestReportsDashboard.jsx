import React, { useState } from 'react';
import { Trophy, Clock, Search, ChevronRight, Award, Flame, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestReportsDashboard({ tests = [], submissions = [], students = [] }) {
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!selectedTest) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-800">Test Reports & Leaderboards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.length === 0 ? (
            <div className="col-span-full p-10 bg-slate-50 border border-slate-200 rounded-3xl text-center">
              <p className="text-slate-500 font-bold">No tests generated yet.</p>
            </div>
          ) : tests.map(test => {
            const testSubs = submissions.filter(s => s.homeworkId === test.id);
            return (
              <div key={test.id} onClick={() => setSelectedTest(test)} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg cursor-pointer transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">{test.title}</h3>
                    <p className="text-xs font-bold text-slate-500">{test.subject}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-4">
                  <span className="text-slate-500">{testSubs.length} Submissions</span>
                  <span className="text-blue-600 flex items-center gap-1">View Leaderboard <ChevronRight className="w-4 h-4" /></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const testSubmissions = submissions.filter(s => s.homeworkId === selectedTest.id);
  const leaderboard = testSubmissions.map(sub => {
    const student = students.find(st => st.id === sub.studentId || st.name === sub.studentName);
    return {
      ...sub,
      studentData: student || { name: sub.studentName }
    };
  }).sort((a, b) => {
    // Sort by marks first, then by completion time (if available, else correctCount)
    if (b.totalMarksScored !== a.totalMarksScored) {
      return (b.totalMarksScored || 0) - (a.totalMarksScored || 0);
    }
    return (b.correctCount || 0) - (a.correctCount || 0);
  });

  const filteredLeaderboard = leaderboard.filter(sub => sub.studentName?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full flex flex-col font-sans">
      <div className="w-full flex flex-col">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <button 
            onClick={() => setSelectedTest(null)} 
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-sm transition-colors bg-white px-6 py-3 rounded-full border border-slate-200 hover:bg-blue-50 shadow-sm"
          >
            <ChevronRight className="w-5 h-5 rotate-180 transition-transform group-hover:-translate-x-1" /> 
            Back to Dashboard
          </button>
          
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="SEARCH PLAYER..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 rounded-full bg-white border border-slate-200 outline-none focus:border-blue-400 font-bold text-sm text-slate-600 placeholder-slate-400 uppercase tracking-widest w-64 focus:w-80 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Header Graphics */}
        <div className="flex flex-col items-center text-center mb-12 select-none">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-extrabold text-slate-700 tracking-tighter leading-none"
          >
            TOP {Math.min(5, filteredLeaderboard.length || 5)}
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 tracking-tighter leading-none mt-2"
          >
            TEST SCORES
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mt-6"
          >
            <div className="h-[2px] w-16 md:w-32 bg-gradient-to-l from-slate-200 to-transparent" />
            <h3 className="text-xl md:text-2xl font-bold text-slate-400 tracking-[0.2em] uppercase">
              {selectedTest.title}
            </h3>
            <div className="h-[2px] w-16 md:w-32 bg-gradient-to-r from-slate-200 to-transparent" />
          </motion.div>
        </div>

        {/* Leaderboard Rows */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-4xl mx-auto w-full pb-20">
          <AnimatePresence>
            {filteredLeaderboard.map((sub, idx) => {
              // Row Styling variations based on rank
              const isFirst = idx === 0;
              const isTop3 = idx < 3;
              
              const rowBg = isFirst 
                ? 'bg-gradient-to-r from-orange-50 to-white' 
                : 'bg-white';
              const rowBorder = isFirst ? 'border-orange-200' : 'border-slate-100';
              
              const rankBg = isFirst 
                ? 'bg-gradient-to-br from-orange-400 to-orange-500' 
                : 'bg-slate-50';
              const rankText = isFirst ? 'text-white' : 'text-slate-400';
              const rankBorder = isFirst ? 'border-orange-300/50' : 'border-slate-100';

              return (
                <motion.div 
                  key={sub.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                  className="relative group"
                >
                  {/* The Slanted Container */}
                  <div className={`relative overflow-hidden -skew-x-[12deg] ${rowBg} border ${rowBorder} shadow-sm flex items-stretch min-h-[64px] md:min-h-[80px] transition-transform duration-300 group-hover:scale-[1.02] rounded-lg md:rounded-xl`}>
                    
                    {/* Glowing Accent for #1 */}
                    {isFirst && (
                      <div className="absolute top-0 left-0 w-1/2 h-full bg-orange-100/50 blur-2xl" />
                    )}

                    {/* Rank Number Block */}
                    <div className={`w-20 md:w-28 shrink-0 ${rankBg} flex items-center justify-center border-r ${rankBorder} shadow-sm z-10`}>
                      <span className={`skew-x-[12deg] text-4xl md:text-5xl font-extrabold ${rankText} tracking-tighter`}>
                        {idx + 1}
                      </span>
                    </div>

                    {/* Content Block */}
                    <div className="flex-1 flex items-center justify-between px-6 md:px-10 z-10 relative">
                      {/* Name & Avatar */}
                      <div className="flex items-center gap-4 skew-x-[12deg]">
                        <div className="relative">
                          <img 
                            src={sub.studentData?.avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${sub.studentName}`} 
                            alt={sub.studentName} 
                            className={`w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 shadow-sm ${isFirst ? 'border-orange-400' : 'border-slate-200'}`} 
                          />
                          {isFirst && (
                            <div className="absolute -bottom-2 -right-2 bg-amber-400 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                              <Trophy className="w-4 h-4 text-amber-900" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-extrabold text-xl md:text-3xl text-slate-700 uppercase tracking-tight leading-none">
                            {sub.studentName.split(' ')[0]}
                          </h4>
                          {sub.studentName.split(' ').length > 1 && (
                            <h4 className="font-bold text-lg md:text-2xl text-slate-400 uppercase tracking-tight leading-none mt-1">
                              {sub.studentName.split(' ').slice(1).join(' ')}
                            </h4>
                          )}
                        </div>
                      </div>

                      {/* Score / Stats */}
                      <div className="flex flex-col items-end skew-x-[12deg]">
                        <div className="flex items-baseline gap-2">
                          <span className={`font-extrabold text-3xl md:text-5xl tracking-tighter ${isFirst ? 'text-orange-500' : 'text-slate-600'}`}>
                            {sub.totalMarksScored || (sub.correctCount * (selectedTest.marksPerQuestion || 1))}
                          </span>
                          <span className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2">PTS</span>
                        </div>
                        <div className={`flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm border ${isFirst ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-slate-500 bg-slate-50 border-slate-100'}`}>
                          {sub.correctCount} / {sub.totalQuestions} CORRECT
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredLeaderboard.length === 0 && (
            <div className="text-center py-20 text-slate-400 font-bold tracking-widest uppercase text-xl">
              NO SCORES FOUND FOR THIS TEST
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
