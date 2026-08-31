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
  Trophy
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
          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black flex items-center gap-1.5 border border-indigo-200 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Show Teacher Launchpad ({completedCount}/3)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-[32px] p-6 md:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden space-y-6">
      
      {/* Background Decorative Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-black uppercase tracking-wider border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" />
            <span>Teacher Quick-Start Launchpad</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <span>{allComplete ? '🎉 Setup Complete — You are Ready to Teach!' : 'Get Your Classroom Ready in 3 Simple Steps'}</span>
          </h2>
          <p className="text-xs md:text-sm text-indigo-200 font-medium max-w-2xl">
            {allComplete 
              ? 'All 3 foundation steps are set up! Your students can log in, take assignments, and build concept mastery.'
              : 'Follow these 3 quick steps to launch your digital classroom, onboard your students, and publish your first assignment.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Progress Pill */}
          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black text-white">{completedCount} of 3 Complete ({progressPercent}%)</span>
          </div>

          {/* Minimize / Expand Toggle */}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isCollapsed ? "Expand Launchpad" : "Minimize Launchpad"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {/* Dismiss Button */}
          {allComplete && (
            <button
              onClick={handleDismiss}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Dismiss Launchpad"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden relative z-10">
        <motion.div 
          className="h-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-teal-300 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.5)]"
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
            
            {/* STEP 1: CREATE CLASSROOM */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              step1Done 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100' 
                : 'bg-white/5 border-white/15 text-white hover:border-indigo-400 hover:bg-white/10'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Step 1
                  </span>
                  {step1Done ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-black">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-300 text-xs font-black">
                      <Circle className="w-3.5 h-3.5" />
                      <span>To Do</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/50 flex items-center justify-center text-lg shrink-0">
                    🏫
                  </div>
                  <h3 className="text-base font-black text-white">
                    Create a Classroom
                  </h3>
                </div>

                <p className="text-xs text-indigo-200/80 leading-relaxed font-medium">
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
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  }`}
                >
                  <span>{step1Done ? 'Manage Classrooms' : 'Create Classroom →'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* STEP 2: ADD STUDENTS & SHARE TEACHER CODE */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              step2Done 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100' 
                : 'bg-white/5 border-white/15 text-white hover:border-indigo-400 hover:bg-white/10'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Step 2
                  </span>
                  {step2Done ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-black">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-300 text-xs font-black">
                      <Circle className="w-3.5 h-3.5" />
                      <span>To Do</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-9 h-9 rounded-xl bg-orange-600/50 flex items-center justify-center text-lg shrink-0">
                    👥
                  </div>
                  <h3 className="text-base font-black text-white">
                    Add Students & Code
                  </h3>
                </div>

                <p className="text-xs text-indigo-200/80 leading-relaxed font-medium">
                  {step2Done 
                    ? `${allStudents.length} student(s) enrolled! Give them your Teacher Code to log in.`
                    : 'Add your student roster and share your unique Teacher Code so they can sign in.'}
                </p>

                {/* Quick Copy Code Badge */}
                {teacherCode && (
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2 mt-2">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Your Teacher Code</span>
                      <span className="text-sm font-black text-yellow-300 tracking-wider font-mono">{teacherCode.toUpperCase()}</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-yellow-400" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('My Classes')}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                    step2Done 
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30'
                  }`}
                >
                  <span>{step2Done ? 'View Student List' : 'Add Students →'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* STEP 3: GENERATE FIRST AI ASSIGNMENT */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              step3Done 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100' 
                : 'bg-white/5 border-white/15 text-white hover:border-indigo-400 hover:bg-white/10'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Step 3
                  </span>
                  {step3Done ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-black">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-300 text-xs font-black">
                      <Circle className="w-3.5 h-3.5" />
                      <span>To Do</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/50 flex items-center justify-center text-lg shrink-0">
                    ✨
                  </div>
                  <h3 className="text-base font-black text-white">
                    Publish AI Assignment
                  </h3>
                </div>

                <p className="text-xs text-indigo-200/80 leading-relaxed font-medium">
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
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
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
