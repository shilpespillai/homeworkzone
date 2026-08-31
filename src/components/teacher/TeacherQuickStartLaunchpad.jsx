import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Users, 
  School, 
  BookOpen, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  X, 
  HelpCircle,
  ArrowRight,
  Flame,
  Trophy,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherQuickStartLaunchpad({
  classrooms = [],
  allStudents = [],
  allHomeworks = [],
  teacherCode = '',
  onNavigateTab,
  onOpenCreateClass
}) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('hwz_teacher_launchpad_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem('hwz_teacher_launchpad_dismissed') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [copiedCode, setCopiedCode] = useState(false);

  const step1Done = classrooms.length > 0;
  const step2Done = allStudents.length > 0;
  const step3Done = allHomeworks.some(hw => hw.status === 'published');

  const completedCount = (step1Done ? 1 : 0) + (step2Done ? 1 : 0) + (step3Done ? 1 : 0);
  const progressPercent = Math.round((completedCount / 3) * 100);
  const allComplete = completedCount === 3;

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem('hwz_teacher_launchpad_collapsed', String(next));
    } catch (e) {}
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('hwz_teacher_launchpad_dismissed', 'true');
    } catch (e) {}
  };

  const handleCopyCode = (e) => {
    e?.stopPropagation();
    if (!teacherCode) return;
    navigator.clipboard.writeText(teacherCode.toUpperCase());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  if (isDismissed) {
    return (
      <div className="flex justify-end">
        <button
          onClick={() => {
            setIsDismissed(false);
            try { localStorage.removeItem('hwz_teacher_launchpad_dismissed'); } catch (e) {}
          }}
          className="px-4 py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-black flex items-center gap-2 border-2 border-orange-200 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span>Show Teacher Launchpad ({completedCount}/3 Complete)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#FFF9F2] via-[#FFFFFF] to-[#F2FCF5] text-slate-900 rounded-[32px] p-6 md:p-8 shadow-sm border-2 border-orange-200 relative overflow-hidden space-y-6">
      
      {/* Background Soft Warm Orange & Emerald Ambient Highlights */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-orange-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-[11px] font-black uppercase tracking-wider border border-orange-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin-slow" />
            <span>Teacher Quick-Start Launchpad</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>{allComplete ? '🎉 Setup Complete — You are Ready to Teach!' : 'Get Your Classroom Ready in 3 Simple Steps'}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-semibold max-w-2xl">
            {allComplete 
              ? 'All 3 foundation steps are set up! Your students can log in with your code, take assignments, and build concept mastery.'
              : 'Follow these 3 quick steps to launch your digital classroom, onboard your students, and publish your first assignment.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Progress Pill */}
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center gap-2 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-black text-emerald-900">{completedCount} of 3 Complete ({progressPercent}%)</span>
          </div>

          {/* Minimize / Expand Toggle */}
          <button
            onClick={toggleCollapse}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200 shadow-sm"
            title={isCollapsed ? "Expand Launchpad" : "Minimize Launchpad"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {/* Dismiss Button */}
          {allComplete && (
            <button
              onClick={handleDismiss}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition-colors cursor-pointer border border-slate-200 shadow-sm"
              title="Dismiss Launchpad"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar with High-Contrast Track */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 shadow-inner relative z-10">
        <motion.div 
          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500 rounded-full shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* 3 Step Cards Grid */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 relative z-10"
          >
            
            {/* STEP 1: CREATE CLASSROOM */}
            <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-5 shadow-sm ${
              step1Done 
                ? 'bg-emerald-50/60 border-emerald-300 text-slate-900' 
                : 'bg-white border-orange-200 text-slate-900 hover:border-orange-400 hover:shadow-md'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-orange-100 text-orange-900 border border-orange-300">
                    Step 1
                  </span>
                  {step1Done ? (
                    <div className="flex items-center gap-1 text-emerald-700 text-xs font-black">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-600 text-xs font-black">
                      <Circle className="w-3.5 h-3.5 text-orange-500" />
                      <span>To Do</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center text-xl shrink-0 shadow-sm">
                    🏫
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    Create a Classroom
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {step1Done 
                    ? `Active workspace created: "${classrooms[0]?.name || 'Your Class'}". You can add more classes anytime.`
                    : 'Set up your first classroom grade (e.g. "Year 5 Blue") to organize your students.'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => {
                    if (onOpenCreateClass) onOpenCreateClass();
                    else if (onNavigateTab) onNavigateTab('My Classes');
                  }}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm ${
                    step1Done 
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20'
                  }`}
                >
                  <span>{step1Done ? 'Manage Classrooms' : 'Create Classroom →'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* STEP 2: ADD STUDENTS & SHARE TEACHER CODE */}
            <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-5 shadow-sm ${
              step2Done 
                ? 'bg-emerald-50/60 border-emerald-300 text-slate-900' 
                : 'bg-white border-emerald-200 text-slate-900 hover:border-emerald-400 hover:shadow-md'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Step 2
                  </span>
                  {step2Done ? (
                    <div className="flex items-center gap-1 text-emerald-700 text-xs font-black">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-black">
                      <Circle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>To Do</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center text-xl shrink-0 shadow-sm">
                    👥
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    Add Students & Share Code
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {step2Done 
                    ? `✅ ${allStudents.length} student(s) enrolled! Give them your Teacher Code below so they can log in via the Student Portal.`
                    : 'Add your student roster, then give them your Teacher Code to log into the Student Portal.'}
                </p>

                {/* How Students Log In (Clean Warm Cream Container) */}
                <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-2 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-orange-900">
                    <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                    <span>How Students Log In:</span>
                  </div>
                  <ol className="text-[11px] text-slate-700 space-y-1 list-decimal list-inside font-semibold leading-snug">
                    <li>Open <strong>Student Portal</strong> on phone or laptop.</li>
                    <li>Enter Code: <strong className="font-mono text-orange-700 uppercase tracking-wider bg-orange-100 px-1.5 py-0.5 rounded border border-orange-300">{teacherCode || 'CODE'}</strong>.</li>
                    <li>Select their name to start learning!</li>
                  </ol>
                </div>

                {/* Quick Copy Code Badge (Light Emerald Theme) */}
                {teacherCode && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-between gap-2 shadow-sm">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block">Teacher Code</span>
                      <span className="text-sm font-black text-slate-900 tracking-wider font-mono">{teacherCode.toUpperCase()}</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                      title="Copy code for students"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('My Classes')}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm ${
                    step2Done 
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                  }`}
                >
                  <span>{step2Done ? 'View Student List' : 'Add Students →'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* STEP 3: GENERATE FIRST AI ASSIGNMENT */}
            <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-5 shadow-sm ${
              step3Done 
                ? 'bg-emerald-50/60 border-emerald-300 text-slate-900' 
                : 'bg-white border-amber-200 text-slate-900 hover:border-amber-400 hover:shadow-md'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Step 3
                  </span>
                  {step3Done ? (
                    <div className="flex items-center gap-1 text-emerald-700 text-xs font-black">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-600 text-xs font-black">
                      <Circle className="w-3.5 h-3.5 text-amber-500" />
                      <span>To Do</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center text-xl shrink-0 shadow-sm">
                    ✨
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    Publish AI Assignment
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {step3Done 
                    ? `${allHomeworks.filter(h => h.status === 'published').length} active assignment(s) published for students to complete.`
                    : 'Generate fresh Maths, English, Science, or NAPLAN assignments tailored to your grade curriculum.'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('Homework/Test Builder')}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm ${
                    step3Done 
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300' 
                      : 'bg-gradient-to-r from-orange-500 to-emerald-600 hover:from-orange-600 hover:to-emerald-700 text-white shadow-md shadow-orange-500/20'
                  }`}
                >
                  <span>{step3Done ? 'Open AI Builder' : 'Generate Homework ✨'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
