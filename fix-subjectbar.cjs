const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf-8');
const lines = file.split('\n');

// SubjectBar (lines 4561-4570, 0-indexed 4560-4569):
// Line 4567:      <div className="h-2 ...">
// Line 4568:         <motion.div ... />
// Line 4569:   </div>   <-- this closes the OUTER div (space-y-2), but the inner div (h-2) is never closed!
// Fix: add </div> before the closing </div> on line 4569

// 0-indexed line 4568 is "   </div>" (the old outer close that was wrongly placed)
// We need to insert "     </div>" before line 4569 (0-indexed: 4568)

const lineIdx = 4568; // 0-indexed = line 4569 in 1-indexed
const currentLine = lines[lineIdx];
console.log('Line at 4569 (0-idx 4568):', JSON.stringify(currentLine));
console.log('Line at 4568 (0-idx 4567):', JSON.stringify(lines[lineIdx-1]));
console.log('Line at 4567 (0-idx 4566):', JSON.stringify(lines[lineIdx-2]));

// The structure should be:
// 4567:      <div className="h-2 ...">
// 4568:         <motion.div ... />
// 4569:      </div>    <-- close h-2 div
// 4570:   </div>       <-- close space-y-2 div
// 4571: );

// Currently line 4569 (0-idx 4568) is "   </div>" which only closes the outer
// We need to INSERT "     </div>" at 0-idx 4568, pushing "   </div>" to 4569
lines.splice(lineIdx, 0, '     </div>');

file = lines.join('\n');
fs.writeFileSync('src/App.jsx', file);
console.log('\nFixed! Inserted missing </div> for SubjectBar inner div.');

// Verify
const newLines = file.split('\n');
for (let i = 4559; i < 4595; i++) {
  process.stdout.write((i+1) + ': ' + newLines[i] + '\n');
}
