import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, CheckCircle2, ShieldCheck, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

const PaperQuotaBoosterModal = ({
  isOpen,
  onClose,
  user,
  currentUsage = 0,
  currentQuota = 25,
  topUpCredits = 0,
  onCreditsUpdated
}) => {
  const [selectedPack, setSelectedPack] = useState('mega'); // 'mini' | 'mega'
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const packs = [
    {
      id: 'mini',
      title: 'Mini Booster',
      price: '$2.00',
      credits: 15,
      unitPrice: '~$0.13 / paper',
      popular: false,
      badge: 'Quick Top-Up',
      bgGradient: 'from-amber-500/10 to-orange-500/10',
      borderColor: 'border-amber-200 hover:border-amber-400',
      selectedBorder: 'border-amber-500 ring-4 ring-amber-100',
      accentColor: 'text-amber-600',
      btnColor: 'bg-amber-500 hover:bg-amber-600',
    },
    {
      id: 'mega',
      title: 'Mega Booster',
      price: '$5.00',
      credits: 50,
      unitPrice: '~$0.10 / paper',
      popular: true,
      badge: '🔥 BEST VALUE (3.3x Papers!)',
      bgGradient: 'from-violet-500/15 via-purple-500/10 to-indigo-500/15',
      borderColor: 'border-violet-300 hover:border-violet-500',
      selectedBorder: 'border-violet-600 ring-4 ring-violet-100',
      accentColor: 'text-violet-600',
      btnColor: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700',
    }
  ];

  const handlePurchase = async () => {
    const pack = packs.find(p => p.id === selectedPack);
    if (!pack) return;

    setIsProcessing(true);
    try {
      if (!user?.uid || !user?.email) {
         throw new Error("User email or ID missing");
      }

      const res = await fetch('/api/billing-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: user.uid,
          email: user.email,
          planId: `booster-${pack.id}`,
          successUrl: `${window.location.origin}/dashboard/teacher?booster_success=true`,
          cancelUrl: `${window.location.origin}/dashboard/teacher`,
          action: 'checkout'
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session');
      
      window.location.href = data.url;
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      alert('Failed to connect to Stripe. Please try again.');
      setIsProcessing(false);
    }
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl overflow-hidden bg-white shadow-2xl rounded-3xl border border-slate-100"
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white overflow-hidden">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-1">
              <span className="p-2 bg-white/20 backdrop-blur-md rounded-2xl text-2xl">⚡</span>
              <div>
                <h3 className="text-xl font-black tracking-tight">Need More Papers?</h3>
                <p className="text-xs font-semibold text-violet-100">Top-Up Booster Packs</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-violet-200 leading-relaxed font-medium">
              You've used <strong className="text-amber-300 font-bold">{currentUsage} / {currentQuota}</strong> papers in your current billing cycle. Purchase a instant booster pack to generate more worksheets right away!
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {successMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10 text-center space-y-3"
              >
                <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-slate-800">{successMessage}</h4>
                <p className="text-xs text-slate-400 font-semibold">Your paper generator is ready!</p>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packs.map((pack) => {
                    const isSelected = selectedPack === pack.id;
                    return (
                      <div
                        key={pack.id}
                        onClick={() => setSelectedPack(pack.id)}
                        className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer bg-gradient-to-b ${pack.bgGradient} ${
                          isSelected ? pack.selectedBorder : pack.borderColor
                        }`}
                      >
                        {pack.popular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-md">
                            {pack.badge}
                          </span>
                        )}
                        <div className="flex items-center justify-between mb-3 mt-1">
                          <h4 className="text-sm font-black text-slate-800">{pack.title}</h4>
                          <span className={`text-xl font-black ${pack.accentColor}`}>{pack.price}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-black text-slate-900 flex items-center gap-1">
                            <span>+{pack.credits}</span>
                            <span className="text-xs font-semibold text-slate-500">Extra Papers</span>
                          </p>
                          <p className="text-[11px] text-slate-400 font-semibold">{pack.unitPrice}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-semibold">Instant Access</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <p className="text-xs text-slate-500 font-medium">
                    Top-up credits are added immediately and never expire. One-time charge with no recurring subscription.
                  </p>
                </div>

                {/* Footer Action */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="w-1/3 py-3 px-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-2/3 py-3 px-4 rounded-2xl text-white font-black text-xs shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Get +{packs.find(p => p.id === selectedPack)?.credits} Extra Papers Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaperQuotaBoosterModal;
