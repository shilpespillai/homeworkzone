const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

file = file.replace(/Starter \([^\)]+students\)/g, 'Starter (11-20 students)');
file = file.replace(/Growth \([^\)]+students\)/g, 'Growth (21-30 students)');
file = file.replace(/School \([^\)]+students\)/g, 'School (31-150 students)');

file = file.replace(/31[^\d]+100 students/g, '31-100 students');
file = file.replace(/101[^\d]+500 students/g, '101-500 students');
file = file.replace(/501[^\d]+1,000 students/g, '501-1,000 students');

// A,A??
file = file.replace(/<div className="text-2xl mt-0\.5">[^<]+<\/div>/g, '<div className="text-2xl mt-0.5">💡</div>');

// dY r Interactive Plan Calculator
file = file.replace(/<h3 className="text-xl font-black text-slate-800 flex items-center gap-2">\s+[^<]+Interactive Plan Calculator\s+<\/h3>/g, '<h3 className="text-xl font-black text-slate-800 flex items-center gap-2">\n                🧮 Interactive Plan Calculator\n              </h3>');

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file, 'utf-8');
console.log('Fixed regex based replacements!');
