import fs from 'fs';

let text = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8');

// Replace any remaining replacement characters \uFFFD or garbled markers
text = text.replace(/\uFFFD/g, '');
text = text.replace(/âœ✨|âœ|âš⚠️|âš|â–²|â–¼|â”€|â€¢|âœ”|ðŸ[^\s"'>`]+/g, '');

fs.writeFileSync('src/pages/TeacherDashboard.jsx', text, 'utf8');
console.log('Cleaned all junk markers from TeacherDashboard.jsx');
