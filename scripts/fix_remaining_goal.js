import fs from 'fs';

let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8');
content = content.replace(/Change Goal ✨ \S+\s+<\/button>/g, 'Change Goal <Pencil className="w-3.5 h-3.5 inline-block ml-1" />\n                          </button>');
fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf8');
console.log('Fixed final Change Goal button');
