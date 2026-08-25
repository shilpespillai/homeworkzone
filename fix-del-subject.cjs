const fs = require('fs');

let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const r4 = `  const handleDeleteSubject = async (subKey) => {
    if (await window.confirmCustom(\`Are you sure you want to delete the generic prompt for "\${subKey}"?\`)) {
      if (isAdmin && promptViewMode === 'global') {
        const updated = { ...masterPromptsMap };
        updated[subKey] = null;
        setMasterPromptsMap(updated);
        if (user?.uid) {
          try {
            await saveMasterDefaultPromptsIfAdmin(db, user, updated);
          } catch (err) {
            console.error("Failed to delete from global master:", err);
          }
        }
      } else {
        const updated = { ...subjectPrompts };
        updated[subKey] = null;
        setSubjectPrompts(updated);
        if (user?.uid) {
          try {
            await updateDoc(doc(db, 'teachers', user.uid), {
              subjectPrompts: updated
            });
          } catch (err) {
            console.error("Failed to delete subject prompt from database:", err);
          }
        }
      }
    }
  };`;

file = file.replace(/  const handleDeleteSubject = async \(subKey\) => \{[\s\S]*?\}\n  \};/, r4);
fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Fixed handleDeleteSubject.");
