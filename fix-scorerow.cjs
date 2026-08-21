const fs = require('fs');
let file = fs.readFileSync('src/App.jsx', 'utf-8');

// ScoreRow is missing its outer closing </div> and );
// Currently: ...{label}</p>\n     </div>\nconst LegendItem
// Should be: ...{label}</p>\n     </div>\n  </div>\n);\n\nconst LegendItem

const needle = '     </div>\nconst LegendItem';
const replacement = '     </div>\n  </div>\n);\n\nconst LegendItem';

if (file.includes(needle)) {
  file = file.replace(needle, replacement);
  console.log('Fixed ScoreRow closing!');
} else {
  // Try CRLF
  const needleCRLF = '     </div>\r\nconst LegendItem';
  const replacementCRLF = '     </div>\r\n  </div>\r\n);\r\n\r\nconst LegendItem';
  if (file.includes(needleCRLF)) {
    file = file.replace(needleCRLF, replacementCRLF);
    console.log('Fixed ScoreRow closing (CRLF)!');
  } else {
    console.log('ERROR: needle not found');
    process.exit(1);
  }
}

fs.writeFileSync('src/App.jsx', file);
console.log('Saved.');

// Verify the LandingPage has pricing state
if (file.includes('const [pricing, setPricing]')) {
  console.log('pricing state: PRESENT');
} else {
  console.log('pricing state: MISSING - needs injection still');
}
