import React, { useState } from 'react';
import { checkIsCorrect } from '../utils/checkIsCorrect';
import { 
  Timer, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Award, 
  Pencil, 
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Check,
  X,
  LogOut
} from 'lucide-react';
import InteractiveSorting from './InteractiveSorting';
import InteractiveMatching from './InteractiveMatching';
import InteractiveFractionColoring from './InteractiveFractionColoring';
import InteractiveClockSetting from './InteractiveClockSetting';
import InteractivePlaceValueBlocks from './InteractivePlaceValueBlocks';
import InteractiveNumberLinePlotter from './InteractiveNumberLinePlotter';
import InteractiveAngleBuilder from './InteractiveAngleBuilder';
import InteractiveGridAreaPainter from './InteractiveGridAreaPainter';
import InteractiveBalanceScale from './InteractiveBalanceScale';
import InteractiveFractionWall from './InteractiveFractionWall';
import InteractiveCoordinatePlotter from './InteractiveCoordinatePlotter';
import InteractiveMoneyCounter from './InteractiveMoneyCounter';
import InteractiveGeometryNet from './InteractiveGeometryNet';
import InteractiveVennDiagram from './InteractiveVennDiagram';
import InteractiveProbabilitySpinner from './InteractiveProbabilitySpinner';
import InteractiveFunctionGrapher from './InteractiveFunctionGrapher';
import InteractiveChartBuilder from './InteractiveChartBuilder';
import InteractiveRatioMixer from './InteractiveRatioMixer';
import InteractiveFactorTree from './InteractiveFactorTree';
import InteractivePythagorasExplorer from './InteractivePythagorasExplorer';
import InteractiveTransformationGeometry from './InteractiveTransformationGeometry';
import InteractiveQuadraticParabola from './InteractiveQuadraticParabola';
import InteractivePercentageGrid from './InteractivePercentageGrid';
import InteractiveStemLeafPlot from './InteractiveStemLeafPlot';
import InteractiveTrigRatios from './InteractiveTrigRatios';
import InteractiveExponentialCurve from './InteractiveExponentialCurve';

