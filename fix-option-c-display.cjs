const fs = require('fs');
let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

content = content.replace(
    'const optionCAnnual = calculateOptionCAnnual(Math.max(31, calcSeats));',
    'const optionCAnnual = calcSeats < 31 ? Infinity : calculateOptionCAnnual(calcSeats);'
);

content = content.replace(
    '<span> / year</span>',
    "<span>{optionCAnnual === Infinity ? 'Not Available' : \\$\ / year}</span>"
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf-8');
console.log('Fixed Option C limit');
