import fs from 'fs';

let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8');
content = content.replace(/placeholder="e\.g\. Pizza Party! [^"]*""/g, 'placeholder="e.g. Pizza Party!"');
fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf8');
console.log('Fixed line 7299 syntax error');
