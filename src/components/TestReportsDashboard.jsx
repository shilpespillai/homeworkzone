import React, { useState } from 'react';
import { Trophy, Clock, Search, ChevronRight, Award, Flame } from 'lucide-react';

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
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">{test.title}</h3>
                    <p className="text-xs font-bold text-slate-500">{test.subject}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-4">
                  <span className="text-slate-500">{testSubs.length} Submissions</span>
                  <span className="text-purple-600 flex items-center gap-1">View Leaderboard <ChevronRight className="w-4 h-4" /></span>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setSelectedTest(null)} className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to Tests
        </button>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search student..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 outline-none focus:border-purple-400 font-bold text-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="bg-purple-600 p-8 text-white">
          <h2 className="text-3xl font-black mb-2">{selectedTest.title} Leaderboard</h2>
          <div className="flex items-center gap-4 text-purple-100 font-bold">
            <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {selectedTest.marksPerQuestion || 1} Marks/Q</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedTest.timeLimit || 30} Mins</span>
            <span>•</span>
            <span>{testSubmissions.length} Students Completed</span>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {filteredLeaderboard.map((sub, idx) => (
              <div key={sub.id} className={`flex items-center justify-between p-4 rounded-2xl ${idx === 0 ? 'bg-amber-50 border border-amber-200' : idx === 1 ? 'bg-slate-50 border border-slate-200' : idx === 2 ? 'bg-orange-50 border border-orange-200' : 'bg-white border border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${idx === 0 ? 'bg-amber-400 text-white shadow-lg shadow-amber-400/30' : idx === 1 ? 'bg-slate-300 text-white' : idx === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={sub.studentData?.avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${sub.studentName}`} alt={sub.studentName} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm" />
                    <div>
                      <h4 className="font-black text-slate-800">{sub.studentName}</h4>
                      <p className="text-xs font-bold text-slate-500">Correct: {sub.correctCount} / {sub.totalQuestions}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-2xl text-purple-600 flex items-center gap-1 justify-end">
                    {sub.totalMarksScored || (sub.correctCount * (selectedTest.marksPerQuestion || 1))} <span className="text-sm text-purple-400">Pts</span>
                    {idx === 0 && <Flame className="w-5 h-5 text-amber-500 ml-1" />}
                  </div>
                </div>
              </div>
            ))}
            {filteredLeaderboard.length === 0 && (
              <div className="text-center p-10 text-slate-500 font-bold">No students found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
