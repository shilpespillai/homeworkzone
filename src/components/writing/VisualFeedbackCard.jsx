import React from 'react';
import { CheckCircle2, Circle, ArrowRight, Sparkles, Award, Check } from 'lucide-react';
import { WRITING_GENRES } from '../../data/writingTemplates';

export default function VisualFeedbackCard({ 
  studentDraft, 
  analysisData, 
  genreKey = 'persuasive', 
  grade = 'Grade 5' 
}) {
  const genre = WRITING_GENRES[genreKey] || WRITING_GENRES.persuasive;
  
  if (!analysisData) return null;

  const { 
    improvedTitle, 
    exemplarParagraphs = [], 
    annotations = [], 
    diagnosticChecks = {}, 
    wordReplacements = [],
    customStarters,
    customLinkingWords
  } = analysisData;

  const displayStarters = customStarters && customStarters.length > 0 ? customStarters : genre.starters;
  const displayLinkingWords = customLinkingWords || genre.linkingWords;

  // Helper to colorize text with highlights
  const renderExemplarParagraph = (paragraphText, paraIdx) => {
    const paraAnnots = annotations.filter(a => a.paraIndex === paraIdx);
    if (!paraAnnots.length) return <span>{paragraphText}</span>;

    // Render callout badges alongside paragraph
    return (
      <div className="relative group">
        <p className="text-slate-800 text-sm md:text-base leading-relaxed font-serif">
          {paragraphText}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {paraAnnots.map((annot, idx) => {
            const badgeColors = {
              green: 'bg-emerald-100 text-emerald-900 border-emerald-300',
              blue: 'bg-sky-100 text-sky-900 border-sky-300',
              purple: 'bg-purple-100 text-purple-900 border-purple-300',
              rose: 'bg-rose-100 text-rose-900 border-rose-300'
            };
            const colorClass = badgeColors[annot.color] || badgeColors.green;
            return (
              <span 
                key={idx} 
                className={`text-xs font-black px-2.5 py-1 rounded-lg border shadow-sm flex items-center gap-1.5 ${colorClass}`}
              >
                <ArrowRight className="w-3 h-3 shrink-0" />
                <span className="underline decoration-dotted">{annot.targetText}</span>: {annot.label}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-100 p-3 md:p-6 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-6 font-sans">
      {/* 1. MAIN 3-COLUMN VISUAL CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: WHAT THE STUDENT WROTE */}
        <div className="lg:col-span-4 bg-amber-50/80 rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-red-600 text-white font-black text-xs md:text-sm uppercase tracking-wider py-2.5 px-4 text-center border-b-2 border-red-700">
            WHAT THE STUDENT WROTE ({grade})
          </div>
          {/* Lined Paper Content */}
          <div className="p-5 flex-1 font-serif text-slate-800 text-sm md:text-base leading-loose relative bg-[linear-gradient(transparent_27px,#cbd5e1_28px)] bg-[size:100%_28px] pl-8">
            {/* Red left margin line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-red-300"></div>
            <div className="whitespace-pre-wrap font-medium">
              {studentDraft || "No text provided..."}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: HOW TO MAKE IT A GREAT EXEMPLAR */}
        <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-md p-5 flex flex-col space-y-4 relative">
          {/* Header Banner */}
          <div className="bg-emerald-600 text-white font-black text-xs md:text-sm uppercase tracking-wider py-2 px-4 rounded-xl text-center shadow-sm flex items-center justify-between">
            <span>HOW TO MAKE IT A GREAT {grade.toUpperCase()} {genre.id.toUpperCase()}</span>
            <Award className="w-5 h-5 text-yellow-300" />
          </div>

          {/* Title */}
          {improvedTitle && (
            <h3 className="text-xl md:text-2xl font-black text-center text-slate-900 border-b pb-2 font-serif">
              "{improvedTitle}"
            </h3>
          )}

          {/* Paragraphs with Color-Coded Callout Annotations */}
          <div className="space-y-4 flex-1">
            {exemplarParagraphs.map((para, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                {renderExemplarParagraph(para, idx)}
              </div>
            ))}
          </div>

          {/* Summary Footer Tag */}
          <div className="bg-sky-100 border border-sky-300 text-sky-950 font-black text-xs md:text-sm text-center py-2.5 px-4 rounded-xl shadow-inner flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>This version has clearer reasons, better details, and stronger words!</span>
          </div>
        </div>

        {/* RIGHT COLUMN: WHAT TO IMPROVE CHECKLIST */}
        <div className="lg:col-span-3 bg-sky-50 rounded-2xl border-2 border-sky-200 shadow-md p-4 space-y-4">
          <div className="bg-sky-600 text-white font-black text-xs md:text-sm uppercase tracking-wider py-2 px-3 rounded-xl text-center">
            WHAT TO IMPROVE
          </div>

          <div className="space-y-4 text-xs md:text-sm">
            {genre.checklistCategories.map((cat) => {
              const catChecks = diagnosticChecks[cat.id] || [];
              return (
                <div key={cat.id} className="space-y-2 bg-white p-3 rounded-xl border border-sky-100 shadow-sm">
                  <div className="font-black text-slate-800 uppercase tracking-wide text-xs flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    <span>{cat.title}</span>
                  </div>
                  <div className="space-y-1.5">
                    {cat.items.map((itemText, i) => {
                      const isPassed = Boolean(catChecks[i]);
                      return (
                        <div key={i} className="flex items-start gap-2 text-slate-700">
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className={isPassed ? 'font-semibold text-slate-900' : 'text-slate-600'}>
                            {itemText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. BOTTOM SECTION (3 REFERENCE BOXES) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* BOX 1: USE BETTER SENTENCE STARTERS */}
        <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-4 space-y-3 shadow-sm">
          <div className="bg-amber-500 text-white font-black text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg text-center">
            USE BETTER SENTENCE STARTERS
          </div>
          <div className="space-y-2">
            {displayStarters.map((starter, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-bold text-amber-950">
                <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{starter}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOX 2: USE LINKING WORDS */}
        <div className="bg-rose-50 rounded-2xl border-2 border-rose-300 p-4 space-y-3 shadow-sm">
          <div className="bg-rose-500 text-white font-black text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg text-center">
            USE LINKING WORDS
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-xl border border-rose-200">
              <div className="font-black text-rose-700 mb-1">Adding</div>
              <div className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                {(displayLinkingWords.adding || []).join(', ')}
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl border border-rose-200">
              <div className="font-black text-rose-700 mb-1">Explaining</div>
              <div className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                {(displayLinkingWords.explaining || []).join(', ')}
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl border border-rose-200">
              <div className="font-black text-rose-700 mb-1">Contrasting</div>
              <div className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                {(displayLinkingWords.contrasting || []).join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* BOX 3: WORDS TO USE INSTEAD */}
        <div className="bg-purple-50 rounded-2xl border-2 border-purple-300 p-4 space-y-3 shadow-sm">
          <div className="bg-purple-600 text-white font-black text-xs uppercase tracking-wider py-1.5 px-3 rounded-lg text-center">
            WORDS TO USE INSTEAD
          </div>
          <div className="space-y-1.5 text-xs">
            {wordReplacements.length > 0 ? (
              wordReplacements.map((pair, idx) => (
                <div key={idx} className="bg-white p-2 rounded-xl border border-purple-200 flex justify-between items-center">
                  <span className="font-bold text-rose-600 line-through">{pair.weakWord}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-black text-purple-900">{pair.replacements.join(', ')}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 italic text-xs py-2">
                Great word choice in draft!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. BOTTOM FOOTER CHECKLIST BAR */}
      <div className="bg-blue-900 text-white rounded-2xl p-3 shadow-lg flex flex-wrap items-center justify-around gap-2 text-xs font-black">
        <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-full uppercase tracking-wider text-[11px]">
          {grade.toUpperCase()} {genre.name.toUpperCase()} CHECKLIST
        </span>
        {genre.checklistCategories.flatMap(c => c.items).slice(0, 7).map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 bg-blue-800/80 px-2.5 py-1 rounded-lg border border-blue-700">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{item.split('(')[0]}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
