const fs = require('fs');
const content = fs.readFileSync('C:/Users/ASUS/.gemini/antigravity/brain/981f562c-dd2c-43e1-af7d-5f9726239548/.system_generated/steps/11747/content.md', 'utf8');

const regex = /<span class="category-code">([^<]+)<\/span>\s*<span class="category-name">([^<]+)<\/span>|<span class="skill-tree-skill-name">([^<]+)<\/span>/g;
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
      id: `9_m_${skillCounter}`,
      title: match[3].trim(),
      category: currentCategory
    });
    skillCounter++;
  }
}

console.log(`Parsed ${result.length} skills.`);
if (result.length > 0) {
  console.log("First skill:", result[0]);
  console.log("Last skill:", result[result.length - 1]);
  fs.writeFileSync('parsedDataGrade9Maths.json', JSON.stringify(result, null, 2));
}
