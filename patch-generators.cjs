const fs = require('fs');

// ── HomeworkGenerator.jsx ──────────────────────────────────────────────────────
let file = fs.readFileSync('src/pages/HomeworkGenerator.jsx', 'utf-8');

// Add fetchPricing import
if (!file.includes('fetchPricing')) {
  file = file.replace(
    "import { checkCanGeneratePaper, getBaseQuotaForPlan } from '../utils/quotaManager';",
    "import { checkCanGeneratePaper, getBaseQuotaForPlan } from '../utils/quotaManager';\nimport { fetchPricing } from '../utils/pricingConfig';"
  );
  console.log('HomeworkGenerator: added fetchPricing import');
}

// Add pricing state after the first useState we can find that's inside the component
// Find a good injection point - the activePlanId line
const activePlanIdIdx = file.indexOf('  const activePlanId = (teacherBilling');
if (activePlanIdIdx === -1) { console.log('ERROR: could not find activePlanId in HomeworkGenerator'); process.exit(1); }

// Inject pricing state just before activePlanId
if (!file.includes('[pricingData, setPricingData]')) {
  const injection = `  const [pricingData, setPricingData] = React.useState(null);\n  React.useEffect(() => { fetchPricing().then(p => { if(p) setPricingData(p); }); }, []);\n\n`;
  file = file.slice(0, activePlanIdIdx) + injection + file.slice(activePlanIdIdx);
  console.log('HomeworkGenerator: injected pricingData state');
}

// Pass pricing to checkCanGeneratePaper
file = file.replace(
  `  const quotaInfo = checkCanGeneratePaper({\n    user,\n    isAdmin,\n    isSuperUser,\n    activePlanId,\n    allHomeworks,\n    topUpCredits\n  });`,
  `  const quotaInfo = checkCanGeneratePaper({\n    user,\n    isAdmin,\n    isSuperUser,\n    activePlanId,\n    allHomeworks,\n    topUpCredits,\n    pricing: pricingData || undefined,\n  });`
);

fs.writeFileSync('src/pages/HomeworkGenerator.jsx', file);
console.log('HomeworkGenerator.jsx updated');

// ── HomeworkScheduler.jsx ──────────────────────────────────────────────────────
file = fs.readFileSync('src/pages/HomeworkScheduler.jsx', 'utf-8');

if (!file.includes('fetchPricing')) {
  file = file.replace(
    "import { checkCanGeneratePaper } from '../utils/quotaManager';",
    "import { checkCanGeneratePaper } from '../utils/quotaManager';\nimport { fetchPricing } from '../utils/pricingConfig';"
  );
  console.log('HomeworkScheduler: added fetchPricing import');
}

// Find a good injection point
const schedulerActivePlanIdx = file.indexOf('  const activePlanId = (teacherBilling');
if (schedulerActivePlanIdx !== -1 && !file.includes('[schedulerPricing, setSchedulerPricing]')) {
  const injection = `  const [schedulerPricing, setSchedulerPricing] = React.useState(null);\n  React.useEffect(() => { fetchPricing().then(p => { if(p) setSchedulerPricing(p); }); }, []);\n\n`;
  file = file.slice(0, schedulerActivePlanIdx) + injection + file.slice(schedulerActivePlanIdx);
  console.log('HomeworkScheduler: injected pricingData state');
}

// Pass pricing to checkCanGeneratePaper (handles both \n and \r\n)
const oldCall = `  const quotaInfo = checkCanGeneratePaper({\n    user,\n    isAdmin,\n    isSuperUser,\n    activePlanId,\n    allHomeworks,\n    topUpCredits\n  });`;
const newCall = `  const quotaInfo = checkCanGeneratePaper({\n    user,\n    isAdmin,\n    isSuperUser,\n    activePlanId,\n    allHomeworks,\n    topUpCredits,\n    pricing: schedulerPricing || undefined,\n  });`;
if (file.includes(oldCall)) {
  file = file.replace(oldCall, newCall);
  console.log('HomeworkScheduler: pricing passed to checkCanGeneratePaper');
} else {
  console.log('HomeworkScheduler: quota call pattern not matched (may already be updated or uses different whitespace)');
}

fs.writeFileSync('src/pages/HomeworkScheduler.jsx', file);
console.log('HomeworkScheduler.jsx updated');
