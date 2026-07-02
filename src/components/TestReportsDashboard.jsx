import React, { useState, useMemo } from 'react';
import { Trophy, Clock, Search, ChevronRight, Award, Flame, X, Filter, TrendingUp, TrendingDown, Star, Users, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const parseDate = (dateField) => {
  if (!dateField) return new Date(0);
  if (dateField.toDate) return dateField.toDate();
  if (dateField.seconds) return new Date(dateField.seconds * 1000);
  return new Date(dateField);
};

const calcAvg = (subs) => subs.length ? Math.round(subs.reduce((acc, curr) => {
  const qCount = curr.totalQuestions || 1;
  const score = curr.totalMarksScored !== undefined ? curr.totalMarksScored : curr.correctCount;
  const maxScore = curr.totalMarksScored !== undefined ? (curr.totalQuestions * (curr.marksPerQuestion || 1)) : qCount;
  return acc + ((score / maxScore) * 100 || 0);
}, 0) / subs.length) : 0;

export default function TestReportsDashboard({ tests = [], submissions = [], students = [] }) {
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('All Time');

  const availableMonths = useMemo(() => {
    const months = new Set();
    const addMonth = (dateField) => {
      const d = parseDate(dateField);
      if (d.getTime() > 0) {
        months.add(`${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`);
      }
    };
    submissions.forEach(s => addMonth(s.submittedAt));
    tests.forEach(t => addMonth(t.createdAt));
    
    // Sort from newest to oldest
    return ['All Time', ...Array.from(months).sort((a, b) => new Date(b) - new Date(a))];
  }, [submissions, tests]);

  const {
    currentTests, prevTestsCount,
    currentSubmissions, prevSubsCount,
    currentAvg, prevAvg,
    topPerformer, topScore
  } = useMemo(() => {
    let targetMonthDate = null;
    let prevMonthDate = null;

    if (monthFilter !== 'All Time') {
      targetMonthDate = new Date(monthFilter);
      if (!isNaN(targetMonthDate.getTime())) {
         prevMonthDate = new Date(targetMonthDate);
         prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
      }
    }

    const isDateInMonth = (d, tDate) => {
      if (!tDate || isNaN(tDate.getTime())) return false;
      return d.getMonth() === tDate.getMonth() && d.getFullYear() === tDate.getFullYear();
    };

    const getFilteredSubs = (tDate, periodLabel) => {
      if (monthFilter === 'All Time' && periodLabel === 'current') return submissions;
      if (!tDate) return [];
      return submissions.filter(sub => {
        const d = parseDate(sub.submittedAt);
        return isDateInMonth(d, tDate);
      });
    };

    const cSubs = getFilteredSubs(targetMonthDate, 'current');
    const pSubs = getFilteredSubs(prevMonthDate, 'prev');

    const getFilteredTests = (tDate, relevantSubs, periodLabel) => {
      if (monthFilter === 'All Time' && periodLabel === 'current') return tests;
      if (!tDate) return [];
      return tests.filter(test => {
        return relevantSubs.some(s => s.homeworkId === test.id);
      });
    };

    const cTests = getFilteredTests(targetMonthDate, cSubs, 'current');
    const pTests = getFilteredTests(prevMonthDate, pSubs, 'prev');

    const cAvg = calcAvg(cSubs);
    const pAvg = calcAvg(pSubs);

    const studentAvgs = {};
    cSubs.forEach(sub => {
      const qCount = sub.totalQuestions || 1;
      const score = sub.totalMarksScored !== undefined ? sub.totalMarksScored : sub.correctCount;
      const maxScore = sub.totalMarksScored !== undefined ? (sub.totalQuestions * (sub.marksPerQuestion || 1)) : qCount;
      if (!studentAvgs[sub.studentName]) studentAvgs[sub.studentName] = { total: 0, count: 0 };
      studentAvgs[sub.studentName].total += ((score / maxScore) * 100 || 0);
      studentAvgs[sub.studentName].count += 1;
    });

    let tPerf = null;
    let tScore = 0;
    Object.entries(studentAvgs).forEach(([name, data]) => {
      const avg = data.total / data.count;
      if (avg >= tScore) {
        tScore = Math.round(avg);
        tPerf = name;
      }
    });

    return {
      currentTests: cTests,
      prevTestsCount: pTests.length,
      currentSubmissions: cSubs,
      prevSubsCount: pSubs.length,
      currentAvg: cAvg,
      prevAvg: pAvg,
      topPerformer: tPerf,
      topScore: tScore
    };
  }, [tests, submissions, monthFilter]);

  if (!selectedTest) {
    const renderTrend = (current, previous) => {
      if (monthFilter === 'All Time' || previous === 0) return null;
      const percentChange = Math.round(((current - previous) / previous) * 100);
      if (percentChange > 0) return <span className="text-green-600 font-bold text-xs flex items-center"><TrendingUp className="w-3 h-3 mr-1"/>{percentChange}% <span className="text-slate-400 font-medium ml-1">from last month</span></span>;
      if (percentChange < 0) return <span className="text-red-600 font-bold text-xs flex items-center"><TrendingDown className="w-3 h-3 mr-1"/>{Math.abs(percentChange)}% <span className="text-slate-400 font-medium ml-1">from last month</span></span>;
      return <span className="text-slate-400 font-bold text-xs flex items-center">0% <span className="text-slate-400 font-medium ml-1">from last month</span></span>;
    };

    return (
      <div className="space-y-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Test Reports & Leaderboards</h2>
            <p className="text-slate-500 font-medium mt-1">View test results, track performance and celebrate student success.</p>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Total Tests */}
          <div className="bg-purple-50/50 p-6 rounded-3xl border border-purple-100 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Total Tests</p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter mt-1">{currentTests.length}</h3>
              </div>
            </div>
            <div className="mt-4">{renderTrend(currentTests.length, prevTestsCount)}</div>
          </div>

          {/* Total Submissions */}
          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Total Submissions</p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter mt-1">{currentSubmissions.length}</h3>
              </div>
            </div>
            <div className="mt-4">{renderTrend(currentSubmissions.length, prevSubsCount)}</div>
          </div>

          {/* Average Score */}
          <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Average Score</p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter mt-1">{currentAvg}%</h3>
              </div>
            </div>
            <div className="mt-4">{renderTrend(currentAvg, prevAvg)}</div>
          </div>

          {/* Top Performer */}
          <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-orange-600/80">Top Performer</p>
                <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1 leading-tight line-clamp-2">
                  {topPerformer || 'N/A'}
                </h3>
              </div>
            </div>
            <div className="mt-4">
              {topScore > 0 ? (
                <span className="text-orange-600 font-bold text-sm">{topScore}% <span className="text-orange-600/70 font-medium">Average Score</span></span>
              ) : (
                <span className="text-orange-400 font-bold text-sm">No data yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Your Tests Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            Your Tests
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search tests..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm text-slate-700 placeholder-slate-400 w-64 shadow-sm"
              />
            </div>
            <div className="relative group">
              <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
                <Filter className="w-4 h-4" />
                {monthFilter}
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                {availableMonths.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setMonthFilter(opt)}
                    className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-slate-50 transition-colors ${monthFilter === opt ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {currentTests.filter(t => t.title?.toLowerCase().includes(searchQuery.toLowerCase())).map(test => {
            const testSubs = currentSubmissions.filter(s => s.homeworkId === test.id);
            const tAvg = calcAvg(testSubs);
            
            // Map subject to visuals
            const subjLower = (test.subject || '').toLowerCase();
            let subjectColor = 'text-purple-600 bg-purple-50';
            let bgImage = '/illustrations/general_bg.png';
            
            if (subjLower.includes('math') || subjLower.includes('numera')) {
              subjectColor = 'text-orange-600 bg-orange-50';
              bgImage = '/illustrations/math_bg.png';
            } else if (subjLower.includes('sci') || subjLower.includes('bio')) {
              subjectColor = 'text-green-600 bg-green-50';
              bgImage = '/illustrations/science_bg.png';
            } else if (subjLower.includes('eng') || subjLower.includes('read') || subjLower.includes('lang') || subjLower.includes('spell') || subjLower.includes('convention')) {
              subjectColor = 'text-blue-600 bg-blue-50';
              bgImage = '/illustrations/english_bg.png';
            } else if (subjLower.includes('hist') || subjLower.includes('geo')) {
              subjectColor = 'text-amber-600 bg-amber-50';
              bgImage = '/illustrations/history_bg.png';
            }

            return (
              <div key={test.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                  <img src={bgImage} alt={test.subject} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 mix-blend-multiply" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:bg-white text-slate-400 hover:text-slate-800 transition-colors shadow-sm">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 self-start ${subjectColor}`}>
                    {test.subject || 'General'}
                  </div>
                  
                  <h3 className="font-extrabold text-slate-800 text-lg mb-2 line-clamp-2 leading-tight">
                    {test.title}
                  </h3>
                  
                  <p className="text-sm font-medium text-slate-500 line-clamp-3 mb-6">
                    {test.description || 'Test your knowledge and skills with this comprehensive assessment. Answer all questions to see your ranking.'}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-400" />
                        {testSubs.length} {testSubs.length === 1 ? 'Submission' : 'Submissions'}
                      </span>
                      <span className="text-xs font-bold text-slate-500 mt-1">
                        Avg. Score: {tAvg > 0 ? <span className="text-blue-600">{tAvg}%</span> : '-'}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedTest(test)}
                      className="px-4 py-2 border border-orange-200 text-orange-600 hover:bg-orange-50 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      View Leaderboard <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {currentTests.length === 0 && (
             <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">No tests found</h3>
                <p className="text-slate-500 font-medium mt-2">Try adjusting your filters or search query.</p>
             </div>
          )}
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
        <div className="flex flex-col items-center text-center mb-10 select-none">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-700 tracking-tighter leading-none"
          >
            TOP {Math.min(5, filteredLeaderboard.length || 5)}
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 tracking-tighter leading-none mt-2"
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
            <h3 className="text-lg md:text-xl font-bold text-slate-400 tracking-[0.2em] uppercase">
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
                  <div className={`relative overflow-hidden -skew-x-[12deg] ${rowBg} border ${rowBorder} shadow-sm flex items-stretch min-h-[56px] md:min-h-[64px] transition-transform duration-300 group-hover:scale-[1.02] rounded-lg md:rounded-xl`}>
                    
                    {/* Glowing Accent for #1 */}
                    {isFirst && (
                      <div className="absolute top-0 left-0 w-1/2 h-full bg-orange-100/50 blur-2xl" />
                    )}

                    {/* Rank Number Block */}
                    <div className={`w-16 md:w-20 shrink-0 ${rankBg} flex items-center justify-center border-r ${rankBorder} shadow-sm z-10`}>
                      <span className={`skew-x-[12deg] text-3xl md:text-4xl font-extrabold ${rankText} tracking-tighter`}>
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
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 shadow-sm ${isFirst ? 'border-orange-400' : 'border-slate-200'}`} 
                          />
                          {isFirst && (
                            <div className="absolute -bottom-1 -right-1 bg-amber-400 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                              <Trophy className="w-3 h-3 text-amber-900" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-extrabold text-lg md:text-xl text-slate-700 uppercase tracking-tight leading-none">
                            {sub.studentName.split(' ')[0]}
                          </h4>
                          {sub.studentName.split(' ').length > 1 && (
                            <h4 className="font-bold text-base md:text-lg text-slate-400 uppercase tracking-tight leading-none mt-1">
                              {sub.studentName.split(' ').slice(1).join(' ')}
                            </h4>
                          )}
                        </div>
                      </div>

                      {/* Score / Stats */}
                      <div className="flex flex-col items-end skew-x-[12deg]">
                        <div className="flex items-baseline gap-2">
                          <span className={`font-extrabold text-2xl md:text-4xl tracking-tighter ${isFirst ? 'text-orange-500' : 'text-slate-600'}`}>
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
