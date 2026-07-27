import fs from 'fs';

let content = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8');

// Replace any occurrence of Change Goal followed by non-alphanumeric chars up to </button>
content = content.replace(/Change Goal[^<]*<\/button>/g, 'Change Goal <Pencil className="w-3.5 h-3.5 inline-block ml-1" />\n                          </button>');

fs.writeFileSync('src/pages/TeacherDashboard.jsx', content, 'utf8');
console.log('Successfully replaced Change Goal button content!');
