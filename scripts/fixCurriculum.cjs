const fs = require('fs');

let content = fs.readFileSync('src/data/curriculum.js', 'utf8');

// The error is:
//   }
//   },
//   "Grade X": {
// We want to replace this with:
//   },
//   "Grade X": {

content = content.replace(/}\s*},\s*"Grade 7":/g, '},\n  "Grade 7":');
content = content.replace(/}\s*},\s*"Grade 8":/g, '},\n  "Grade 8":');
content = content.replace(/}\s*},\s*"Grade 9":/g, '},\n  "Grade 9":');
content = content.replace(/}\s*},\s*"Grade 10":/g, '},\n  "Grade 10":');

fs.writeFileSync('src/data/curriculum.js', content);
console.log("Fixed curriculum.js syntax errors.");
