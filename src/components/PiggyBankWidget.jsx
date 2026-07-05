import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PiggyBankWidget = ({ mySubmissions, currentStudentProfile, teacher, classroom, studentName }) => {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const spentMoney = currentStudentProfile?.spentMoney || 0;

  const totalEarned = useMemo(() => {
    return mySubmissions.reduce((acc, sub) => {
      const correct = sub.correctCount || 0;
      const total = sub.totalQuestions || 0;
      const wrong = total > 0 ? (total - correct) : 0;
      let earned = 0.10 + (correct * 0.05) - (wrong * 0.02);
      if (earned < 0) earned = 0;
      return acc + earned;
    }, 0);
  }, [mySubmissions]);

  const currentBalance = Math.max(0, totalEarned - spentMoney);

  // Compute coins based on current balance
  const coinsToRender = useMemo(() => {
    let remaining = currentBalance;
    const coins = [];
    
    // Using a tiny epsilon to handle floating point precision issues
    const eps = 0.0001;

    const count100 = Math.floor(remaining / 100 + eps);
    remaining -= count100 * 100;
    
    const count10 = Math.floor(remaining / 10 + eps);
    remaining -= count10 * 10;
    
    const count1 = Math.floor(remaining / 1 + eps);
    remaining -= count1 * 1;
    
    const count25c = Math.floor(remaining / 0.25 + eps);

    // Create coin objects
    for (let i = 0; i < count100; i++) coins.push({ id: `100-${i}`, type: 100, label: '$100', color: 'from-slate-800 to-black text-amber-300 border-amber-400' });
    for (let i = 0; i < count10; i++) coins.push({ id: `10-${i}`, type: 10, label: '$10', color: 'from-purple-500 to-indigo-600 text-white border-purple-300' });
    for (let i = 0; i < count1; i++) coins.push({ id: `1-${i}`, type: 1, label: '$1', color: 'from-yellow-300 to-amber-500 text-yellow-900 border-yellow-200' });
    for (let i = 0; i < count25c; i++) coins.push({ id: `25c-${i}`, type: 0.25, label: '25¢', color: 'from-slate-300 to-slate-400 text-slate-800 border-slate-200' });
    
    return coins.reverse(); // So largest coins render first/at bottom if they were stacked normally
  }, [currentBalance]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > currentBalance) return;
    
    setIsSubmitting(true);
    try {
      const newSpent = spentMoney + amount;
      const studentRef = doc(db, 'teachers', teacher.uid, 'classrooms', classroom.id, 'students', studentName.trim().toLowerCase());
      await setDoc(studentRef, { spentMoney: newSpent }, { merge: true });
      setShowWithdraw(false);
      setWithdrawAmount('');
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
     <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col items-center w-full">
       {/* Background decorative blob */}
       <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full blur-3xl"></div>
       
       <h2 className="text-xl font-black text-[#2D3748] flex items-center gap-2 self-start w-full relative z-10">
         <span>🐷</span> Money Jar
       </h2>
       
       <div className="text-3xl font-black text-green-600 mt-2 mb-6 tracking-tight relative z-10">
         ${currentBalance.toFixed(2)}
       </div>

       {/* The Jar */}
       <div className="relative w-48 h-56 mt-2 mb-6 flex-shrink-0">
          {/* Jar Lid */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-200 border-b-4 border-slate-300 rounded-t-xl z-20"></div>
          {/* Jar Body */}
          <div className="absolute top-4 left-0 w-full h-full bg-gradient-to-b from-blue-50/40 to-blue-100/20 border-4 border-slate-200/60 rounded-[40px] rounded-t-[30px] backdrop-blur-sm z-10 flex flex-col-reverse items-center justify-start pb-4 overflow-hidden shadow-[inset_0_-10px_20px_rgba(0,0,0,0.03)]">
            <div className="flex flex-wrap-reverse justify-center gap-1.5 px-3 pt-4 content-end w-full h-full">
              <AnimatePresence>
                {coinsToRender.map((coin, idx) => (
                  <motion.div
                    key={coin.id}
                    initial={{ y: -200, opacity: 0, rotate: Math.random() * 90 - 45 }}
                    animate={{ y: 0, opacity: 1, rotate: Math.random() * 40 - 20 }}
                    transition={{ type: "spring", bounce: 0.5, delay: idx * 0.05 }}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${coin.color} border-2 flex items-center justify-center font-black text-[11px] shadow-sm transform hover:scale-110 cursor-pointer transition-transform shrink-0`}
                  >
                    {coin.label}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Glass reflection */}
            <div className="absolute top-4 right-4 w-6 h-32 bg-white/40 rounded-full blur-[2px] transform -rotate-12 pointer-events-none"></div>
          </div>
       </div>

       <button 
         onClick={() => setShowWithdraw(true)}
         disabled={currentBalance <= 0}
         className="w-full bg-green-50 hover:bg-green-100 text-green-600 font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
       >
         Withdraw Money
       </button>

       {/* Withdraw Modal */}
       <AnimatePresence>
          {showWithdraw && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             >
                <motion.div
                   initial={{ scale: 0.9, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   exit={{ scale: 0.9, y: 20 }}
                   className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl relative"
                >
                   <button onClick={() => setShowWithdraw(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors font-bold">✕</button>
                   <h3 className="text-xl font-black text-slate-800 mb-2">Withdraw Money</h3>
                   <p className="text-sm text-slate-500 mb-6 font-medium">How much would you like to spend from your ${currentBalance.toFixed(2)} balance?</p>
                   
                   <form onSubmit={handleWithdraw} className="space-y-4">
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">$</span>
                        <input 
                           type="number" 
                           step="0.01"
                           min="0.01"
                           max={currentBalance}
                           value={withdrawAmount}
                           onChange={(e) => setWithdrawAmount(e.target.value)}
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-10 pr-4 font-black text-slate-700 outline-none focus:border-green-400 focus:bg-white transition-all text-lg"
                           placeholder="0.00"
                           autoFocus
                           required
                        />
                     </div>
                     <button 
                        type="submit" 
                        disabled={isSubmitting || !withdrawAmount || parseFloat(withdrawAmount) > currentBalance || parseFloat(withdrawAmount) <= 0}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-500/25 transition-all disabled:opacity-50 flex justify-center items-center"
                     >
                        {isSubmitting ? 'Processing...' : 'Confirm Withdrawal'}
                     </button>
                   </form>
                </motion.div>
             </motion.div>
          )}
       </AnimatePresence>
     </div>
  );
};

export default PiggyBankWidget;
