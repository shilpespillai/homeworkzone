import React, { useState, useEffect } from 'react';
import { Trophy, Globe, Timer, FileText, ChevronRight, ChevronLeft, Search, Sparkles, ArrowRight, GraduationCap, Check } from 'lucide-react';
import { INTERNATIONAL_EXAMS, EXAM_REGIONS } from '../data/examPresets';

export const isExamMatchingGrade = (exam, filterGrade) => {
  if (!filterGrade || filterGrade === 'all') return true;
  const gr = (exam.gradeRange || '').toLowerCase();

  // Higher Ed / GMAT / University
  if (filterGrade === 'higher_ed') {
    return gr.includes('university') || gr.includes('mba') || gr.includes('adult') || exam.id.includes('gmat');
  }

  // If exam is strictly Higher Ed / GMAT, do not match standard school grades 1-12
  if (gr.includes('university') || gr.includes('mba') || gr.includes('adult') || exam.id.includes('gmat')) {
    return false;
  }

  // Extract target grade number, e.g. "Grade 5" -> 5, "Foundation" -> 0
  let targetNum = null;
  if (filterGrade.toLowerCase().includes('foundation') || filterGrade.toLowerCase() === 'k') {
    targetNum = 0;
  } else {
    const m = filterGrade.match(/\d+/);
    if (m) targetNum = parseInt(m[0], 10);
  }

  if (targetNum === null) return true;

  // Handle Foundation / Kindergarten
  if (targetNum === 0) {
    return gr.includes('k') || gr.includes('foundation') || gr.includes('kindergarten');
  }

  // Handle explicit comma lists e.g. "Grade 3, 5, 7, 9"
  if (gr.includes(',')) {
    const listNumbers = (gr.match(/\d+/g) || []).map(n => parseInt(n, 10));
    return listNumbers.includes(targetNum);
  }

  // Handle ranges e.g. "Grade 5 – Grade 6", "Grade 2 – Grade 12", "Grade 9 - Grade 11"
  const rangeNumbers = (gr.match(/\d+/g) || []).map(n => parseInt(n, 10));
  if (rangeNumbers.length === 1) {
    return rangeNumbers[0] === targetNum;
  }
  if (rangeNumbers.length >= 2) {
    const min = Math.min(...rangeNumbers);
    const max = Math.max(...rangeNumbers);
    return targetNum >= min && targetNum <= max;
  }

  return true;
};

