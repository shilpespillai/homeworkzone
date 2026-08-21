const fs = require('fs');
let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');
content = content.replace(
    /          setDoc\(doc\(db, 'teachers', user\.uid\), {\n             topUpCredits: increment\(creditsAdded\)\n          }, { merge: true }\)\.catch\(console\.error\);\n/,
    ''
);
fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf-8');
console.log('Removed client-side firestore write');
