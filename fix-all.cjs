const fs = require('fs');

let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

file = file.replace(
  /{ id: 'option-b-starter', name: 'Starter \\(11-20 students\\)', price: 50, seats: 20 },/g,
  "{ id: 'option-b-starter', name: 'Starter (11-20 students)', price: globalPricing.optionB_starter_price, seats: 20 },"
);
file = file.replace(
  /{ id: 'option-b-growth', name: 'Growth \\(21-30 students\\)', price: 80, seats: 30 },/g,
  "{ id: 'option-b-growth', name: 'Growth (21-30 students)', price: globalPricing.optionB_growth_price, seats: 30 },"
);
file = file.replace(
  /{ id: 'option-b-school', name: 'School \\(31-150 students\\)', price: 99, seats: 150 },/g,
  "{ id: 'option-b-school', name: 'School (31-150 students)', price: globalPricing.optionB_school_price, seats: 150 },"
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);

// Update App.jsx landing page prices dynamically
let appFile = fs.readFileSync('src/App.jsx', 'utf-8');
if (!appFile.includes('fetchPricing')) {
  appFile = appFile.replace(
    "import { checkIsCorrect } from './utils/checkIsCorrect';",
    "import { checkIsCorrect } from './utils/checkIsCorrect';\nimport { fetchPricing } from './utils/pricingConfig';"
  );
}

if (!appFile.includes('const [pricing, setPricing]')) {
  appFile = appFile.replace(
    "const LandingPage = ({ currentUser, onTeacherLogin, onStudentLogin }) => {\n  const navigate = useNavigate();",
    "const LandingPage = ({ currentUser, onTeacherLogin, onStudentLogin }) => {\n  const navigate = useNavigate();\n  const [pricing, setPricing] = useState({ optionA_perStudentPerMonth: 5.00, optionC_tier1_rate: 24.00 });\n  useEffect(() => { fetchPricing().then(p => { if (p) setPricing(p); }); }, []);"
  );
}

appFile = appFile.replace(
  '<div className="text-3xl font-semibold text-slate-900">\n                        .00 <span className="text-sm font-normal text-slate-500">/ student / month</span>\n                      </div>',
  '<div className="text-3xl font-semibold text-slate-900">\n                         <span className="text-sm font-normal text-slate-500">/ student / month</span>\n                      </div>'
);
appFile = appFile.replace(
  '<p className="text-2xl font-black text-white">.00</p>',
  '<p className="text-2xl font-black text-white"></p>'
);
appFile = appFile.replace(
  'Pay only for active students (–/mo)',
  'Pay only for active students ({pricing.optionA_perStudentPerMonth}–{pricing.optionA_perStudentPerMonth*10}/mo)'
);
appFile = appFile.replace(
  'From  to  / yr',
  'From {pricing.optionC_tier1_rate} to  / yr'
);
fs.writeFileSync('src/App.jsx', appFile);
