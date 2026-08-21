const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const targetA1 = `{teacherBilling?.cancelAtPeriodEnd ? (
                  <div className="w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center bg-amber-50 text-amber-600 border border-amber-200">
                    Cancels at end of cycle
                  </div>
                  <button
                    onClick={handleResumeSubscription}
                    disabled={isResumingSub}
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-100 flex items-center justify-center gap-2"
                  >
                    {isResumingSub ? 'Resuming...' : 'Resume Plan ♻️'}
                  </button>
                ) : (`;

const replaceA1 = `{teacherBilling?.cancelAtPeriodEnd ? (
                  <>
                    <div className="w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center bg-amber-50 text-amber-600 border border-amber-200">
                      Cancels at end of cycle
                    </div>
                    <button
                      onClick={handleResumeSubscription}
                      disabled={isResumingSub}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-100 flex items-center justify-center gap-2"
                    >
                      {isResumingSub ? 'Resuming...' : 'Resume Plan ♻️'}
                    </button>
                  </>
                ) : (`;

file = file.replace(targetA1, replaceA1); // Option A
file = file.replace(targetA1, replaceA1); // Option C (since they use the same badge text)

const targetB1 = `{teacherBilling?.cancelAtPeriodEnd ? (
                           <div className="px-2 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider text-center bg-amber-50 text-amber-600 border border-amber-200 mb-1">
                             Cancels
                           </div>
                           <button
                             onClick={handleResumeSubscription}
                             disabled={isResumingSub}
                             className="px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all text-center border border-emerald-100"
                           >
                             {isResumingSub ? '...' : 'Resume ♻️'}
                           </button>
                        ) : (`;

const replaceB1 = `{teacherBilling?.cancelAtPeriodEnd ? (
                           <>
                             <div className="px-2 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider text-center bg-amber-50 text-amber-600 border border-amber-200 mb-1">
                               Cancels
                             </div>
                             <button
                               onClick={handleResumeSubscription}
                               disabled={isResumingSub}
                               className="px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all text-center border border-emerald-100"
                             >
                               {isResumingSub ? '...' : 'Resume ♻️'}
                             </button>
                           </>
                        ) : (`;

// Option B badge is inside a map, so we replace all globally
file = file.replaceAll(targetB1, replaceB1);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Fixed JSX fragments.");
