const fs = require('fs');

let file = fs.readFileSync('src/pages/TeacherDashboard.jsx', 'utf-8');

const t1 = `  const handleSaveModalPrompt = async () => {
    if (!activePromptModalSubject) return;
    setIsSavingPrompts(true);
    const updatedPrompts = {
      ...subjectPrompts,
      [activePromptModalSubject]: editingPromptContent
    };
    setSubjectPrompts(updatedPrompts);
    if (user?.uid) {
      try {
        await updateDoc(doc(db, 'teachers', user.uid), {
          subjectPrompts: updatedPrompts
        });
        const isMasterSaved = await saveMasterDefaultPromptsIfAdmin(db, user, updatedPrompts);
        if (isMasterSaved) {
          setMasterPromptsMap(updatedPrompts);
        }
      } catch (err) {
        console.error("Save Prompt Error:", err);
      }
    }
    setIsSavingPrompts(false);
    setActivePromptModalSubject(null);
  };`;

const r1 = `  const handleSaveModalPrompt = async () => {
    if (!activePromptModalSubject) return;
    setIsSavingPrompts(true);
    
    if (isAdmin && promptViewMode === 'global') {
      const updatedPrompts = {
        ...masterPromptsMap,
        [activePromptModalSubject]: editingPromptContent
      };
      setMasterPromptsMap(updatedPrompts);
      if (user?.uid) {
        try {
          await saveMasterDefaultPromptsIfAdmin(db, user, updatedPrompts);
        } catch (err) {
          console.error("Save Master Prompt Error:", err);
        }
      }
    } else {
      const updatedPrompts = {
        ...subjectPrompts,
        [activePromptModalSubject]: editingPromptContent
      };
      setSubjectPrompts(updatedPrompts);
      if (user?.uid) {
        try {
          await updateDoc(doc(db, 'teachers', user.uid), {
            subjectPrompts: updatedPrompts
          });
        } catch (err) {
          console.error("Save Prompt Error:", err);
        }
      }
    }
    setActivePromptModalSubject(null);
    setIsSavingPrompts(false);
  };`;

file = file.replace(t1, r1);

fs.writeFileSync('src/pages/TeacherDashboard.jsx', file);
console.log("Fixed handleSaveModalPrompt.");
