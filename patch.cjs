const fs = require('fs');

// 1. Fix App.jsx
let app = fs.readFileSync('src/App.jsx', 'utf-8');

if (!app.includes('fetchPricing')) {
  app = app.replace(
    "import { checkIsCorrect } from './utils/checkIsCorrect';",
    "import { checkIsCorrect } from './utils/checkIsCorrect';\nimport { fetchPricing } from './utils/pricingConfig';"
  );
}

if (!app.includes('const [pricing, setPricing]')) {
  app = app.replace(
    "const LandingPage = ({ currentUser, onTeacherLogin, onStudentLogin }) => {\n  const navigate = useNavigate();",
    "const LandingPage = ({ currentUser, onTeacherLogin, onStudentLogin }) => {\n  const navigate = useNavigate();\n  const [pricing, setPricing] = useState({ optionA_perStudentPerMonth: 5.00, optionC_tier1_rate: 24.00 });\n  useEffect(() => { fetchPricing().then(p => { if (p) setPricing(p); }); }, []);"
  );
}

app = app.replace(
  '<div className="text-3xl font-semibold text-slate-900">\n                        .00 <span className="text-sm font-normal text-slate-500">/ student / month</span>\n                      </div>',
  '<div className="text-3xl font-semibold text-slate-900">\n                         <span className="text-sm font-normal text-slate-500">/ student / month</span>\n                      </div>'
);
app = app.replace(
  '<p className="text-2xl font-black text-white">.00</p>',
  '<p className="text-2xl font-black text-white"></p>'
);
app = app.replace(
  'Pay only for active students (–/mo)',
  'Pay only for active students ({pricing.optionA_perStudentPerMonth}–{pricing.optionA_perStudentPerMonth*10}/mo)'
);
app = app.replace(
  'From  to  / yr',
  'From {pricing.optionC_tier1_rate} to  / yr'
);

fs.writeFileSync('src/App.jsx', app);


// 2. Fix TeacherDashboard.jsx
let td = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

if (!td.includes('const [globalPricing, setGlobalPricing]')) {
  // Add state to TeacherDashboard main component
  td = td.replace(
    "const TeacherDashboard = ({ user, onLogout }) => {\n  console.log",
    "const TeacherDashboard = ({ user, onLogout }) => {\n  const [globalPricing, setGlobalPricing] = useState({ optionA_perStudentPerMonth: 5, optionB_starter_price: 50, optionB_growth_price: 80, optionB_school_price: 99, optionC_tier1_rate: 24, optionC_tier2_rate: 20, optionC_tier3_rate: 16, optionC_tier4_rate: 14 });\n  useEffect(() => { fetchPricing().then(p => { if(p) setGlobalPricing(p); }); }, []);\n  console.log"
  );
}

// Replace MRR calculation
td = td.replace(
  "return studentCount * 5.00;",
  "return studentCount * globalPricing.optionA_perStudentPerMonth;"
);

// Replace pricing logic in Subscription section
td = td.replace(
  "const optionAAnnual = calcSeats * 5.00 * 12;",
  "const optionAAnnual = calcSeats * globalPricing.optionA_perStudentPerMonth * 12;"
);

td = td.replace(
  ".00 <span className=\"text-xs font-bold text-slate-400\">/ student / month</span>",
  " <span className=\"text-xs font-bold text-slate-400\">/ student / month</span>"
);

// Option B array
const optionBRegex = /\{\s*id:\s*'option-b-starter',\s*name:\s*'Starter \(11-20 students\)',\s*price:\s*50,\s*seats:\s*20\s*\},\s*\{\s*id:\s*'option-b-growth',\s*name:\s*'Growth \(21-30 students\)',\s*price:\s*80,\s*seats:\s*30\s*\},\s*\{\s*id:\s*'option-b-school',\s*name:\s*'School \(31-150 students\)',\s*price:\s*99,\s*seats:\s*150\s*\}/;

const newOptionB = { id: 'option-b-starter', name: 'Starter (11-20 students)', price: globalPricing.optionB_starter_price, seats: 20 },
                    { id: 'option-b-growth', name: 'Growth (21-30 students)', price: globalPricing.optionB_growth_price, seats: 30 },
                    { id: 'option-b-school', name: 'School (31-150 students)', price: globalPricing.optionB_school_price, seats: 150 };

td = td.replace(optionBRegex, newOptionB);

// Option C array
const optionCRegex = /\{\s*id:\s*'option-c-tier1',\s*name:\s*'Tier 1 \(up to 100\)',\s*price:\s*24,\s*min:\s*1,\s*max:\s*100\s*\},\s*\{\s*id:\s*'option-c-tier2',\s*name:\s*'Tier 2 \(101-500\)',\s*price:\s*20,\s*min:\s*101,\s*max:\s*500\s*\},\s*\{\s*id:\s*'option-c-tier3',\s*name:\s*'Tier 3 \(501-1000\)',\s*price:\s*16,\s*min:\s*501,\s*max:\s*1000\s*\},\s*\{\s*id:\s*'option-c-tier4',\s*name:\s*'Tier 4 \(1001\+\)',\s*price:\s*14,\s*min:\s*1001,\s*max:\s*Infinity\s*\}/;

const newOptionC = { id: 'option-c-tier1', name: 'Tier 1 (up to 100)', price: globalPricing.optionC_tier1_rate, min: 1, max: 100 },
                    { id: 'option-c-tier2', name: 'Tier 2 (101-500)', price: globalPricing.optionC_tier2_rate, min: 101, max: 500 },
                    { id: 'option-c-tier3', name: 'Tier 3 (501-1000)', price: globalPricing.optionC_tier3_rate, min: 501, max: 1000 },
                    { id: 'option-c-tier4', name: 'Tier 4 (1001+)', price: globalPricing.optionC_tier4_rate, min: 1001, max: Infinity };

td = td.replace(optionCRegex, newOptionC);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', td);

console.log("Patched App.jsx and TeacherDashboard.jsx");
