const fs = require('fs');

let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

// 1. Add isResumingSub state and handleResumeSubscription function
const cancelLogicRegex = /(const \[isCancellingSub, setIsCancellingSub\] = useState\(false\);[\s\S]*?const handleCancelSubscription = async \(\) => \{[\s\S]*?^\s*};\n)/m;

const resumeLogic = `  const [isResumingSub, setIsResumingSub] = useState(false);
  const handleResumeSubscription = async () => {
    if (!teacherBilling?.stripeSubscriptionId) return;
    
    setIsResumingSub(true);
    try {
      const response = await fetch('/api/resume-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: teacherBilling.stripeSubscriptionId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to resume');
      
      // Update local state immediately for UI responsiveness
      setTeacherBilling(prev => ({ ...prev, cancelAtPeriodEnd: false }));
      alert("Success! Your subscription has been resumed and will renew automatically.");
    } catch (err) {
      console.error(err);
      alert("Error resuming subscription: " + err.message);
    } finally {
      setIsResumingSub(false);
    }
  };
`;

if (file.includes('handleResumeSubscription')) {
    console.log("Resume function already exists.");
} else if (cancelLogicRegex.test(file)) {
    file = file.replace(cancelLogicRegex, match => match + '\n' + resumeLogic);
    console.log("Injected handleResumeSubscription.");
} else {
    console.log("WARNING: Could not find handleCancelSubscription to inject next to.");
}

// 2. Update Option A UI
const optionABadge = `<div className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center bg-amber-50 text-amber-600 border border-amber-200">
                    Cancels at end of cycle
                  </div>`;
const optionAResume = `<div className="w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center bg-amber-50 text-amber-600 border border-amber-200">
                    Cancels at end of cycle
                  </div>
                  <button
                    onClick={handleResumeSubscription}
                    disabled={isResumingSub}
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-100 flex items-center justify-center gap-2"
                  >
                    {isResumingSub ? 'Resuming...' : 'Resume Plan ♻️'}
                  </button>`;
if (file.includes(optionABadge)) {
    file = file.replace(optionABadge, optionAResume);
    console.log("Updated Option A UI.");
}

// 3. Update Option C UI (it is identical to Option A's badge)
if (file.includes(optionABadge)) {
    file = file.replace(optionABadge, optionAResume);
    console.log("Updated Option C UI.");
}

// 4. Update Option B UI
const optionBBadge = `<div className="px-2 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-wider text-center bg-amber-50 text-amber-600 border border-amber-200">
                             Cancels Next Cycle
                           </div>`;
const optionBResume = `<div className="px-2 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider text-center bg-amber-50 text-amber-600 border border-amber-200 mb-1">
                             Cancels
                           </div>
                           <button
                             onClick={handleResumeSubscription}
                             disabled={isResumingSub}
                             className="px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all text-center border border-emerald-100"
                           >
                             {isResumingSub ? '...' : 'Resume ♻️'}
                           </button>`;

if (file.includes(optionBBadge)) {
    // we use global replace since it might appear in the mapped array 
    // actually it's inside the map so it only appears once in the code
    file = file.replace(optionBBadge, optionBResume);
    console.log("Updated Option B UI.");
} else {
    console.log("WARNING: Could not find Option B badge.");
}

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Resume UI patch complete.");
