const fs = require('fs');

const files = [
  { grade: 10, path: 'C:/Users/ASUS/.gemini/antigravity/brain/981f562c-dd2c-43e1-af7d-5f9726239548/.system_generated/steps/11804/content.md' },
  { grade: 11, path: 'C:/Users/ASUS/.gemini/antigravity/brain/981f562c-dd2c-43e1-af7d-5f9726239548/.system_generated/steps/11808/content.md' },
  { grade: 12, path: 'C:/Users/ASUS/.gemini/antigravity/brain/981f562c-dd2c-43e1-af7d-5f9726239548/.system_generated/steps/11811/content.md' }
];

let curriculumContent = fs.readFileSync('src/data/curriculum.js', 'utf8');

const regex = /<span class="category-code">([^<]+)<\/span>\s*<span class="category-name">([^<]+)<\/span>|<span class="skill-tree-skill-name">([^<]+)<\/span>/g;

let additions = "";

for (let item of files) {
  const content = fs.readFileSync(item.path, 'utf8');
  let match;
  const result = [];
  let currentCategory = "";
  let skillCounter = 1;

  while ((match = regex.exec(content)) !== null) {
    if (match[1] && match[2]) {
      // Found category
      currentCategory = match[1].trim() + " " + match[2].trim();
    } else if (match[3]) {
      // Found skill
      result.push({
        id: `${item.grade}_m_${skillCounter}`,
        title: match[3].trim(),
        category: currentCategory
      });
      skillCounter++;
    }
  }

  console.log(`Parsed ${result.length} skills for Grade ${item.grade}.`);
  additions += `  "Grade ${item.grade}": {\n    "Maths": ${JSON.stringify(result, null, 4).replace(/\n/g, '\n    ')}\n  },\n`;
}

// Remove trailing comma from additions if it's the very last thing, though it's fine since we append it before }; 
// actually JSON doesn't like trailing commas on the last element, but wait, this is a JS object (curriculum.js), so trailing commas are perfectly valid.
// But we inject right before `};`. Let's just make sure it's syntactically sound.

const lastBraceIndex = curriculumContent.lastIndexOf('};');
if (lastBraceIndex > -1) {
  const newContent = curriculumContent.substring(0, lastBraceIndex) + 
                     '  },\n' + additions.trim().replace(/,\s*$/, '') + '\n' +
                     curriculumContent.substring(lastBraceIndex);
                     
  fs.writeFileSync('src/data/curriculum.js', newContent);
  console.log("Injected all three grades successfully!");
} else {
  console.log("Could not find insertion points.");
}
