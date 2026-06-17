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
} from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

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
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-white/60 border border-white/80`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-slate-800 tracking-tight">{currencySymbol}{amount}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{currency}</p>
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
  const DEFAULT_PACKAGES = [
    { id: 'weekly',    label: 'Weekly Tuition',  description: 'One week of personalised tuition sessions.',        icon: '📅', amount: 50,  color: 'bg-blue-400',    gradient: 'bg-gradient-to-br from-green-50 to-orange-50' },
    { id: 'monthly',   label: 'Monthly Tuition', description: 'Full month of homework help & learning support.',   icon: '🌟', amount: 180, color: 'bg-green-500',  gradient: 'bg-gradient-to-br from-green-50 to-orange-50' },
    { id: 'term',      label: 'Term Package',    description: 'Best value — a full school term of guided study.',  icon: '🏆', amount: 500, color: 'bg-amber-400',   gradient: 'bg-gradient-to-br from-amber-50 to-orange-50' },
    { id: 'resources', label: 'Resources Fee',   description: 'Worksheets, materials & learning resource pack.',  icon: '📚', amount: 100, color: 'bg-emerald-400', gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50' },
  ];

  const STYLE_MAP = {
    weekly:    { color: 'bg-blue-400',    gradient: 'bg-gradient-to-br from-green-50 to-orange-50' },
    monthly:   { color: 'bg-green-500',  gradient: 'bg-gradient-to-br from-green-50 to-orange-50' },
    term:      { color: 'bg-amber-400',   gradient: 'bg-gradient-to-br from-amber-50 to-orange-50' },
    resources: { color: 'bg-emerald-400', gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50' },
  };

  const studentGrade = resolveGradeFromClassroomName(classroom?.name);
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  const CURRENCIES = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$', NZD: 'NZ$', INR: '₹', ZAR: 'R', SGD: 'S$' };

  useEffect(() => {
    if (!teacher?.uid) { setLoading(false); return; }
    const load = async () => {
      try {
        const ref = doc(db, 'teachers', teacher.uid, 'settings', 'tuitionFees');
        const snap = await getDoc(ref);
        let loadedPackages = null;
        if (snap.exists()) {
          const data = snap.data();
          if (data.currency) setCurrency(data.currency);
          if (data[studentGrade] && data[studentGrade].length) {
            loadedPackages = data[studentGrade];
          }
        }
        if (loadedPackages) {
          setPackages(
            loadedPackages.map(p => ({
              ...p,
              ...(STYLE_MAP[p.id] || STYLE_MAP.weekly),
            }))
          );
        } else {
          setPackages(DEFAULT_PACKAGES.map(pkg => ({
            ...pkg,
            amount: 0,
            ...(STYLE_MAP[pkg.id] || STYLE_MAP.weekly),
          })));
        }
      } catch (e) {
        console.warn('Could not load tuition fees, using defaults:', e);
        setPackages(DEFAULT_PACKAGES.map(pkg => ({
          ...pkg,
          amount: 0,
          ...(STYLE_MAP[pkg.id] || STYLE_MAP.weekly),
        })));
      }
      setLoading(false);
    };
    load();
  }, [teacher?.uid, classroom?.name, studentGrade]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[100%] mx-auto w-full py-4 space-y-8 pb-20"
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
              These are the current tuition fees set by your teacher. Please contact your teacher directly to arrange payment.
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

      {/* Fee Cards */}
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
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {packages.map((pkg, i) => (
              <FeeCard key={pkg.id} {...pkg} delay={i * 0.08} currency={currency} currencySymbol={CURRENCIES[currency] || '$'} />
            ))}
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
            <h3 className="text-base font-bold text-slate-800">How to Pay</h3>
            <p className="text-xs text-slate-500 font-medium">Contact your teacher to arrange payment</p>
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
              text: 'Call or text your teacher using the contact information they provided.',
            },
            {
              icon: <Mail className="w-4 h-4 text-amber-500" />,
              bg: 'bg-amber-50',
              text: 'Email your teacher or parent to discuss the payment method that works best for your family.',
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

      {/* Note */}
      <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-[24px] p-5">
        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-800">Fees may change each term</p>
          <p className="text-xs text-amber-700 font-medium mt-0.5 leading-relaxed">
            Your teacher updates these fees directly. Always check this page at the start of each term or speak to your teacher for the latest pricing information.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TuitionPayment;
