import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Info,
  BookOpen,
  Star,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  Clock,
  HelpCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

// ─── Fee Card ─────────────────────────────────────────────────────────────────
const FeeCard = ({ amount, label, description, icon, color, gradient, delay, currency = 'USD', currencySymbol = '$' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`relative overflow-hidden rounded-[28px] p-7 border border-white/60 shadow-md ${gradient}`}
  >
    {/* Glow orb */}
    <div className={`absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-30 ${color}`} />

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-white/60 border border-white/80">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-slate-800 tracking-tight">{currencySymbol}{amount}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{currency}</p>
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-800 leading-tight">{label}</h3>
      <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const resolveGradeFromClassroomName = (classroomName) => {
  if (!classroomName) return 'Grade 1';
  const match = classroomName.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (num >= 1 && num <= 12) {
      return `Grade ${num}`;
    }
  }
  return 'Grade 1';
};

// ─── Main TuitionPayment Component (Informational Only) ────────────────────────
const TuitionPayment = ({ studentName, teacher, classroom }) => {
  const STYLE_MAP = {
    weekly:    { color: 'bg-blue-400',    gradient: 'bg-gradient-to-br from-green-50 to-orange-50' },
    monthly:   { color: 'bg-green-500',  gradient: 'bg-gradient-to-br from-green-50 to-orange-50' },
    term:      { color: 'bg-amber-400',   gradient: 'bg-gradient-to-br from-amber-50 to-orange-50' },
    resources: { color: 'bg-emerald-400', gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50' },
  };

  const studentGrade = resolveGradeFromClassroomName(classroom?.name);
  const [packages, setPackages] = useState([]);
  const [currency, setCurrency] = useState(() => {
    try {
      const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student') || 'null');
      return teacher?.currency || teacher?.tuitionCurrency || savedStudent?.teacher?.currency || savedStudent?.teacher?.tuitionCurrency || 'USD';
    } catch (e) {
      return 'USD';
    }
  });
  const [loading, setLoading] = useState(true);
  const [hasTeacherConfiguredFees, setHasTeacherConfiguredFees] = useState(false);

  const CURRENCIES = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$', NZD: 'NZ$', INR: '₹', ZAR: 'R', SGD: 'S$' };

  useEffect(() => {
    let activeTeacherUid = teacher?.uid;
    let activeClassroomName = classroom?.name;
    let activeClassroomId = classroom?.id;

    try {
      const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student') || 'null');
      if (!activeTeacherUid) activeTeacherUid = savedStudent?.teacher?.uid || savedStudent?.teacherId || savedStudent?.teacher?.id;
      if (!activeClassroomName) activeClassroomName = savedStudent?.classroom?.name || savedStudent?.className;
      if (!activeClassroomId) activeClassroomId = savedStudent?.classroom?.id || savedStudent?.classId;
    } catch (e) {}

    if (!activeTeacherUid) { 
      setLoading(false); 
      setHasTeacherConfiguredFees(false);
      return; 
    }

    const currentStudentGrade = resolveGradeFromClassroomName(activeClassroomName);
    const ref = doc(db, 'teachers', activeTeacherUid, 'settings', 'tuitionFees');

    const unsubscribe = onSnapshot(ref, (snap) => {
      try {
        let loadedPackages = null;
        if (snap.exists()) {
          const data = snap.data();
          const loadedCur = data.currency || data.tuitionCurrency || teacher?.currency || teacher?.tuitionCurrency;
          if (loadedCur) setCurrency(loadedCur);

          // 1. Try matching student's grade (e.g. "Grade 6" or "Grade 1")
          if (data[currentStudentGrade] && Array.isArray(data[currentStudentGrade]) && data[currentStudentGrade].length) {
            loadedPackages = data[currentStudentGrade];
          } 
          // 2. Try matching classroom id or name
          else if (activeClassroomId && data[activeClassroomId] && Array.isArray(data[activeClassroomId])) {
            loadedPackages = data[activeClassroomId];
          }
          else if (activeClassroomName && data[activeClassroomName] && Array.isArray(data[activeClassroomName])) {
            loadedPackages = data[activeClassroomName];
          }
          // 3. Try global / default tuitionPackages
          else if (data.tuitionPackages && Array.isArray(data.tuitionPackages) && data.tuitionPackages.length) {
            loadedPackages = data.tuitionPackages;
          }
          // 4. Try defaultPackages
          else if (data.defaultPackages && Array.isArray(data.defaultPackages) && data.defaultPackages.length) {
            loadedPackages = data.defaultPackages;
          }
        }

        // Only display fee cards if the teacher has actually configured fees for this grade with at least one non-zero amount
        if (loadedPackages && loadedPackages.length > 0) {
          const hasAnyPrice = loadedPackages.some(p => (Number(p.amount) || 0) > 0);
          if (hasAnyPrice) {
            if (loadedPackages[0]?.currency) {
              setCurrency(loadedPackages[0].currency);
            }
            setPackages(
              loadedPackages.map(p => ({
                ...p,
                amount: Number(p.amount) || 0,
                ...(STYLE_MAP[p.id] || STYLE_MAP.weekly),
              }))
            );
            setHasTeacherConfiguredFees(true);
          } else {
            // Teacher has fees configured but set them all to 0
            setPackages([]);
            setHasTeacherConfiguredFees(false);
          }
        } else {
          // No fee schedule exists for this teacher/grade
          setPackages([]);
          setHasTeacherConfiguredFees(false);
        }
      } catch (e) {
        console.warn('Could not process tuition fees snapshot:', e);
        setPackages([]);
        setHasTeacherConfiguredFees(false);
      }
      setLoading(false);
    }, (err) => {
      console.warn('Tuition fees listener error:', err);
      setLoading(false);
      setPackages([]);
      setHasTeacherConfiguredFees(false);
    });

    return () => unsubscribe();
  }, [teacher?.uid, classroom?.name, classroom?.id, studentGrade]);

  const teacherDisplayName = teacher?.displayName || teacher?.name || 'your teacher';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[100%] mx-auto w-full py-4 space-y-8 pb-20 font-sans"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#2D3748] tracking-tighter">Tuition & Fees</h1>
        <p className="text-sm font-medium text-slate-500 mt-1.5 flex items-center gap-2 flex-wrap">
          Fee schedule for <span className="font-bold text-[#EA580C]">{studentName}</span>
          {classroom?.name && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-semibold">{classroom.name}</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-green-500 to-orange-600 text-white shadow-sm shadow-orange-100">
                 ⚡ {studentGrade}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Hero Info Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#EA580C] to-[#5B4FCF] rounded-[32px] p-8 text-white shadow-xl shadow-orange-200">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[24px] flex items-center justify-center text-4xl shadow-lg border border-white/30 shrink-0">
            💰
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-black uppercase tracking-widest text-white/70">Fee Information</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              Your Learning Investment<br/>
              <span className="text-white/80 font-semibold text-lg">Transparent & Simple Pricing</span>
            </h2>
            <p className="text-sm text-white/70 font-medium mt-2 max-w-sm">
              {hasTeacherConfiguredFees 
                ? "These are the current tuition fees set by your teacher. Please contact your teacher directly to arrange payment."
                : `Tuition fee schedule for ${teacherDisplayName} is managed directly with your teacher.`}
            </p>
          </div>
        </div>

        {/* Info pills */}
        <div className="relative z-10 mt-6 grid grid-cols-3 gap-4">
          {[
            { icon: <BookOpen className="w-4 h-4" />, text: 'Set by Teacher' },
            { icon: <Clock className="w-4 h-4" />,    text: 'Updated Anytime' },
            { icon: <Star className="w-4 h-4" />,     text: 'Best Value Plans' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2.5 border border-white/20">
              <span className="text-white/80">{icon}</span>
              <span className="text-xs font-bold text-white/90">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Cards OR Empty State */}
      <div>
        <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          Current Fee Schedule
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 rounded-[28px] bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : hasTeacherConfiguredFees && packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {packages.map((pkg, i) => (
              <FeeCard key={pkg.id || i} {...pkg} delay={i * 0.08} currency={currency} currencySymbol={CURRENCIES[currency] || '$'} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[28px] border border-orange-100 shadow-sm p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center text-3xl mx-auto border border-orange-100 shadow-sm">
              🎓
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800">
                No Fee Schedule Published Yet
              </h3>
              <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                {teacherDisplayName} has not published a public tuition fee schedule for {studentGrade}. Please reach out to your teacher directly for tuition arrangements.
              </p>
            </div>
            {teacher?.email && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                <span>Contact: {teacher.email}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* How to Pay section */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-7 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-green-50 rounded-2xl flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">How to Arrange Payment</h3>
            <p className="text-xs text-slate-500 font-medium">Connect directly with {teacherDisplayName}</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
              bg: 'bg-blue-50',
              text: 'Send a message to your teacher through the Messages section of this app.',
            },
            {
              icon: <Phone className="w-4 h-4 text-emerald-500" />,
              bg: 'bg-emerald-50',
              text: 'Call or text your teacher using the contact information provided.',
            },
            {
              icon: <Mail className="w-4 h-4 text-amber-500" />,
              bg: 'bg-amber-50',
              text: 'Email your teacher or discuss the payment method that works best for your family.',
            },
          ].map(({ icon, bg, text }, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                {icon}
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TuitionPayment;