export default function InternationalExamHubView({ onSelectExam, onBack, initialGrade = null }) {
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState(initialGrade || 'all');

  useEffect(() => {
    if (initialGrade) {
      setSelectedGradeFilter(initialGrade);
    }
  }, [initialGrade]);

  const selectedRegion = EXAM_REGIONS.find(r => r.id === selectedRegionId);

  // Filter exams based on region, grade filter, and search query
  const displayedExams = INTERNATIONAL_EXAMS.filter(exam => {
    const matchesRegion = selectedRegionId ? exam.region === selectedRegionId : true;
    const matchesGrade = isExamMatchingGrade(exam, selectedGradeFilter);
    const matchesSearch = searchQuery
      ? exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.gradeRange.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesRegion && matchesGrade && matchesSearch;
  });

  const totalGradeMatchingExams = INTERNATIONAL_EXAMS.filter(e => isExamMatchingGrade(e, selectedGradeFilter)).length;

  const handleSelectExamWithGrade = (exam) => {
    let effectiveGrade = 'Grade 7';
    if (selectedGradeFilter && selectedGradeFilter !== 'all' && selectedGradeFilter !== 'higher_ed') {
      effectiveGrade = selectedGradeFilter;
    } else if (initialGrade) {
      effectiveGrade = initialGrade;
    } else {
      const match = (exam.gradeRange || '').match(/\d+/g);
      if (match && match.length > 0) {
        effectiveGrade = `Grade ${match[0]}`;
      }
    }
    if (onSelectExam) {
      onSelectExam(exam, effectiveGrade);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 font-sans animate-fadeIn">
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
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 rounded-[40px] p-8 md:p-10 text-white shadow-xl border-4 border-emerald-300/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-amber-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Trophy className="w-4 h-4 text-amber-300" /> 36 Authentic Global Exam Blueprints
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {selectedRegion ? `${selectedRegion.flag} ${selectedRegion.label}` : 'International Exam Builder 🌐'}
          </h1>
          <p className="text-emerald-50 font-medium text-sm md:text-base leading-relaxed">
            {selectedRegion
              ? selectedRegion.description
              : 'Select a student grade level or region to access past-paper aligned exam generators for NSW Selective, ACER, ICAS, SAT, ACT, NAPLAN, SOF Olympiads, PSLE, GCSE, and UK 11+.'}
          </p>
        </div>
      </div>

      {/* GRADE FILTER BAR */}
      <div className="bg-white rounded-3xl p-4 md:p-5 border-2 border-slate-200/90 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Filter by Student Grade Level:
            </span>
            {selectedGradeFilter !== 'all' && (
              <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-300">
                🎯 {selectedGradeFilter === 'higher_ed' ? 'Higher Ed / GMAT' : selectedGradeFilter} ({totalGradeMatchingExams} Papers)
              </span>
            )}
          </div>
          {selectedGradeFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedGradeFilter('all')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
            >
              Reset to All Grades ({INTERNATIONAL_EXAMS.length} Papers)
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedGradeFilter('all')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedGradeFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Grades ({INTERNATIONAL_EXAMS.length})
          </button>
          {['Foundation', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(gr => {
            const isSelected = selectedGradeFilter === gr;
            const countForGr = INTERNATIONAL_EXAMS.filter(e => isExamMatchingGrade(e, gr)).length;
            return (
              <button
                key={gr}
                type="button"
                onClick={() => setSelectedGradeFilter(gr)}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md font-black ring-2 ring-emerald-400'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{gr.replace('Grade ', 'Gr ')}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-emerald-800/60 text-emerald-100' : 'bg-slate-200 text-slate-500'}`}>
                  {countForGr}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setSelectedGradeFilter('higher_ed')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              selectedGradeFilter === 'higher_ed'
                ? 'bg-purple-600 text-white shadow-md font-black ring-2 ring-purple-400'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
            }`}
          >
            <span>🎓 Higher Ed / GMAT</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedGradeFilter === 'higher_ed' ? 'bg-purple-800/60 text-purple-100' : 'bg-purple-200 text-purple-700'}`}>
              3
            </span>
          </button>
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
              className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>
          <ExamGrid exams={displayedExams} selectedGrade={selectedGradeFilter} onSelectExam={handleSelectExamWithGrade} />
        </div>
      ) : !selectedRegionId ? (
        /* LEVEL 1: REGION SELECTION GRID */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Region</h2>
              <p className="text-xs font-bold text-slate-500">
                {selectedGradeFilter !== 'all' 
                  ? `Showing exams matching ${selectedGradeFilter === 'higher_ed' ? 'Higher Ed' : selectedGradeFilter}`
                  : 'Choose a geographic region to browse authentic examination blueprints'}
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-200">
              {displayedExams.length} Papers Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXAM_REGIONS.map((region) => {
              const count = INTERNATIONAL_EXAMS.filter(e => e.region === region.id && isExamMatchingGrade(e, selectedGradeFilter)).length;
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
                        {count} {count === 1 ? 'Paper' : 'Papers'}
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
                <p className="text-xs font-bold text-slate-500">
                  Showing {displayedExams.length} past-paper aligned exam papers {selectedGradeFilter !== 'all' ? `for ${selectedGradeFilter === 'higher_ed' ? 'Higher Ed' : selectedGradeFilter}` : ''}
                </p>
              </div>
            </div>
            {selectedGradeFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedGradeFilter('all')}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
              >
                Show All Grades in {selectedRegion.label}
              </button>
            )}
          </div>

          <ExamGrid exams={displayedExams} selectedGrade={selectedGradeFilter} onSelectExam={handleSelectExamWithGrade} />
        </div>
      )}
    </div>
  );
}

function ExamGrid({ exams, selectedGrade, onSelectExam }) {
  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 space-y-3">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-lg font-black text-slate-800">No exam papers found for this selection</h3>
        <p className="text-xs font-bold text-slate-500">Try selecting "All Grades" or searching for another term like "Maths", "Science", or "Olympiad"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {exams.map((exam) => {
        const isCustomGrade = selectedGrade && selectedGrade !== 'all' && selectedGrade !== 'higher_ed';
        return (
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
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isCustomGrade ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-black' : 'bg-slate-100 text-slate-500'}`}>
                  {isCustomGrade ? `🎯 ${selectedGrade}` : exam.gradeRange}
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
                Generate {isCustomGrade ? selectedGrade : ''} Paper 📝 <ChevronRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
