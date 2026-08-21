const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

// Remove the third item from Option B
file = file.replace(/\{ id: 'option-b-school', name: 'School \(31-150 students\)', price: 99, seats: 150 \},/g, '');

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file, 'utf-8');
console.log('Removed overlapping Option B tier');
