import React, { useState } from 'react';
import { Trophy, Globe, Timer, FileText, Sparkles, ChevronRight, ChevronLeft, Award, CheckCircle2, Zap } from 'lucide-react';
import { INTERNATIONAL_EXAMS } from '../data/examPresets';

export default function InternationalExamHubView({ onSelectExam, onBack }) {
  const [countryFilter, setCountryFilter] = useState('All');

  const filteredExams = INTERNATIONAL_EXAMS.filter(exam => {
    if (countryFilter === 'All') return true;
    if (countryFilter === 'Australia') return exam.country.includes('Australia');
    if (countryFilter === 'ICAS') return exam.category.includes('ICAS');
    if (countryFilter === 'SAT') return exam.category.includes('SAT');
    if (countryFilter === 'UK') return exam.country.includes('United Kingdom');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 font-sans animate-fadeIn">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-purple-50 text-slate-800 text-xs font-black shadow-md border border-slate-200 transition-all active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-purple-600" /> Back to Creation Options
        </button>
      )}
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-purple-700 via-violet-700 to-indigo-700 rounded-[40px] p-8 md:p-12 text-white shadow-xl border-4 border-purple-300/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-200/40 text-amber-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Trophy className="w-4 h-4 text-amber-400" /> Authentic Examination Blueprints
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            International Exam Builder 🌐
          </h1>
          <p className="text-purple-100 font-medium text-sm md:text-base leading-relaxed">
            Generate official, computer-based practice papers aligned to exact test specifications for NSW Selective, ACER, ICAS, Digital SAT, NAPLAN, and UK 11+.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3 pt-6 relative z-10">
          {[
            { id: 'All', label: 'All Exam Papers 🏆' },
            { id: 'Australia', label: '🇦🇺 NSW & Vic Selective / NAPLAN' },
            { id: 'ICAS', label: '🌏 ICAS Competitions (UNSW)' },
            { id: 'SAT', label: '🇺🇸 US Digital SAT (College Board)' },
            { id: 'UK', label: '🇬🇧 UK 11+ Grammar & Independent' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCountryFilter(tab.id)}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all active:scale-95 ${countryFilter === tab.id ? 'bg-amber-400 text-slate-950 shadow-lg font-black' : 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-100 border border-purple-200/30'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-2xl border-2 border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-0.5 hover:border-purple-400 p-4"
          >
            {/* Card Top Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-1">
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200/60 font-black text-[9px] uppercase tracking-wider rounded-full truncate">
                  {exam.country}
                </span>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                  {exam.gradeRange}
                </span>
              </div>

              <div className="space-y-0.5">
                <h3 className="text-base font-black text-slate-900 group-hover:text-purple-700 transition-colors leading-tight line-clamp-1">
                  {exam.name}
                </h3>
                <p className="text-[11px] font-bold text-slate-500 truncate">{exam.category}</p>
              </div>

              {/* Specs Badge Bar */}
              <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100 font-mono text-[11px] font-bold text-slate-700">
                <div className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{exam.defaultQuestions} Qs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{exam.defaultTime} Mins</span>
                </div>
              </div>

              {/* Syllabus Highlights Preview */}
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Official Syllabus Focus</span>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug font-medium">
                  {exam.promptInstruction.split('OFFICIAL SYLLABUS & DOMAIN BREAKDOWN')[1]?.split('FORMATTING')[0]?.trim() || exam.promptInstruction.slice(0, 120)}
                </p>
              </div>
            </div>

            {/* Action Footer Button */}
            <div className="pt-3 mt-3 border-t border-slate-100">
              <button
                onClick={() => onSelectExam && onSelectExam(exam)}
                className="w-full py-2.5 px-3 bg-slate-950 hover:bg-purple-900 active:scale-95 text-white font-black text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all uppercase tracking-wider group-hover:bg-purple-700 cursor-pointer"
              >
                Generate Exam Paper 📝 <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
