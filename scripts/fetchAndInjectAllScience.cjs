const fs = require('fs');
const path = require('path');

const grades = [
  { gradeName: 'Foundation', urlSuffix: 'foundation', prefix: 'f_s_' },
  { gradeName: 'Grade 1', urlSuffix: 'year-1', prefix: '1_s_' },
  { gradeName: 'Grade 2', urlSuffix: 'year-2', prefix: '2_s_' },
  { gradeName: 'Grade 3', urlSuffix: 'year-3', prefix: '3_s_' },
  { gradeName: 'Grade 4', urlSuffix: 'year-4', prefix: '4_s_' },
  { gradeName: 'Grade 5', urlSuffix: 'year-5', prefix: '5_s_' },
  { gradeName: 'Grade 6', urlSuffix: 'year-6', prefix: '6_s_' },
  { gradeName: 'Grade 7', urlSuffix: 'year-7', prefix: '7_s_' },
  { gradeName: 'Grade 8', urlSuffix: 'year-8', prefix: '8_s_' },
  { gradeName: 'Grade 9', urlSuffix: 'year-9', prefix: '9_s_' },
  { gradeName: 'Grade 10', urlSuffix: 'year-10', prefix: '10_s_' }
];

async function run() {
  console.log("Preparing to load curriculum...");
  const currPath = path.join(__dirname, '../src/data/curriculum.js');
  let rawContent = fs.readFileSync(currPath, 'utf8');
  
  // Transform to CJS temporarily to require it safely
  const tempPath = path.join(__dirname, 'temp_curriculum_science.cjs');
  let cjsContent = rawContent.replace('export const curriculum = ', 'module.exports = ');
  fs.writeFileSync(tempPath, cjsContent);
  
  let curriculum = require('./temp_curriculum_science.cjs');
  
  const regex = /<span class="category-code">([^<]+)<\/span>\s*<span class="category-name">([^<]+)<\/span>|<span class="skill-tree-skill-name">([^<]+)<\/span>/g;

  for (let g of grades) {
    console.log(`Fetching ${g.gradeName} Science...`);
    const res = await fetch(`https://au.ixl.com/science/${g.urlSuffix}`);
    const html = await res.text();
    
    let match;
    const skills = [];
    let currentCategory = "";
    let skillCounter = 1;

    while ((match = regex.exec(html)) !== null) {
      if (match[1] && match[2]) {
        currentCategory = match[1].trim() + " " + match[2].trim();
      } else if (match[3]) {
        skills.push({
          id: `${g.prefix}${skillCounter}`,
          title: match[3].trim(),
          category: currentCategory || "General"
        });
        skillCounter++;
      }
    }
    
    console.log(`Parsed ${skills.length} Science skills for ${g.gradeName}.`);
    
    if (!curriculum[g.gradeName]) {
      curriculum[g.gradeName] = {};
    }
    curriculum[g.gradeName]["Science"] = skills;
  }
  
  // Clean up temp
  fs.unlinkSync(tempPath);
  
  console.log("Writing updated curriculum back...");
  const finalContent = 'export const curriculum = ' + JSON.stringify(curriculum, null, 2) + ';\n';
  fs.writeFileSync(currPath, finalContent);
  console.log("Done!");
}

run().catch(console.error);
