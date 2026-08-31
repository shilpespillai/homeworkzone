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
          className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-black flex items-center gap-2 border border-orange-200 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span>Show Teacher Launchpad ({completedCount}/3 Complete)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-stone-900 via-slate-900 to-emerald-950 text-white rounded-[32px] p-6 md:p-8 shadow-xl border-2 border-emerald-500/20 relative overflow-hidden space-y-6">
      
      {/* Background Decorative Warm Orange & Emerald Glows */}
      <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-[11px] font-black uppercase tracking-wider border border-orange-400/30">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin-slow" />
            <span>Teacher Quick-Start Launchpad</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <span>{allComplete ? '🎉 Setup Complete — You are Ready to Teach!' : 'Get Your Classroom Ready in 3 Simple Steps'}</span>
          </h2>
          <p className="text-xs md:text-sm text-stone-300 font-medium max-w-2xl">
            {allComplete 
              ? 'All 3 foundation steps are set up! Your students can log in with your code, take assignments, and build mastery.'
              : 'Follow these 3 quick steps to launch your digital classroom, onboard your students, and publish your first assignment.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Progress Pill */}
          <div className="px-4 py-2 rounded-2xl bg-emerald-950/70 border border-emerald-400/30 backdrop-blur-sm flex items-center gap-2 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-xs font-black text-emerald-300">{completedCount} of 3 Complete ({progressPercent}%)</span>
          </div>

          {/* Minimize / Expand Toggle */}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
            title={isCollapsed ? "Expand Launchpad" : "Minimize Launchpad"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {/* Dismiss Button */}
          {allComplete && (
            <button
              onClick={handleDismiss}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Dismiss Launchpad"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar with Orange to Emerald Gradient */}
      <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-white/5 relative z-10">
        <motion.div 
          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400 rounded-full shadow-[0_0_14px_rgba(249,115,22,0.5)]"
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
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 relative z-10"
          >
            
            {/* STEP 1: CREATE CLASSROOM (Warm Amber/Orange Accent) */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              step1Done 
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100' 
                : 'bg-stone-900/80 border-orange-500/30 text-white hover:border-orange-400 hover:bg-stone-900'
            }`}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-orange-500/25 text-orange-300 border border-orange-400/30">
                    Step 1
                  </span>
                  {step1Done ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-black">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-300 text-xs font-black">
                      <Circle className="w-3.5 h-3.5" />
                      <span>To Do</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center justify-center text-lg shrink-0">
                    🏫
                  </div>
                  <h3 className="text-base font-black text-white">
                    Create a Classroom
                  </h3>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-medium">
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
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                    step1Done 
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30'
                  }`}
                >
                  <span>{step1Done ? 'Manage Classrooms' : 'Create Classroom →'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* STEP 2: ADD STUDENTS & SHARE TEACHER CODE (Fresh Emerald Green Accent) */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              step2Done 
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100' 
                : 'bg-stone-900/80 border-emerald-500/30 text-white hover:border-emerald-400 hover:bg-stone-900'
            }`}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                    Step 2
                  </span>
                  {step2Done ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-black">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-emerald-300 text-xs font-black">
                      <Circle className="w-3.5 h-3.5" />
                      <span>To Do</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
                    👥
                  </div>
                  <h3 className="text-base font-black text-white">
                    Add Students & Share Code
                  </h3>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-medium">
                  {step2Done 
                    ? `✅ ${allStudents.length} student(s) enrolled! Give them your Teacher Code below so they can log in via the Student Portal.`
                    : 'Add your student roster, then give them your Teacher Code to log into the Student Portal.'}
                </p>

                {/* Student Login Guide Box with Orangish/Greenish Tint */}
                <div className="p-3 rounded-xl bg-stone-950/80 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-orange-400">
                    <KeyRound className="w-3.5 h-3.5 text-orange-400" />
                    <span>How Students Log In:</span>
                  </div>
                  <ol className="text-[11px] text-stone-200 space-y-1 list-decimal list-inside font-medium leading-snug">
                    <li>Open <strong>Student Portal</strong> on any phone or laptop.</li>
                    <li>Enter Code: <strong className="font-mono text-orange-400 uppercase tracking-wider">{teacherCode || 'CODE'}</strong>.</li>
                    <li>Select their name to start learning!</li>
                  </ol>
                </div>

                {/* Quick Copy Code Badge */}
                {teacherCode && (
                  <div className="p-2.5 rounded-xl bg-black/60 border border-orange-500/30 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">Teacher Code</span>
                      <span className="text-sm font-black text-orange-400 tracking-wider font-mono">{teacherCode.toUpperCase()}</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md shadow-emerald-900/30"
                      title="Copy code for students"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                      <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('My Classes')}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                    step2Done 
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                  }`}
                >
                  <span>{step2Done ? 'View Student List' : 'Add Students →'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* STEP 3: GENERATE FIRST AI ASSIGNMENT (Orange + Emerald Fusion Accent) */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              step3Done 
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100' 
                : 'bg-stone-900/80 border-amber-500/30 text-white hover:border-amber-400 hover:bg-stone-900'
            }`}>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/30">
                    Step 3
                  </span>
                  {step3Done ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-black">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-300 text-xs font-black">
                      <Circle className="w-3.5 h-3.5" />
                      <span>To Do</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-lg shrink-0">
                    ✨
                  </div>
                  <h3 className="text-base font-black text-white">
                    Publish AI Assignment
                  </h3>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-medium">
                  {step3Done 
                    ? `${allHomeworks.filter(h => h.status === 'published').length} active assignment(s) published for students to complete.`
                    : 'Generate fresh Maths, English, Science, or NAPLAN assignments tailored to your grade curriculum.'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('Homework/Test Builder')}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                    step3Done 
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-500 hover:to-emerald-500 text-white shadow-lg shadow-orange-600/25'
                  }`}
                >
                  <span>{step3Done ? 'Open AI Builder' : 'Generate Homework ✨'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
