const fs = require('fs');

// 1. Update TeacherDashboard.jsx
let dashboard = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');
dashboard = dashboard.replace(
    'const optionCAnnual = calculateOptionCAnnual(calcSeats);',
    'const optionCAnnual = calculateOptionCAnnual(Math.max(31, calcSeats));'
);
fs.writeFileSync('src/pages/TeacherDashboard.jsx', dashboard, 'utf-8');

// 2. Update api/billing-session.js
let billing = fs.readFileSync('api/billing-session.js', 'utf-8');
billing = billing.replace(
    '      let quantity = 1;\n      const isDynamic = planId === \\'option-a\\' || planId === \\'option-c\\';\n      if (isDynamic) {\n        quantity = Math.max(1, parseInt(studentCount, 10) || 1);\n      }',
    \      let quantity = 1;
      if (planId === 'option-a') {
        quantity = Math.max(1, parseInt(studentCount, 10) || 1);
      } else if (planId === 'option-c') {
        // Enforce 31 minimum seats for Option C (School Tier)
        quantity = Math.max(31, parseInt(studentCount, 10) || 31);
      }\
);
fs.writeFileSync('api/billing-session.js', billing, 'utf-8');

console.log('Fixed Option C Loophole');
