const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

file = file.replace(
  /fetch\('\/api\/resume-subscription',\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(\{\s*subscriptionId:\s*teacherBilling\.stripeSubscriptionId\s*\}\)\s*\}\)/,
  `fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: teacherBilling.stripeSubscriptionId, resume: true })
      })`
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
