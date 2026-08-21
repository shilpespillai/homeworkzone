const fs = require('fs');
let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const modalJsx = 
      {/* Booster Success Modal */}
      <AnimatePresence>
        {boosterSuccessData && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-6"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center border-8 border-green-50 mb-2">
                <span className="text-5xl">✅</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-800">Payment Verified!</h3>
                <p className="text-slate-600 font-medium">Successfully added <strong className="text-violet-600 font-black">{boosterSuccessData}</strong> papers to your quota.</p>
                <p className="text-sm text-slate-500">Your new papers are immediately available to use.</p>
              </div>
              <button 
                onClick={() => setBoosterSuccessData(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
              >
                Awesome!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booster Error Modal */}
      <AnimatePresence>
        {boosterErrorMsg && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-6"
            >
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center border-8 border-rose-50 mb-2">
                <span className="text-5xl">⚠️</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-800">Verification Notice</h3>
                <p className="text-slate-600 font-medium">{boosterErrorMsg}</p>
                <p className="text-xs text-slate-500">If your payment was successful, it will be added shortly.</p>
              </div>
              <button 
                onClick={() => setBoosterErrorMsg('')}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Verifying Loading Overlay */}
      <AnimatePresence>
        {isVerifyingPayment && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex flex-col items-center justify-center p-4 text-white">
             <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
             <p className="font-bold text-lg animate-pulse">Verifying secure payment...</p>
          </div>
        )}
      </AnimatePresence>
;

content = content.replace(
    '<AgenticHelpAssistant setDashboardTab={setActiveTab} />',
    modalJsx + '\n       <AgenticHelpAssistant setDashboardTab={setActiveTab} />'
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf-8');
console.log('Modals injected perfectly!');
