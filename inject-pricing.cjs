const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf-8');

// Check if pricing state already exists in LandingPage
if (file.includes('const [pricing, setPricing]')) {
  console.log('pricing state already present!');
} else {
  console.log('pricing state MISSING - injecting...');
  // Find the exact location to inject - after the navigate line inside LandingPage
  const marker = "const LandingPage = ({ currentUser, onTeacherLogin, onStudentLogin }) => {";
  const idx = file.indexOf(marker);
  if (idx === -1) { console.log('ERROR: could not find LandingPage marker'); process.exit(1); }
  // Find the next newline after the marker
  const endOfMarker = file.indexOf('\n', idx) + 1;
  const injection = "  const [pricing, setPricing] = useState({ optionA_perStudentPerMonth: 5.00, optionB_starter_price: 50, optionB_growth_price: 80, optionB_school_price: 99, optionC_tier1_rate: 24 });\n  useEffect(() => { fetchPricing().then(p => { if (p) setPricing(p); }); }, []);\n";
  file = file.slice(0, endOfMarker) + injection + file.slice(endOfMarker);
  fs.writeFileSync('src/App.jsx', file);
  console.log('Done! Injected pricing state.');
}

// Verify the pricing reference exists
const pricingUsage = file.includes('pricing.optionA_perStudentPerMonth');
console.log('pricing.optionA_perStudentPerMonth referenced:', pricingUsage);
