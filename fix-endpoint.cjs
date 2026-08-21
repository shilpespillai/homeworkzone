const fs = require('fs');
let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');
content = content.replace(
    /\/api\/verify-booster/g,
    '/api/billing-session'
);
content = content.replace(
    /body: JSON.stringify\(\{ sessionId, teacherId: user.uid \}\)/g,
    \ody: JSON.stringify({ action: 'verify-booster', sessionId, teacherId: user.uid, email: user.email || 'no-email@test.com' })\
);
fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf-8');
console.log('Fixed TeacherDashboard API endpoint');
