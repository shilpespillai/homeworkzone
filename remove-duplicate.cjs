const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const searchStr = \                  {/* Stripe Loading Overlay */}
                  {isRedirectingStripe && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                      <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <Loader2 className="w-24 h-24 text-blue-100 animate-spin absolute" strokeWidth={3} />
                          <Loader2 className="w-24 h-24 text-blue-600 animate-spin absolute" style={{ animationDuration: '2s', animationDirection: 'reverse' }} strokeWidth={2} strokeDasharray="50 100" />
                          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center relative z-10 shadow-inner">
                            <Lock className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Secure Checkout</h3>
                          <p className="text-xs font-bold text-slate-400">Connecting to Stripe banking portal...</p>
                        </div>
                      </div>
                    </div>
                  )}\;

// replace only the SECOND instance (which is in Tuition Fees because it's further down)
let index1 = file.indexOf(searchStr);
let index2 = file.indexOf(searchStr, index1 + 1);

if (index2 !== -1) {
  file = file.slice(0, index2) + file.slice(index2 + searchStr.length);
  fs.writeFileSync('src/pages/TeacherDashboard.jsx', file, 'utf-8');
  console.log('Removed duplicate overlay from Tuition Fees tab!');
} else {
  console.log('Duplicate not found?');
}
