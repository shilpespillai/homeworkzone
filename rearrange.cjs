const fs = require('fs');
let lines = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf8').split('\n');

const hwHubStart = lines.findIndex(l => l.includes('/* ── Homework Completion Hub ── */'));
let hwHubEnd = hwHubStart;
while (!lines[hwHubEnd].includes('})()}')) hwHubEnd++;
const hwHubLines = lines.slice(hwHubStart, hwHubEnd + 1);

const goalStart = lines.findIndex(l => l.includes('/* Left: Dino Pizza Party Collaborative Goal'));
let goalEnd = goalStart;
let divDepth = 0;
for (let i = goalStart; i < lines.length; i++) {
   if (lines[i].includes('<div')) divDepth += (lines[i].match(/<div/g) || []).length;
   if (lines[i].includes('</div')) divDepth -= (lines[i].match(/<\/div/g) || []).length;
   if (divDepth === 0 && i > goalStart) {
      goalEnd = i;
      break;
   }
}
const goalLines = lines.slice(goalStart, goalEnd + 1);
goalLines[1] = goalLines[1].replace('col-span-5', 'col-span-12 max-w-4xl mx-auto w-full');

const calStart = lines.findIndex(l => l.includes('/* Right: Learning Calendar & Reminder Center'));
let calEnd = calStart;
divDepth = 0;
for (let i = calStart; i < lines.length; i++) {
   if (lines[i].includes('<div')) divDepth += (lines[i].match(/<div/g) || []).length;
   if (lines[i].includes('</div')) divDepth -= (lines[i].match(/<\/div/g) || []).length;
   if (divDepth === 0 && i > calStart) {
      calEnd = i;
      break;
   }
}
const calLines = lines.slice(calStart, calEnd + 1);
calLines[1] = calLines[1].replace('col-span-7', 'h-full');

// Remove blocks in reverse order so indices don't shift
lines.splice(calStart, calEnd - calStart + 1);
lines.splice(goalStart, goalEnd - goalStart + 1);

// Look for the grid wrapper around them to remove
const wrapperStart = lines.findIndex(l => l.includes('/* Collaborative Goal & Calendar Side-by-Side Section */'));
if (wrapperStart !== -1) {
    // We expect wrapperStart, then {activeClassroom && (, then <div className="grid...
    // Also there are closing tags. We'll just replace the wrapperStart with our new layout.
    // Wait, since we deleted the children, there should be a `</div>` and `)}` right below `wrapperStart + 2`.
    lines.splice(wrapperStart, 5); // remove the empty wrapper
}

// Remove hwHub from its original position
const newHwHubStart = lines.findIndex(l => l.includes('/* ── Homework Completion Hub ── */'));
lines.splice(newHwHubStart, hwHubEnd - hwHubStart + 1);

const insertIndex = lines.findIndex(l => l.includes('{/* Split Row: Performance vs Goals / AI Hub */}'));
// We want to insert AFTER the split row grid finishes.
// Let's find the closing of that grid.
let splitRowEnd = insertIndex;
divDepth = 0;
for (let i = insertIndex + 1; i < lines.length; i++) {
   if (lines[i].includes('<div')) divDepth += (lines[i].match(/<div/g) || []).length;
   if (lines[i].includes('</div')) divDepth -= (lines[i].match(/<\/div/g) || []).length;
   if (divDepth === 0 && i > insertIndex + 1) {
      splitRowEnd = i;
      break;
   }
}

const newStructure = [
  '                    {/* Homework Completion & Learning Calendar Row */}',
  '                    {activeClassroom && (',
  '                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">',
  '                          <div className="space-y-6">',
  ...hwHubLines.map(l => '                             ' + l.trim()),
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

lines.splice(splitRowEnd + 1, 0, ...newStructure);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', lines.join('\\n'), 'utf8');
console.log('Done');
