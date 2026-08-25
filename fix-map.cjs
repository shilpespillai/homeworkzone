const fs = require('fs');

let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');
const originalLength = file.length;

// Fix the map loop
file = file.replace(
  /activeSubjectKeys\.map\(\(subKey\) => \{\s*const style = resolveSubjectStyle\(subKey\);\s*const displayName = subKey\.charAt\(0\)\.toUpperCase\(\) \+ subKey\.slice\(1\);\s*const hasPrompt = !!subjectPrompts\[subKey\];/,
  `activeSubjectKeys.map((subKey) => {
                             const style = resolveSubjectStyle(subKey);
                             const displayName = subKey.charAt(0).toUpperCase() + subKey.slice(1);
                             const currentMap = (isAdminUser && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
                             const hasPrompt = !!currentMap[subKey];`
);

// Fix handleOpenPromptModal
file = file.replace(
  /const handleOpenPromptModal = \(subKey\) => \{\s*setActivePromptModalSubject\(subKey\);\s*setEditingPromptContent\(subjectPrompts\[subKey\] \|\| getPremiumPromptTemplate\(subKey\)\);\s*\};/,
  `const handleOpenPromptModal = (subKey) => {
    setActivePromptModalSubject(subKey);
    const currentMap = (isAdminUser && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
    setEditingPromptContent(currentMap[subKey] || getPremiumPromptTemplate(subKey));
  };`
);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
if (file.length === originalLength) {
  console.log("WARNING: NOTHING CHANGED.");
} else {
  console.log("Successfully fixed the map loop and handleOpenPromptModal.");
}
