const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

// ── 1. Replace the entire AdminPricingSettings component ──────────────────────
const adminStart = file.indexOf('\r\nconst AdminPricingSettings = () => {');
const adminEnd = file.indexOf('\r\n};\r\n', adminStart) + '\r\n};\r\n'.length;

if (adminStart === -1) { console.error('AdminPricingSettings start not found'); process.exit(1); }

const before = file.slice(0, adminStart + 2); // keep the \r\n before
const after = file.slice(adminEnd);

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

      {/* ── Prices */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">💳 Subscription Prices</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3 p-4 bg-blue-50 rounded-2xl border-2 border-blue-100">
            <h4 className="text-sm font-black text-blue-700">Option A (Elastic)</h4>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Per Student / Month</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="0.5" className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" value={pricing.optionA_perStudentPerMonth} onChange={(e) => setPricing({...pricing, optionA_perStudentPerMonth: Number(e.target.value)})} />
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
            <h4 className="text-sm font-black text-orange-600">Option B (Flat Tiers)</h4>
            {[
              { label: 'Starter (up to 20)', key: 'optionB_starter_price' },
              { label: 'Growth (up to 30)', key: 'optionB_growth_price' },
              { label: 'School (up to 150)', key: 'optionB_school_price' },
            ].map(({label, key}) => (
              <div key={key}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input type="number" step="1" className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" value={pricing[key]} onChange={(e) => setPricing({...pricing, [key]: Number(e.target.value)})} />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100 col-span-2">
            <h4 className="text-sm font-black text-emerald-700">Option C (Yearly Graduated)</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Tier 1 (≤100) / yr', key: 'optionC_tier1_rate' },
                { label: 'Tier 2 (≤500) / yr', key: 'optionC_tier2_rate' },
                { label: 'Tier 3 (≤1000) / yr', key: 'optionC_tier3_rate' },
                { label: 'Tier 4 (1001+) / yr', key: 'optionC_tier4_rate' },
              ].map(({label, key}) => (
                <div key={key}>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input type="number" step="1" className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" value={pricing[key]} onChange={(e) => setPricing({...pricing, [key]: Number(e.target.value)})} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Seat Limits */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">🪑 Seat Limits (Max Students per Plan)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Free Trial', key: 'free_seatLimit', color: 'bg-slate-50 border-slate-200' },
            { label: 'Option A', key: 'optionA_seatLimit', color: 'bg-blue-50 border-blue-200' },
            { label: 'B Starter', key: 'optionB_starter_maxStudents', color: 'bg-orange-50 border-orange-200' },
            { label: 'B Growth', key: 'optionB_growth_maxStudents', color: 'bg-orange-50 border-orange-200' },
            { label: 'B School', key: 'optionB_school_maxStudents', color: 'bg-orange-50 border-orange-200' },
            { label: 'Option C', key: null, color: 'bg-emerald-50 border-emerald-200', fixed: '∞' },
          ].map(({ label, key, color, fixed }) => (
            <div key={label} className={\`p-3 rounded-2xl border-2 \${color} space-y-1\`}>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">{label}</label>
              {fixed ? (
                <div className="text-2xl font-black text-emerald-600 pt-1">{fixed}</div>
              ) : (
                <input type="number" step="1" min="1"
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                  value={pricing[key] ?? ''}
                  onChange={(e) => setPricing({...pricing, [key]: Number(e.target.value)})} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Paper Quotas */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">📄 Paper Quotas per Plan</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Free Trial', key: 'free_paperQuota', suffix: 'total', color: 'bg-slate-50 border-slate-200' },
            { label: 'Option A', key: 'optionA_paperQuota', suffix: '/month', color: 'bg-blue-50 border-blue-200' },
            { label: 'B Starter', key: 'optionB_starter_paperQuota', suffix: '/month', color: 'bg-orange-50 border-orange-200' },
            { label: 'B Growth', key: 'optionB_growth_paperQuota', suffix: '/month', color: 'bg-orange-50 border-orange-200' },
            { label: 'B School', key: 'optionB_school_paperQuota', suffix: '/month', color: 'bg-orange-50 border-orange-200' },
            { label: 'Option C', key: 'optionC_paperQuota', suffix: '/year', color: 'bg-emerald-50 border-emerald-200' },
          ].map(({ label, key, suffix, color }) => (
            <div key={label} className={\`p-3 rounded-2xl border-2 \${color} space-y-1\`}>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">{label}</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing[key] ?? ''}
                onChange={(e) => setPricing({...pricing, [key]: Number(e.target.value)})} />
              <span className="text-[10px] font-bold text-slate-400 block">{suffix}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
};`;

file = before + newComponent + '\r\n' + after;
fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log('AdminPricingSettings replaced successfully. File length:', file.length);

// ── 2. Fix getPlanSeatLimit: remove Stripe quantity, use globalPricing.optionA_seatLimit
file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const oldSeatLimit = `      case 'option-a':
      case 'option_a_elastic': {
        return (teacherBilling && teacherBilling.quantity) ? teacherBilling.quantity : 10;
      }`;

const newSeatLimit = `      case 'option-a':
      case 'option_a_elastic':
        return globalPricing.optionA_seatLimit ?? 10;`;

if (file.includes(oldSeatLimit)) {
  file = file.replace(oldSeatLimit, newSeatLimit);
  console.log('Fixed getPlanSeatLimit for option-a');
} else {
  console.log('WARNING: old seat limit pattern not found, trying partial...');
  const alt = `return (teacherBilling && teacherBilling.quantity) ? teacherBilling.quantity : 10;`;
  if (file.includes(alt)) {
    file = file.replace(alt, `return globalPricing.optionA_seatLimit ?? 10;`);
    console.log('Fixed via partial match');
  } else {
    console.log('ERROR: Could not find seat limit pattern');
  }
}

// Also fix free plan seat limits to use globalPricing
file = file.replace(
  `if (effectivePlan === 'free_expired' || effectivePlan === 'free_trial' || effectivePlan === 'free') {\r\n      return 5;\r\n    }`,
  `if (effectivePlan === 'free_expired' || effectivePlan === 'free_trial' || effectivePlan === 'free') {\r\n      return globalPricing.free_seatLimit ?? 5;\r\n    }`
);

// Fix Option B seat limits to use globalPricing
file = file.replace(
  `case 'option-b-starter': return 20;`,
  `case 'option-b-starter': return globalPricing.optionB_starter_maxStudents ?? 20;`
);
file = file.replace(
  `case 'option-b-growth': return 30;`,
  `case 'option-b-growth': return globalPricing.optionB_growth_maxStudents ?? 30;`
);
file = file.replace(
  `case 'option-b-school': return 150;`,
  `case 'option-b-school': return globalPricing.optionB_school_maxStudents ?? 150;`
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log('All seat limits updated.');

// ── 3. Update globalPricing default state to include new fields
file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');
const oldDefault = `const [globalPricing, setGlobalPricing] = useState({ optionA_perStudentPerMonth: 5, optionB_starter_price: 50, optionB_growth_price: 80, optionB_school_price: 99, optionC_tier1_rate: 24, optionC_tier2_rate: 20, optionC_tier3_rate: 16, optionC_tier4_rate: 14 });`;
const newDefault = `const [globalPricing, setGlobalPricing] = useState({ optionA_perStudentPerMonth: 5, optionA_seatLimit: 10, optionA_paperQuota: 25, optionB_starter_price: 50, optionB_starter_maxStudents: 20, optionB_starter_paperQuota: 60, optionB_growth_price: 80, optionB_growth_maxStudents: 30, optionB_growth_paperQuota: 100, optionB_school_price: 99, optionB_school_maxStudents: 150, optionB_school_paperQuota: 150, optionC_tier1_rate: 24, optionC_tier2_rate: 20, optionC_tier3_rate: 16, optionC_tier4_rate: 14, optionC_paperQuota: 2500, free_seatLimit: 5, free_paperQuota: 5 });`;

if (file.includes(oldDefault)) {
  file = file.replace(oldDefault, newDefault);
  console.log('Updated globalPricing default state');
} else {
  console.log('WARNING: Could not find globalPricing default state');
}

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);

// ── 4. Pass pricing to all checkCanGeneratePaper calls in TeacherDashboard
file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');
// There's one call at line ~4381
file = file.replace(
  `const quotaInfo = checkCanGeneratePaper({\r\n                 user,\r\n                 isAdmin: isAdminUser,\r\n                 isSuperUser: false,\r\n                 activePlanId,\r\n                 allHomeworks,\r\n                 topUpCredits: teacherData?.topUpCredits || 0\r\n              });`,
  `const quotaInfo = checkCanGeneratePaper({\r\n                 user,\r\n                 isAdmin: isAdminUser,\r\n                 isSuperUser: false,\r\n                 activePlanId,\r\n                 allHomeworks,\r\n                 topUpCredits: teacherData?.topUpCredits || 0,\r\n                 pricing: globalPricing,\r\n              });`
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log('All done with TeacherDashboard.jsx');
