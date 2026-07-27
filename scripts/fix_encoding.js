import fs from 'fs';
import path from 'path';

function fixFileEncoding(filePath) {
  const buf = fs.readFileSync(filePath);
  const text = buf.toString('utf8');
  
  // Check if double-encoded UTF-8 exists (contains common garbled markers like ðŸ or âœ or âš or â€)
  if (/ðŸ|âœ|âš|â€|Â£|â€“|â€”/.test(text)) {
    // Re-decode latin1 bytes to utf8
    const fixed = Buffer.from(text, 'latin1').toString('utf8');
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`Fixed encoding for: ${filePath}`);
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      processDir(full);
    } else if (f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.json') || f.endsWith('.css')) {
      fixFileEncoding(full);
    }
  }
}

processDir('./src');
console.log('Encoding cleanup complete!');
