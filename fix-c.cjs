const fs = require('fs');
let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

// First replace
content = content.replace(
    'const optionCAnnual = calculateOptionCAnnual(Math.max(31, calcSeats));',
    'const optionCAnnual = calcSeats < 31 ? Infinity : calculateOptionCAnnual(calcSeats);'
);

// Second replace
const targetStr = \                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Option C (Graduated Yearly):</span>
                    <span>\\\$\ / year</span>
                  </div>\;

const replaceStr = \                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Option C (Graduated Yearly):</span>
                    <span>{optionCAnnual === Infinity ? 'Not Available' : \\\\\$\\\ / year\\\}</span>
                  </div>\;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf-8');
