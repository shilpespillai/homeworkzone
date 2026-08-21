const fs = require('fs');

let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

// 1. Update handleCancelSubscription
file = file.replace(
  /if \(!window\.confirm\("Are you sure you want to cancel your subscription\? You will retain access until the end of your billing period\."\)\) return;/g,
  'if (!window.confirm("Are you sure you want to cancel your subscription IMMEDIATELY? You will instantly revert to the Free tier and lose access to your paid features right now.")) return;'
);
file = file.replace(
  /body: JSON\.stringify\(\{ subscriptionId: teacherBilling\.stripeSubscriptionId \}\)/g,
  'body: JSON.stringify({ subscriptionId: teacherBilling.stripeSubscriptionId, immediate: true })'
);
file = file.replace(
  /setTeacherBilling\(prev => \(\{ \.\.\.prev, cancelAtPeriodEnd: true \}\)\);/g,
  `setTeacherBilling(prev => ({ ...prev, cancelAtPeriodEnd: false, status: 'canceled', planId: 'free', stripeSubscriptionId: '' }));`
);
file = file.replace(
  /alert\("Your subscription has been canceled\. You will have access until the end of your current billing cycle\."\);/g,
  'alert("Your subscription has been canceled. You have been downgraded to the Free Tier.");'
);

// 2. Remove the old Unsubscribe button from the bottom banner
const oldBannerUnsub = `{teacherBilling.stripeSubscriptionId && !teacherBilling.cancelAtPeriodEnd && teacherBilling.status === 'active' && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={isCancellingSub}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-bold text-xs shadow-sm transition-all"
                  >
                    {isCancellingSub ? 'Canceling...' : 'Unsubscribe 🚫'}
                  </button>
                )}`;
file = file.replace(oldBannerUnsub, "");


// 3. Option A Button Replacement
const optionAOld = `            <button
              onClick={() => handleStripeSession('option-a')}
              disabled={activePlanId === 'option-a' || isRedirectingStripe}
              className={\`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all \${
                activePlanId === 'option-a'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 hover:scale-[1.02]'
              }\`}
            >
              {activePlanId === 'option-a' ? 'Current Plan' : 'Choose Option A'}
            </button>`;

const optionANew = `            {activePlanId === 'option-a' ? (
              <div className="flex flex-col gap-2">
                <div className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center bg-slate-100 text-slate-500 border-2 border-slate-200">
                  Current Active Plan
                </div>
                {!teacherBilling?.cancelAtPeriodEnd && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancellingSub}
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100 flex items-center justify-center gap-2"
                >
                  {isCancellingSub ? 'Canceling...' : 'Unsubscribe 🚫'}
                </button>
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

file = file.replace(optionAOld, optionANew);

// 4. Option B Buttons Replacement
const optionBOld = `                    <button
                      onClick={() => handleStripeSession(tier.id)}
                      disabled={activePlanId === tier.id || isRedirectingStripe}
                      className={\`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all \${
                        activePlanId === tier.id
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                      }\`}
                    >
                      {activePlanId === tier.id ? 'Current' : \`$\${tier.price}/mo\`}
                    </button>`;

const optionBNew = `                    {activePlanId === tier.id ? (
                      <div className="flex flex-col gap-1 w-24">
                        <div className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider text-center bg-slate-100 text-slate-500">
                          Active
                        </div>
                        {!teacherBilling?.cancelAtPeriodEnd && (
                        <button
                          onClick={handleCancelSubscription}
                          disabled={isCancellingSub}
                          className="px-2 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all text-center"
                        >
                          {isCancellingSub ? '...' : 'Unsubscribe'}
                        </button>
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

file = file.replace(optionBOld, optionBNew);

// 5. Option C Button Replacement
const optionCOld = `            <button
              onClick={() => handleStripeSession('option-c')}
              disabled={activePlanId === 'option-c' || isRedirectingStripe}
              className={\`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all \${
                activePlanId === 'option-c'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 hover:scale-[1.02]'
              }\`}
            >
              {activePlanId === 'option-c' ? 'Current Plan' : 'Choose Option C'}
            </button>`;

const optionCNew = `            {activePlanId === 'option-c' ? (
              <div className="flex flex-col gap-2">
                <div className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center bg-slate-100 text-slate-500 border-2 border-slate-200">
                  Current Active Plan
                </div>
                {!teacherBilling?.cancelAtPeriodEnd && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancellingSub}
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100 flex items-center justify-center gap-2"
                >
                  {isCancellingSub ? 'Canceling...' : 'Unsubscribe 🚫'}
                </button>
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

file = file.replace(optionCOld, optionCNew);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Safely patched buttons.");
