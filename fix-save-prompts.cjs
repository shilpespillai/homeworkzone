const fs = require('fs');
let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const newSavePrompts = `  const handleSavePrompts = async () => {
    if (!user?.uid) return;
    setIsSavingPrompts(true);
    try {
      if (isAdmin && promptViewMode === 'global') {
        await saveMasterDefaultPromptsIfAdmin(db, user, masterPromptsMap);
        alert('Global Master Prompts saved successfully! 🌍🚀');
      } else {
        await updateDoc(doc(db, 'teachers', user.uid), {
          subjectPrompts: subjectPrompts
        });
        alert('Personal Subject Prompts saved successfully! 🚀🪄');
      }
    } catch (err) {
      console.error('Save Prompts Error:', err);
      alert('Failed to save prompts. ❌');
    }
    setIsSavingPrompts(false);
  };`;

file = file.replace(/const handleSavePrompts = async \(\) => \{[\s\S]*?setIsSavingPrompts\(false\);\n  \};/, newSavePrompts);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Fixed handleSavePrompts.");
