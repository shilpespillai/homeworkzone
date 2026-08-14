import React, { useState } from 'react';
import { Trophy, Globe, Timer, FileText, ChevronRight, ChevronLeft, Search, Sparkles, ArrowRight } from 'lucide-react';
import { INTERNATIONAL_EXAMS, EXAM_REGIONS } from '../data/examPresets';

export default function InternationalExamHubView({ onSelectExam, onBack }) {
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedRegion = EXAM_REGIONS.find(r => r.id === selectedRegionId);

  // Filter exams based on region and search query
  const displayedExams = INTERNATIONAL_EXAMS.filter(exam => {
    const matchesRegion = selectedRegionId ? exam.region === selectedRegionId : true;
    const matchesSearch = searchQuery
      ? exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.gradeRange.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 font-sans animate-fadeIn">
      {/* Top Bar Back Button */}
      <div className="flex items-center justify-between">
        {selectedRegionId ? (
          <button
            onClick={() => {
              setSelectedRegionId(null);
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-slate-800 text-xs font-black shadow-md border border-slate-200 transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-600" /> Back to All Regions
          </button>
        ) : onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-slate-800 text-xs font-black shadow-md border border-slate-200 transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-600" /> Back to Creation Options
          </button>
        ) : <div />}

        {/* Global Search Bar */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exam paper..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 rounded-[40px] p-8 md:p-12 text-white shadow-xl border-4 border-emerald-300/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-amber-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Trophy className="w-4 h-4 text-amber-300" /> 36 Authentic Global Exam Blueprints
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {selectedRegion ? `${selectedRegion.flag} ${selectedRegion.label}` : 'International Exam Builder 🌐'}
          </h1>
          <p className="text-emerald-50 font-medium text-sm md:text-base leading-relaxed">
            {selectedRegion
              ? selectedRegion.description
              : 'Select a world region to access past-paper aligned exam generators for NSW Selective, ACER, ICAS, SAT, ACT, NAPLAN, SOF Olympiads, PSLE, GCSE, and UK 11+.'}
          </p>
        </div>
      </div>

      {/* SEARCH MODE OR LEVEL 1 vs LEVEL 2 RENDERING */}
      {searchQuery ? (
        /* Search Results View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800">
              Search Results ({displayedExams.length} {displayedExams.length === 1 ? 'Exam' : 'Exams'})
            </h2>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Clear Search
            </button>
          </div>
          <ExamGrid exams={displayedExams} onSelectExam={onSelectExam} />
        </div>
      ) : !selectedRegionId ? (
        /* LEVEL 1: REGION SELECTION GRID */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Region</h2>
              <p className="text-xs font-bold text-slate-500">Choose a geographic region to browse authentic examination blueprints</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-200">
              6 World Regions • 36 Official Papers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXAM_REGIONS.map((region) => {
              const count = INTERNATIONAL_EXAMS.filter(e => e.region === region.id).length;
              return (
                <div
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  className="group bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:border-emerald-500 relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${region.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-5xl select-none">{region.flag}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${region.lightBg} ${region.textColor} border ${region.border}`}>
                        {count} Exam Papers
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {region.label}
                      </h3>
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">
                        {region.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                    <span className="text-xs font-black text-slate-500 group-hover:text-slate-800 transition-colors">
                      Browse Papers
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LEVEL 2: EXAMS WITHIN SELECTED REGION */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedRegion.flag}</span>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedRegion.label}</h2>
                <p className="text-xs font-bold text-slate-500">Showing {displayedExams.length} past-paper aligned exam papers</p>
              </div>
            </div>
          </div>

          <ExamGrid exams={displayedExams} onSelectExam={onSelectExam} />
        </div>
      )}
    </div>
  );
}

function ExamGrid({ exams, onSelectExam }) {
  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 space-y-3">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-lg font-black text-slate-800">No exam papers found</h3>
        <p className="text-xs font-bold text-slate-500">Try searching for another term like "SAT", "NAPLAN", or "Maths"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {exams.map((exam) => (
        <div
          key={exam.id}
          className="bg-white rounded-2xl border-2 border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-0.5 hover:border-emerald-500 p-4"
        >
          {/* Card Top Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-1">
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-black text-[9px] uppercase tracking-wider rounded-full truncate">
                {exam.country}
              </span>
              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                {exam.gradeRange}
              </span>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-1">
                {exam.name}
              </h3>
              <p className="text-[11px] font-bold text-slate-500 truncate">{exam.category}</p>
            </div>

            {/* Specs Badge Bar */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100 font-mono text-[11px] font-bold text-slate-700">
              <div className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{exam.defaultQuestions} Qs</span>
              </div>
              <div className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{exam.defaultTime} Mins</span>
              </div>
            </div>

            {/* Syllabus Highlights Preview */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Official Syllabus Focus</span>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug font-medium">
                {exam.promptInstruction.split('OFFICIAL SYLLABUS')[1]?.split('FORMATTING')[0]?.trim() ||
                 exam.promptInstruction.split('OFFICIAL STRUCTURE')[1]?.split('FORMATTING')[0]?.trim() ||
                 exam.promptInstruction.slice(0, 120)}
              </p>
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="pt-3 mt-3 border-t border-slate-100">
            <button
              onClick={() => onSelectExam && onSelectExam(exam)}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-black text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all uppercase tracking-wider cursor-pointer"
            >
              Generate Exam Paper 📝 <ChevronRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
