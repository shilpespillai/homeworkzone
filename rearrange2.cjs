const fs = require('fs');
let lines = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8').split('\n');

const hwLines = lines.slice(2792, 2999);
const goalLines = lines.slice(3113, 3313);
const calLines = lines.slice(3314, 3463);

goalLines[1] = goalLines[1].replace('col-span-5', 'col-span-12 max-w-4xl mx-auto w-full');
calLines[1] = calLines[1].replace('col-span-7', 'h-full');

lines.splice(3314, 149);
lines.splice(3113, 200);
lines.splice(2792, 207);

const sectionStart = lines.findIndex(l => l.includes('/* Collaborative Goal & Calendar Side-by-Side Section */'));
lines.splice(sectionStart, 5);

const newStructure = [
  '                    {/* Homework Completion & Learning Calendar Row */}',
  '                    {activeClassroom && (',
  '                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">',
  '                          <div className="space-y-6">',
  ...hwLines.map(l => '                             ' + l.trim()),
  '                          </div>',
  '                          <div className="space-y-6 flex flex-col h-full">',
  ...calLines.map(l => '                             ' + l.trim()),
  '                          </div>',
  '                       </div>',
  '                    )}',
  '',
  '                    {/* Collaborative Goal Row */}',
  '                    {activeClassroom && (',
  '                       <div className="grid grid-cols-12 gap-6 mt-6">',
  ...goalLines.map(l => '                          ' + l.trim()),
  '                       </div>',
  '                    )}'
];

lines.splice(sectionStart, 0, ...newStructure);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', lines.join('\n'), 'utf8');
console.log('Done rearranging using precise lines!');
