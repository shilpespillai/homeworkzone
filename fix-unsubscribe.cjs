const fs = require('fs');

let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

// 1. Restore standard cancel logic
const currentCancelFunc = `  const handleCancelSubscription = async () => {
    if (!teacherBilling?.stripeSubscriptionId) return;
    if (!window.confirm("Are you sure you want to cancel your subscription IMMEDIATELY? You will instantly revert to the Free tier and lose access to your paid features right now.")) return;
    
    setIsCancellingSub(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: teacherBilling.stripeSubscriptionId, immediate: true })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to cancel');
      
      // Update local state immediately for UI responsiveness
      setTeacherBilling(prev => ({ ...prev, cancelAtPeriodEnd: false, status: 'canceled', planId: 'free', stripeSubscriptionId: '' }));
      alert("Your subscription has been canceled. You have been downgraded to the Free Tier.");
    } catch (err) {
      console.error(err);
      alert("Error canceling subscription: " + err.message);
    } finally {
      setIsCancellingSub(false);
    }
  };`;

const newCancelFunc = `  const handleCancelSubscription = async () => {
    if (!teacherBilling?.stripeSubscriptionId) return;
    if (!window.confirm("Are you sure you want to cancel your subscription? You will retain access until the end of your billing cycle.")) return;
    
    setIsCancellingSub(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: teacherBilling.stripeSubscriptionId }) // Standard cancel at period end
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to cancel');
      
      // Update local state immediately for UI responsiveness
      setTeacherBilling(prev => ({ ...prev, cancelAtPeriodEnd: true }));
      alert("Your subscription has been scheduled to cancel at the end of the billing cycle.");
    } catch (err) {
      console.error(err);
      alert("Error canceling subscription: " + err.message);
    } finally {
      setIsCancellingSub(false);
    }
  };`;

if (file.includes(currentCancelFunc)) {
  file = file.replace(currentCancelFunc, newCancelFunc);
  console.log("Restored standard cancel logic.");
} else {
  console.log("WARNING: Could not find exact cancel func to replace. Doing regex.");
  file = file.replace(/if \(!window\.confirm\("Are you sure you want to cancel your subscription IMMEDIATELY\? You will instantly revert to the Free tier and lose access to your paid features right now\."\)\) return;/g, 'if (!window.confirm("Are you sure you want to cancel your subscription? You will retain access until the end of your billing cycle.")) return;');
  file = file.replace(/body: JSON\.stringify\(\{ subscriptionId: teacherBilling\.stripeSubscriptionId, immediate: true \}\)/g, 'body: JSON.stringify({ subscriptionId: teacherBilling.stripeSubscriptionId })');
  file = file.replace(/setTeacherBilling\(prev => \(\{ \.\.\.prev, cancelAtPeriodEnd: false, status: 'canceled', planId: 'free', stripeSubscriptionId: '' \}\)\);/g, 'setTeacherBilling(prev => ({ ...prev, cancelAtPeriodEnd: true }));');
  file = file.replace(/alert\("Your subscription has been canceled\. You have been downgraded to the Free Tier\."\);/g, 'alert("Your subscription has been scheduled to cancel at the end of the billing cycle.");');
}

// 2. We'll leave the bottom banner as-is (with Unsubscribe button) or remove it. 
// Let's remove the Unsubscribe button from the bottom banner so there is no duplicate.
const bottomBannerUnsubMatch = /\{teacherBilling\.stripeSubscriptionId && !teacherBilling\.cancelAtPeriodEnd && teacherBilling\.status === 'active' && \([\s\S]*?<button[\s\S]*?onClick=\{handleCancelSubscription\}[\s\S]*?className="flex items-center gap-2 px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-bold text-xs shadow-sm transition-all"[\s\S]*?>[\s\S]*?\{isCancellingSub \? 'Canceling\.\.\.' : 'Unsubscribe 🚫'\}[\s\S]*?<\/button>[\s\S]*?\)\}/;

if (bottomBannerUnsubMatch.test(file)) {
    file = file.replace(bottomBannerUnsubMatch, '');
    console.log("Removed bottom banner Unsubscribe button.");
} else {
    console.log("WARNING: Could not remove bottom banner Unsubscribe button.");
}

// 3. Option A - Insert Unsubscribe logic
const optionARegex = /(<button\s+onClick=\{\(\) => handleStripeSession\('option-a'\)\}\s+disabled=\{activePlanId === 'option-a' \|\| isRedirectingStripe\}\s+className=\{`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all \$\{\s+activePlanId === 'option-a'\s+\? 'bg-slate-100 text-slate-400 cursor-not-allowed'\s+: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 hover:scale-\[1\.02\]'\s+\}`\}\s+>\s+\{activePlanId === 'option-a' \? 'Current Plan' : 'Choose Option A'\}\s+<\/button>)/;