export default function OfficialExamPaperView({
  homework,
  questions = [],
  studentName = 'Student',
  timeRemaining,
  formattedTime,
  answers = {},
  onSelectAnswer,
  markedForReview = {},
  onToggleReview,
  onFinishExam,
  onExit,
  isSubmitted = false,
  submissionResult = null
}) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchNotes, setScratchNotes] = useState('');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const totalQuestions = questions.length;
  const currentQ = questions[currentIdx] || {};

  const getAnswerForQuestion = (q, idx) => {
    if (!q) return undefined;
    if (q.id !== undefined && q.id !== null && answers[q.id] !== undefined) {
      return answers[q.id];
    }
    if (answers[`idx_${idx}`] !== undefined) {
      return answers[`idx_${idx}`];
    }
    return undefined;
  };

  const renderQuestionInput = () => {
    const currentAns = getAnswerForQuestion(currentQ, currentIdx);

    if (currentQ.questionType === 'interactive') {
      const handleInteractiveSelect = (val) => {
        if (onSelectAnswer) onSelectAnswer(currentIdx, val);
      };

      if (currentQ.interactiveType === 'sorting') {
        const itemsList = currentAns ? currentAns.split(', ') : (currentQ.interactiveData || []);
        return (
          <InteractiveSorting
            items={itemsList}
            onReorder={(newOrder) => handleInteractiveSelect(newOrder.join(', '))}
          />
        );
      }
      if (currentQ.interactiveType === 'matching') {
        return (
          <InteractiveMatching
            pairs={currentQ.interactiveData || []}
            reviewMatches={currentAns}
            onMatch={(arr) => handleInteractiveSelect(arr[0] || '')}
          />
        );
      }
      if (currentQ.interactiveType === 'fractionColoring') {
        return (
          <InteractiveFractionColoring
            targetFraction={currentQ.targetFraction || '1/3'}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'clockSetting') {
        return (
          <InteractiveClockSetting
            targetTime={currentQ.targetTime || currentQ.answer || '03:45'}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'placeValueBlocks') {
        return (
          <InteractivePlaceValueBlocks
            targetNumber={currentQ.targetNumber || currentQ.answer || 342}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'numberLinePlot') {
        return (
          <InteractiveNumberLinePlotter
            targetValue={currentQ.targetValue || currentQ.answer || 4}
            min={currentQ.min || -5}
            max={currentQ.max || 10}
            step={currentQ.step || 1}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'angleMeasuring') {
        return (
          <InteractiveAngleBuilder
            targetAngle={currentQ.targetAngle || currentQ.answer || 65}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'gridAreaPainter') {
        return (
          <InteractiveGridAreaPainter
            targetArea={currentQ.targetArea || currentQ.answer || 12}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'balanceScale') {
        return (
          <InteractiveBalanceScale
            targetX={currentQ.targetX || currentQ.answer || 3}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'fractionWall') {
        return (
          <InteractiveFractionWall
            targetFraction={currentQ.targetFraction || currentQ.answer || '3/4'}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'coordinatePlotter') {
        return (
          <InteractiveCoordinatePlotter
            targetX={currentQ.targetX !== undefined ? currentQ.targetX : 3}
            targetY={currentQ.targetY !== undefined ? currentQ.targetY : 2}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'moneyCounter') {
        return (
          <InteractiveMoneyCounter
            targetAmount={currentQ.targetAmount || currentQ.answer || 1.75}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'geometryNet') {
        return (
          <InteractiveGeometryNet
            targetShape={currentQ.targetShape || currentQ.answer || 'Cube'}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'vennDiagram') {
        return (
          <InteractiveVennDiagram
            setALabel={currentQ.setALabel || 'Set A'}
            setBLabel={currentQ.setBLabel || 'Set B'}
            items={currentQ.interactiveData || currentQ.items}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'probabilitySpinner') {
        return (
          <InteractiveProbabilitySpinner
            targetProbability={currentQ.targetProbability || currentQ.answer || '1/4'}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'functionGrapher') {
        return (
          <InteractiveFunctionGrapher
            targetSlope={currentQ.targetSlope !== undefined ? currentQ.targetSlope : 2}
            targetIntercept={currentQ.targetIntercept !== undefined ? currentQ.targetIntercept : 1}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'chartBuilder') {
        return (
          <InteractiveChartBuilder
            categories={currentQ.categories || ['Apples', 'Bananas', 'Oranges']}
            targetData={currentQ.targetData || { Apples: 4, Bananas: 7, Oranges: 3 }}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'ratioMixer') {
        return (
          <InteractiveRatioMixer
            targetRed={currentQ.targetRed || 2}
            targetBlue={currentQ.targetBlue || 3}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'factorTree') {
        return (
          <InteractiveFactorTree
            targetNumber={currentQ.targetNumber || currentQ.answer || 24}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'pythagorasExplorer') {
        return (
          <InteractivePythagorasExplorer
            targetHypotenuse={currentQ.targetHypotenuse || currentQ.answer || 5}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'transformationGeometry') {
        return (
          <InteractiveTransformationGeometry
            targetShiftX={currentQ.targetShiftX !== undefined ? currentQ.targetShiftX : 2}
            targetShiftY={currentQ.targetShiftY !== undefined ? currentQ.targetShiftY : 3}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'quadraticParabola') {
        return (
          <InteractiveQuadraticParabola
            targetA={currentQ.targetA || 1}
            targetC={currentQ.targetC || 0}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'percentageGrid') {
        return (
          <InteractivePercentageGrid
            targetPercentage={currentQ.targetPercentage || currentQ.answer || 25}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'stemLeafPlot') {
        return (
          <InteractiveStemLeafPlot
            targetMedian={currentQ.targetMedian || currentQ.answer || 25}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'trigRatios') {
        return (
          <InteractiveTrigRatios
            targetRatio={currentQ.targetRatio || currentQ.answer || 0.5}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }
      if (currentQ.interactiveType === 'exponentialCurve') {
        return (
          <InteractiveExponentialCurve
            targetBase={currentQ.targetBase || 2}
            instruction={currentQ.text || currentQ.instruction}
            studentAnswer={currentAns}
            onAnswerChange={handleInteractiveSelect}
          />
        );
      }

      return (
        <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-xl my-4">
          <p className="text-slate-600 font-bold mb-3">Interactive Task:</p>
          <input
            type="text"
            value={currentAns || ''}
            onChange={(e) => onSelectAnswer && onSelectAnswer(currentIdx, e.target.value)}
            className="w-full p-4 border-2 border-slate-300 rounded-xl font-semibold text-slate-900"
            placeholder="Type your answer or solution here..."
          />
        </div>
      );
    }

    if (currentQ.questionType === 'text' || !currentQ.options || currentQ.options.length === 0) {
      return (
        <div className="flex flex-col gap-3 my-6">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500">
            Type Your Official Answer Below:
          </label>
          <input
            type="text"
            value={currentAns || ''}
            onChange={(e) => onSelectAnswer && onSelectAnswer(currentIdx, e.target.value)}
            className="w-full max-w-xl p-4 text-lg font-bold border-2 border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10 transition-all shadow-inner"
            placeholder="Enter your official answer here..."
          />
        </div>
      );
    }

    return (
      <div className="space-y-3 font-sans pt-2">
        {(currentQ.options || []).map((opt, oIdx) => {
          const optKey = ['A', 'B', 'C', 'D'][oIdx] || String(oIdx);
          const isSelected = currentAns === optKey || currentAns === opt;

          return (
            <div
              key={oIdx}
              onClick={() => onSelectAnswer && onSelectAnswer(currentIdx, optKey)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${isSelected ? 'bg-slate-950 text-white border-slate-950 shadow-md translate-x-1' : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 hover:border-slate-400'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border ${isSelected ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                {optKey}
              </div>
              <span className="font-semibold text-sm leading-snug">{opt}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Extract stimulus/passage vs main question statement
  const getParsedQuestionContent = (q) => {
    if (!q) return { passage: null, question: 'Select the correct answer from the choices below:' };
    let text = q.text || q.question || q.questionText || q.prompt || q.title || q.content || '';
    
    let cleanStem = text.replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/\[CLOCK:.*?\]/gi, '').trim();

    if (!cleanStem) {
      cleanStem = q.subtopic ? `Question ${currentIdx + 1} (${q.subtopic}): Select the correct answer below` : `Question ${currentIdx + 1}: Select the correct answer from the choices below:`;
    }

    if (q.passage) {
      return { passage: q.passage, question: cleanStem };
    }

    if (text.includes('---PASSAGE---') || text.includes('---STIMULUS---')) {
      const parts = text.split(/---PASSAGE---|---STIMULUS---/);
      return { passage: parts[1]?.trim(), question: parts[2]?.trim() || parts[0]?.trim() || cleanStem };
    }
    const passageMatch = text.match(/^(Passage:|Read the following text:|Read the passage:?)([\s\S]*?\n\n)([\s\S]*)$/i);
    if (passageMatch) {
      return { passage: passageMatch[2].trim(), question: passageMatch[3].trim() || cleanStem };
    }

    return { passage: null, question: cleanStem };
  };

  const { passage, question: cleanQuestionText } = getParsedQuestionContent(currentQ);

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.keys(markedForReview).filter(k => markedForReview[k]).length;

  // Render Cover Page if student hasn't started yet
  if (!hasStarted && !isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] py-12 px-4 flex items-center justify-center font-serif text-slate-900">
        <div className="max-w-3xl w-full bg-[#fcfbf9] border-4 border-slate-900 rounded-xl p-8 md:p-12 shadow-2xl space-y-8 relative">
          
          {/* Header Seal */}
          <div className="text-center border-b-4 border-slate-900 pb-8 space-y-3">
            <div className="inline-block border-2 border-slate-900 px-4 py-1 text-xs font-sans font-black uppercase tracking-widest bg-slate-100">
              Official Assessment Paper
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950 uppercase">
              {homework?.title || 'Standardized Examination Paper'}
            </h1>
            <p className="text-sm font-sans font-bold text-slate-600 uppercase tracking-wide">
              {homework?.examPreset ? `Standardized Exam Preset • ${homework.examPreset}` : 'Competitive Examination Booklet'}
            </p>
          </div>

          {/* Metadata Table */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#f4f1ea] p-5 rounded-lg border-2 border-slate-900 font-sans text-xs font-bold text-slate-800">
            <div>
              <span className="block text-slate-500 uppercase text-[10px]">Time Allowed</span>
              <span className="text-base text-slate-950">{homework?.timeLimit ? `${homework.timeLimit} Minutes` : '40 Minutes'}</span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase text-[10px]">Total Questions</span>
              <span className="text-base text-slate-950">{totalQuestions} Questions</span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase text-[10px]">Calculators</span>
              <span className="text-base text-slate-950">Not Permitted</span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase text-[10px]">Candidate Name</span>
              <span className="text-base text-slate-950 truncate block">{studentName}</span>
            </div>
          </div>

          {/* Candidate Instructions */}
          <div className="space-y-4 text-xs font-sans leading-relaxed border-2 border-slate-900/40 p-6 rounded-lg bg-amber-50/40">
            <h3 className="font-black text-slate-950 uppercase tracking-wider flex items-center gap-2 text-sm border-b border-slate-300 pb-2">
              <FileText className="w-4 h-4 text-slate-900" /> Instructions to Candidates
            </h3>
            <ol className="list-decimal list-inside space-y-2 font-medium text-slate-800">
              <li>Do not turn over this cover page until instructed to begin.</li>
              <li>This test paper contains <strong>{totalQuestions} multiple-choice questions</strong>.</li>
              <li>For each question, select the <strong>SINGLE BEST answer</strong> choice (A, B, C, or D).</li>
              <li>Manage your time carefully. Rough working out can be done using the built-in Scratchpad.</li>
              <li>Marks are <strong>NOT deducted for incorrect answers</strong>. Attempt all questions.</li>
            </ol>
          </div>

          {/* Action Button */}
          <div className="pt-4 text-center">
            <button
              onClick={() => setHasStarted(true)}
              className="bg-slate-950 hover:bg-slate-800 active:scale-95 text-white font-sans font-black py-4 px-12 rounded-xl text-base shadow-xl transition-all tracking-wider uppercase flex items-center justify-center gap-3 mx-auto"
            >
              Begin Examination 📝
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Render Examination Results Report if Submitted
  if (isSubmitted) {
    const correctCount = questions.filter((q, idx) => {
      const ans = getAnswerForQuestion(q, idx);
      return ans !== undefined && checkIsCorrect(q, ans);
    }).length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    // Performance Band Estimation
    const getPerformanceBand = (pct) => {
      if (pct >= 90) return { band: 'Band 6 (Top 5% — Outstanding Achievement)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
      if (pct >= 75) return { band: 'Band 5 (Top 15% — High Proficiency)', color: 'text-blue-700 bg-blue-50 border-blue-300' };
      if (pct >= 60) return { band: 'Band 4 (Proficient Standard)', color: 'text-indigo-700 bg-indigo-50 border-indigo-300' };
      return { band: 'Developing Competency', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    };

    const bandInfo = getPerformanceBand(percentage);

    return (
      <div className="min-h-screen bg-[#f4f1ea] py-12 px-4 font-serif text-slate-900">
        <div className="max-w-4xl mx-auto bg-[#fcfbf9] border-4 border-slate-900 rounded-xl p-8 md:p-12 shadow-2xl space-y-10">
          
          {/* Header */}
          <div className="border-b-4 border-slate-900 pb-6 text-center space-y-3">
            <div className="flex items-center justify-between font-sans">
              <button
                onClick={() => onExit && onExit()}
                className="px-4 py-2 bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                ← Return to Dashboard
              </button>
              <div className="border border-slate-900 px-3 py-1 text-xs font-black uppercase tracking-widest bg-slate-200">
                Official Examination Score Report
              </div>
              <div className="w-[150px] hidden sm:block"></div>
            </div>
            <h1 className="text-3xl font-black text-slate-950 uppercase">{homework?.title || 'Standardized Examination'}</h1>
            <p className="text-xs font-sans text-slate-600 font-bold">Candidate: {studentName} • Date: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Diagnostic Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="bg-slate-950 text-white p-6 rounded-xl text-center space-y-1 shadow-md">
              <span className="text-xs uppercase font-bold text-slate-400">Total Raw Score</span>
              <div className="text-4xl font-black">{correctCount} / {totalQuestions}</div>
              <span className="text-xs text-slate-300 font-medium">({percentage}%)</span>
            </div>

            <div className={`p-6 rounded-xl text-center space-y-1 border-2 ${bandInfo.color} col-span-2 flex flex-col justify-center`}>
              <span className="text-xs uppercase font-bold tracking-wider">Estimated Standardized Performance Band</span>
              <div className="text-xl font-black">{bandInfo.band}</div>
            </div>
          </div>

          {/* Question Review Booklet */}
          <div className="space-y-6 pt-4 border-t-2 border-slate-900">
            <h3 className="text-xl font-black uppercase tracking-wide border-b-2 border-slate-300 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-900" /> Official Solutions & Worked Logic Booklet
            </h3>

            <div className="space-y-6 font-sans">
              {questions.map((q, idx) => {
                const studentAns = getAnswerForQuestion(q, idx);
                const isCorrect = checkIsCorrect(q, studentAns);
                const parsed = getParsedQuestionContent(q);
                const rawCorrect = q.answer !== undefined ? q.answer : (q.correctAnswer !== undefined ? q.correctAnswer : '');

                return (
                  <div key={idx} className={`p-6 rounded-xl border-2 space-y-4 ${isCorrect ? 'border-emerald-300 bg-emerald-50/30' : 'border-red-200 bg-red-50/20'}`}>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-black text-xs uppercase tracking-wider text-slate-700">Question {idx + 1} of {totalQuestions}</span>
                      <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-md flex items-center gap-1 ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                      </span>
                    </div>

                    {/* Passage if present */}
                    {parsed.passage && (
                      <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg text-xs font-serif text-slate-800 leading-relaxed italic">
                        {parsed.passage}
                      </div>
                    )}

                    <p className="font-bold text-sm text-slate-900">{parsed.question}</p>

                    {/* Always display the Official Correct Answer so it is NEVER hidden */}
                    <div className="p-3 bg-emerald-100/80 border-2 border-emerald-400 rounded-lg my-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      <div>
                        <span className="font-black text-[11px] uppercase tracking-wide text-emerald-900 block">
                          Official Correct Answer:
                        </span>
                        <span className="font-bold text-sm text-emerald-950">
                          {String(rawCorrect || 'See worked solution below')}
                        </span>
                      </div>
                    </div>

                    {/* Options Grid */}
                    {(q.options && q.options.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-medium">
                        {(q.options || []).map((opt, oIdx) => {
                          const optKey = ['A', 'B', 'C', 'D'][oIdx] || String(oIdx);
                          const isStudentChoice = studentAns === optKey || studentAns === opt;
                          const isRightChoice = rawCorrect === optKey || rawCorrect === opt || String(rawCorrect) === String(oIdx) || (typeof rawCorrect === 'string' && rawCorrect.trim().toLowerCase() === opt.trim().toLowerCase());

                          let optClass = 'bg-white border-slate-200 text-slate-700';
                          if (isRightChoice) optClass = 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900';
                          else if (isStudentChoice) optClass = 'bg-red-100 border-red-400 font-bold text-red-900';

                          return (
                            <div key={oIdx} className={`p-3 rounded-lg border flex items-center gap-2 ${optClass}`}>
                              <span className="font-black">({optKey})</span> {opt}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Worked Solution */}
                    {(q.solution || q.explanation) && (
                      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-lg text-xs space-y-1">
                        <span className="font-black uppercase text-[10px] text-slate-500 block">Worked Logic Solution:</span>
                        <p className="text-slate-800 leading-normal">{q.solution || q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-6 border-t-4 border-slate-900 flex justify-center font-sans">
            <button
              onClick={() => onExit && onExit()}
              className="px-8 py-4 bg-emerald-600 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl hover:bg-emerald-700 transition flex items-center gap-2"
            >
              ✓ Complete Review & Return to Dashboard
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Active Examination Test Booklet View
  return (
    <div className="min-h-screen bg-[#f4f1ea] font-serif text-slate-900 flex flex-col justify-between">
      
      {/* Top Test Header Bar */}
      <header className="bg-slate-950 text-white py-3 px-6 shadow-md border-b-4 border-slate-800 flex items-center justify-between sticky top-0 z-30 font-sans">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest text-slate-300">
            OFFICIAL TEST PAPER
          </div>
          <h2 className="text-sm font-extrabold truncate max-w-md hidden md:block text-slate-100">{homework?.title}</h2>
        </div>

        {/* Center Timer */}
        <div className="flex items-center gap-2 bg-slate-900 px-4 py-1.5 rounded-lg border border-slate-700 text-amber-400 font-mono font-black text-sm shadow-inner">
          <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{formattedTime || '40:00'}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowScratchpad(prev => !prev)}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${showScratchpad ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
          >
            <Pencil className="w-3.5 h-3.5" /> Scratchpad
          </button>
          
          <button
            onClick={() => setShowMatrixModal(true)}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Palette ({answeredCount}/{totalQuestions})
          </button>

          <button
            onClick={async () => {
              if (window.confirm("Are you sure you want to exit the exam and return to the dashboard? 🏠")) {
                if (onExit) onExit();
                else if (onFinishExam) onFinishExam();
              }
            }}
            className="py-1.5 px-3.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer ml-1"
            title="Exit exam and return to dashboard"
          >
            <LogOut className="w-3.5 h-3.5" /> Exit Exam
          </button>
        </div>
      </header>

      {/* Main Examination Paper Container */}
      <main className="max-w-4xl w-full mx-auto p-4 md:p-8 flex-1">
        
        {/* Scratchpad Drawer if toggled */}
        {showScratchpad && (
          <div className="mb-6 bg-slate-900 text-white p-4 rounded-xl border-2 border-slate-700 shadow-xl space-y-2 font-sans animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Candidate Rough Working Scratchpad</span>
              <button onClick={() => setScratchNotes('')} className="text-[10px] text-slate-400 hover:text-white">Clear Working</button>
            </div>
            <textarea
              value={scratchNotes}
              onChange={(e) => setScratchNotes(e.target.value)}
              placeholder="Type rough calculations, formulas, or logic eliminations here..."
              className="w-full h-28 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-amber-200 outline-none resize-none"
            />
          </div>
        )}

        {/* Paper Sheet */}
        <div className="bg-[#fcfbf9] border-4 border-slate-900 rounded-xl p-6 md:p-10 shadow-xl space-y-8 relative">
          
          {/* Paper Question Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 font-sans">
            <span className="font-black text-xs uppercase tracking-widest text-slate-600">
              QUESTION {currentIdx + 1} OF {totalQuestions}
            </span>

            <button
              onClick={() => onToggleReview && onToggleReview(currentIdx)}
              className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-lg border transition-all ${markedForReview[currentIdx] ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'}`}
            >
              <Flag className="w-3.5 h-3.5" />
              {markedForReview[currentIdx] ? 'Flagged for Review' : 'Flag for Review'}
            </button>
          </div>

          {/* Reading Passage / Stimulus Container if present */}
          {passage && (
            <div className="bg-amber-50/50 border-2 border-amber-200/80 p-6 rounded-xl font-serif text-slate-900 leading-relaxed text-sm md:text-base space-y-3 shadow-inner">
              <span className="font-sans text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded border border-amber-300">
                READING PASSAGE / STIMULUS DATA
              </span>
              <p className="whitespace-pre-line">{passage}</p>
            </div>
          )}

          {/* Visual Diagram / SVG Figure Container if present */}
          {(currentQ.svgCode || currentQ.diagram || currentQ.imageUrl) && (
            <div className="my-6 p-6 bg-white border-2 border-slate-200 rounded-xl shadow-inner flex flex-col items-center justify-center overflow-x-auto">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3 self-start">
                FIGURE / VISUAL DIAGRAM
              </span>
              {currentQ.svgCode ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: currentQ.svgCode }} 
                  className="max-w-full max-h-[350px] flex items-center justify-center my-2" 
                />
              ) : currentQ.diagram ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: currentQ.diagram }} 
                  className="max-w-full max-h-[350px] flex items-center justify-center my-2" 
                />
              ) : currentQ.imageUrl ? (
                <img 
                  src={currentQ.imageUrl} 
                  alt="Question Diagram" 
                  className="max-w-full max-h-[350px] object-contain rounded-lg my-2" 
                />
              ) : null}
            </div>
          )}

          {/* Question Text */}
          <div className="text-base md:text-lg font-extrabold leading-relaxed text-slate-900 bg-slate-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm my-4">
            {cleanQuestionText || currentQ?.text || currentQ?.question || currentQ?.questionText || currentQ?.prompt || currentQ?.title || currentQ?.subtopic || `Question ${currentIdx + 1}: Select the correct answer from the options below:`}
          </div>

          {/* Question Input (Multiple Choice / Short Answer Text / Interactive) */}
          {renderQuestionInput()}

        </div>
      </main>

      {/* Bottom Examination Navigation Bar */}
      <footer className="bg-slate-950 text-white py-4 px-6 border-t-4 border-slate-800 font-sans sticky bottom-0 z-30 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            className="py-2.5 px-5 bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-30 rounded-xl font-extrabold text-xs flex items-center gap-2 text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-xs font-bold text-slate-400 hidden sm:block">
            {answeredCount} of {totalQuestions} Answered ({flaggedCount} Flagged)
          </span>

          {currentIdx < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
              className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
            >
              Next Question <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="py-2.5 px-8 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all uppercase tracking-wider"
            >
              Finish Examination 🏁
            </button>
          )}
        </div>
      </footer>

      {/* Question Matrix Modal */}
      {showMatrixModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-6 shadow-2xl border-2 border-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-black text-slate-900 text-sm uppercase">Question Palette Grid</h3>
              <button onClick={() => setShowMatrixModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3 max-h-72 overflow-y-auto p-1">
              {questions.map((_, qIdx) => {
                const isAns = getAnswerForQuestion(questions[qIdx], qIdx) !== undefined;
                const isFlag = markedForReview[qIdx];
                const isCurr = qIdx === currentIdx;

                let btnClass = 'bg-slate-100 text-slate-700 border-slate-300';
                if (isCurr) btnClass = 'ring-4 ring-slate-950 font-black';
                if (isAns) btnClass = 'bg-emerald-600 text-white font-black border-emerald-700';
                if (isFlag) btnClass = 'bg-amber-500 text-slate-950 font-black border-amber-600';

                return (
                  <button
                    key={qIdx}
                    onClick={() => {
                      setCurrentIdx(qIdx);
                      setShowMatrixModal(false);
                    }}
                    className={`h-10 rounded-xl border text-xs flex items-center justify-center transition-all ${btnClass}`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 border-t border-slate-200 pt-3">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-600 rounded" /> Answered</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded" /> Flagged</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-100 border border-slate-300 rounded" /> Unanswered</span>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Submission Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-5 shadow-2xl border-2 border-slate-900">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-950 text-lg uppercase">Submit Examination?</h3>
            <p className="text-xs text-slate-600 font-medium">
              You have answered <strong>{answeredCount} of {totalQuestions}</strong> questions.
              {totalQuestions - answeredCount > 0 && ` You have ${totalQuestions - answeredCount} unanswered questions.`}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl"
              >
                Return to Exam
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  onFinishExam && onFinishExam();
                }}
                className="flex-1 py-3 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs rounded-xl uppercase tracking-wider"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
