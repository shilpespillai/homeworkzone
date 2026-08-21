const fs = require('fs');

const file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');
const start = file.indexOf('const AdminPricingSettings = () => {');
const end = file.indexOf('const TeacherDashboard = ');

if (start === -1 || end === -1) {
  console.error("Could not find bounds");
  process.exit(1);
}

const before = file.slice(0, start);
const after = file.slice(end);

const newComponent = `const AdminPricingSettings = () => {
  const [pricing, setPricing] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  
  React.useEffect(() => {
    fetchPricing().then(setPricing);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePricing(pricing);
      alert('Saved! All plans now use the updated pricing, seat limits and paper quotas.');
    } catch(e) {
      alert('Error saving: ' + e.message);
    }
    setSaving(false);
  };

  if (!pricing) return null;

  return (
    <div className="bg-white border-4 border-indigo-100 rounded-[32px] p-8 space-y-8 shadow-lg mb-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-indigo-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Global Pricing Configuration
        </h2>
        <p className="text-xs font-bold text-slate-500">
          Changes saved here instantly update Stripe checkouts, seat limits, and paper quotas across the entire platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* ── Free Trial ─────────────────────────────────────────── */}
        <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border-2 border-slate-200">
          <h4 className="text-sm font-black text-slate-700">Free Trial</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seat Limit</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.free_seatLimit ?? ''}
                onChange={(e) => setPricing({...pricing, free_seatLimit: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paper Quota (Total)</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.free_paperQuota ?? ''}
                onChange={(e) => setPricing({...pricing, free_paperQuota: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* ── Option A ────────────────────────────────────────────── */}
        <div className="space-y-4 p-5 bg-blue-50 rounded-2xl border-2 border-blue-200">
          <h4 className="text-sm font-black text-blue-700">Option A (Elastic)</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price per student / mo</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="0.5" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionA_perStudentPerMonth ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionA_perStudentPerMonth: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seat Limit</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionA_seatLimit ?? ''}
                onChange={(e) => setPricing({...pricing, optionA_seatLimit: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paper Quota / mo</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionA_paperQuota ?? ''}
                onChange={(e) => setPricing({...pricing, optionA_paperQuota: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* ── Option B Starter ────────────────────────────────────── */}
        <div className="space-y-4 p-5 bg-orange-50 rounded-2xl border-2 border-orange-200">
          <h4 className="text-sm font-black text-orange-600">Option B (Starter)</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Flat Price / mo</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionB_starter_price ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionB_starter_price: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seat Limit</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionB_starter_maxStudents ?? ''}
                onChange={(e) => setPricing({...pricing, optionB_starter_maxStudents: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paper Quota / mo</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionB_starter_paperQuota ?? ''}
                onChange={(e) => setPricing({...pricing, optionB_starter_paperQuota: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* ── Option B Growth ─────────────────────────────────────── */}
        <div className="space-y-4 p-5 bg-orange-50 rounded-2xl border-2 border-orange-200">
          <h4 className="text-sm font-black text-orange-600">Option B (Growth)</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Flat Price / mo</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionB_growth_price ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionB_growth_price: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seat Limit</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionB_growth_maxStudents ?? ''}
                onChange={(e) => setPricing({...pricing, optionB_growth_maxStudents: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paper Quota / mo</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionB_growth_paperQuota ?? ''}
                onChange={(e) => setPricing({...pricing, optionB_growth_paperQuota: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* ── Option C ────────────────────────────────────────────── */}
        <div className="space-y-4 p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 col-span-1 md:col-span-2 xl:col-span-4">
          <h4 className="text-sm font-black text-emerald-700">Option C (Yearly Graduated)</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tier 1 (≤100) / yr</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionC_tier1_rate ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionC_tier1_rate: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tier 2 (≤500) / yr</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionC_tier2_rate ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionC_tier2_rate: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tier 3 (≤1000) / yr</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionC_tier3_rate ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionC_tier3_rate: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tier 4 (1001+) / yr</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionC_tier4_rate ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionC_tier4_rate: Number(e.target.value)})} />
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seat Limit</label>
              <div className="text-2xl font-black text-emerald-600 pt-1">∞</div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paper Quota / yr</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionC_paperQuota ?? ''}
                onChange={(e) => setPricing({...pricing, optionC_paperQuota: Number(e.target.value)})} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
};
`;

const result = before + newComponent + after;
fs.writeFileSync('src/pages/TeacherDashboard.jsx', result);
console.log("Updated AdminPricingSettings UI.");