const optionAReplacement = `{activePlanId === 'option-a' ? (
              <div className="flex flex-col gap-2">
                {teacherBilling?.cancelAtPeriodEnd ? (
                  <div className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center bg-amber-50 text-amber-600 border border-amber-200">
                    Cancels at end of cycle
                  </div>
                ) : (
                  <>
                    <div className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center bg-slate-100 text-slate-500 border border-slate-200">
                      Current Plan
                    </div>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isCancellingSub}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100 flex items-center justify-center gap-2"
                    >
                      {isCancellingSub ? 'Canceling...' : 'Unsubscribe 🚫'}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleStripeSession('option-a')}
                disabled={isRedirectingStripe}
                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 hover:scale-[1.02]"
              >
                Choose Option A
              </button>
            )}`;

if (optionARegex.test(file)) {
    file = file.replace(optionARegex, optionAReplacement);
    console.log("Updated Option A button.");
} else {
    console.log("WARNING: Could not update Option A button.");
}

// 4. Option C - Insert Unsubscribe logic
const optionCRegex = /(<button\s+onClick=\{\(\) => handleStripeSession\('option-c'\)\}\s+disabled=\{activePlanId === 'option-c' \|\| isRedirectingStripe\}\s+className=\{`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all \$\{\s+activePlanId === 'option-c'\s+\? 'bg-slate-100 text-slate-400 cursor-not-allowed'\s+: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 hover:scale-\[1\.02\]'\s+\}`\}\s+>\s+\{activePlanId === 'option-c' \? 'Current Plan' : 'Choose Option C'\}\s+<\/button>)/;

const optionCReplacement = `{activePlanId === 'option-c' ? (
              <div className="flex flex-col gap-2">
                {teacherBilling?.cancelAtPeriodEnd ? (
                  <div className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center bg-amber-50 text-amber-600 border border-amber-200">
                    Cancels at end of cycle
                  </div>
                ) : (
                  <>
                    <div className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center bg-slate-100 text-slate-500 border border-slate-200">
                      Current Plan
                    </div>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isCancellingSub}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100 flex items-center justify-center gap-2"
                    >
                      {isCancellingSub ? 'Canceling...' : 'Unsubscribe 🚫'}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleStripeSession('option-c')}
                disabled={isRedirectingStripe}
                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 hover:scale-[1.02]"
              >
                Choose Option C
              </button>
            )}`;

if (optionCRegex.test(file)) {
    file = file.replace(optionCRegex, optionCReplacement);
    console.log("Updated Option C button.");
} else {
    console.log("WARNING: Could not update Option C button.");
}

// 5. Option B - Insert Unsubscribe logic
const optionBRegex = /(<button\s+onClick=\{\(\) => handleStripeSession\(tier\.id\)\}\s+disabled=\{activePlanId === tier\.id \|\| isRedirectingStripe\}\s+className=\{`px-4 py-2\.5 rounded-xl text-\[10px\] font-black uppercase tracking-wider transition-all \$\{\s+activePlanId === tier\.id\s+\? 'bg-slate-100 text-slate-400'\s+: 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'\s+\}`\}\s+>\s+\{activePlanId === tier\.id \? 'Current' : `\$\$\{tier\.price\}\/mo`\}\s+<\/button>)/;

const optionBReplacement = `{activePlanId === tier.id ? (
                      <div className="flex flex-col gap-1 w-24">
                        {teacherBilling?.cancelAtPeriodEnd ? (
                           <div className="px-2 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-wider text-center bg-amber-50 text-amber-600 border border-amber-200">
                             Cancels Next Cycle
                           </div>
                        ) : (
                           <>
                             <div className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-center bg-slate-100 text-slate-500">
                               Active
                             </div>
                             <button
                               onClick={handleCancelSubscription}
                               disabled={isCancellingSub}
                               className="px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all text-center border border-rose-100"
                             >
                               {isCancellingSub ? '...' : 'Unsubscribe'}
                             </button>
                           </>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStripeSession(tier.id)}
                        disabled={isRedirectingStripe}
                        className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
                      >
                        {\`$\${tier.price}/mo\`}
                      </button>
                    )}`;

if (optionBRegex.test(file)) {
    file = file.replace(optionBRegex, optionBReplacement);
    console.log("Updated Option B buttons.");
} else {
    console.log("WARNING: Could not update Option B buttons.");
}

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Successfully rebuilt Unsubscribe UI.");
