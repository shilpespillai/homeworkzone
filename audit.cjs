const fs = require('fs');
const file = fs.readFileSync('src/App.jsx', 'utf-8');
const lines = file.split('\n');

// The error says const LandingPage at line 4589 is unexpected.
// This means something before it is unclosed (parenthesis, bracket, JSX).
// Let's scan backwards from line 4588 to find unclosed parens/brackets.

let depth = 0;
// Scan from the beginning but look for the last unclosed thing before line 4588
// Simple approach: count ( vs ) and [ vs ] and { vs } from the start up to line 4588

let parenDepth = 0, braceDepth = 0, bracketDepth = 0;
let lastUnclosedParen = -1, lastUnclosedBrace = -1, lastUnclosedBracket = -1;

for (let i = 0; i < 4588; i++) {
  const line = lines[i];
  // Skip string-like content by just counting raw chars (rough)
  for (let j = 0; j < line.length; j++) {
    const ch = line[j];
    if (ch === '(') { parenDepth++; lastUnclosedParen = i+1; }
    else if (ch === ')') parenDepth--;
    else if (ch === '{') { braceDepth++; lastUnclosedBrace = i+1; }
    else if (ch === '}') braceDepth--;
    else if (ch === '[') { bracketDepth++; lastUnclosedBracket = i+1; }
    else if (ch === ']') bracketDepth--;
  }
}

console.log('At line 4588:');
console.log('  parenDepth:', parenDepth, '(last opened around line', lastUnclosedParen, ')');
console.log('  braceDepth:', braceDepth, '(last opened around line', lastUnclosedBrace, ')');
console.log('  bracketDepth:', bracketDepth, '(last opened around line', lastUnclosedBracket, ')');

// Print context around SubjectBar - it's probably the one that's broken
console.log('\nLines 4560-4590:');
for (let i = 4559; i < 4590; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
