const fs = require('fs');
const content = fs.readFileSync('C:/Users/ASUS/.gemini/antigravity/brain/981f562c-dd2c-43e1-af7d-5f9726239548/.system_generated/steps/11747/content.md', 'utf8');

const firstSkillIndex = content.indexOf('skill-name');
console.log(content.substring(Math.max(0, firstSkillIndex - 1500), firstSkillIndex));
