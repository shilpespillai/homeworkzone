const fs = require('fs');
const lines = fs.readFileSync('src/App.jsx', 'utf-8').split('\n');
// Print lines 4555-4600 to see what's broken
for (let i = 4554; i < 4600; i++) {
  console.log((i+1) + ' | ' + lines[i]);
}
